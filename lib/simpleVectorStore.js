// lib/simpleVectorStore.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadHealthRecords, recordToDocument } from './dataLoader.js';
import fs from 'fs';
import path from 'path';

class SimpleVectorStore {
  constructor() {
    this.documents = [];
    this.embeddings = [];
    this.embeddingModel = null;
    this.cachePath = path.join(process.cwd(), 'lib', 'data', 'vector_cache.json');
  }

  async initialize() {
    console.log('Loading Google Embeddings model...');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    console.log('Simple vector store initialized (Google embeddings)');
  }

  // Cosine similarity calculation
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have same length');
    }
    
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async loadHealthData() {
    try {
      const healthData = await loadHealthRecords();

      console.log('Processing health data...');
      
      // Convert health data to documents
      this.documents = healthData.map((item, idx) => recordToDocument(item, idx));

      if (this.documents.length === 0) {
        throw new Error('No documents found in health data file');
      }

      // Try cache first
      if (fs.existsSync(this.cachePath)) {
        try {
          const cached = JSON.parse(fs.readFileSync(this.cachePath, 'utf8'));
          if (cached && Array.isArray(cached.documents) && Array.isArray(cached.embeddings) && cached.documents.length === this.documents.length) {
            this.embeddings = cached.embeddings;
            console.log(`Loaded embeddings from cache: ${this.embeddings.length}`);
            return;
          }
        } catch {}
      }

      // Generate embeddings for all documents using Google Embeddings (batched)
      console.log('Generating embeddings (Google, batched)...');
      this.embeddings = [];
      const batchSize = 96;
      for (let i = 0; i < this.documents.length; i += batchSize) {
        const batch = this.documents.slice(i, i + batchSize);
        const request = {
          requests: batch.map(doc => ({ content: { parts: [{ text: doc.content }] } }))
        };
        if (typeof this.embeddingModel.batchEmbedContents === 'function') {
          const res = await this.embeddingModel.batchEmbedContents(request);
          const vectors = res.embeddings?.map(e => Array.from(e.values || [])) || [];
          this.embeddings.push(...vectors);
        } else {
          // Fallback to single-call loop if batch is unavailable
          for (const doc of batch) {
            const result = await this.embeddingModel.embedContent({ content: { parts: [{ text: doc.content }] } });
            const vector = result.embedding?.values || [];
            this.embeddings.push(Array.from(vector));
          }
        }
        if ((i / batchSize) % 10 === 0) {
          console.log(`Embedded ${Math.min(i + batch.length, this.documents.length)} / ${this.documents.length}`);
        }
      }

      // Write cache
      try {
        fs.writeFileSync(this.cachePath, JSON.stringify({ documents: this.documents, embeddings: this.embeddings }));
        console.log('Cached embeddings to disk');
      } catch {}

      console.log(`✅ Loaded ${this.documents.length} documents with embeddings`);
      
    } catch (error) {
      console.error('❌ Error loading health data:', error);
      throw error;
    }
  }

  async search(query, k = 3) {
    if (!this.embeddingModel) {
      throw new Error('Vector store not initialized - call initialize() first');
    }
    
    if (this.documents.length === 0) {
      throw new Error('No documents loaded - call loadHealthData() first');
    }

    try {
      console.log(`Searching for: "${query}"`);
      
      // Create embedding for the query using Google
      const result = await this.embeddingModel.embedContent({
        content: { parts: [{ text: query }] },
      });
      const queryVector = Array.from(result.embedding?.values || []);

      // Calculate similarities with all documents
      const similarities = this.embeddings.map((embedding, idx) => {
        const similarity = this.cosineSimilarity(queryVector, embedding);
        return {
          index: idx,
          similarity: similarity,
          document: this.documents[idx]
        };
      });

      // Sort by similarity (highest first) and take top k
      similarities.sort((a, b) => b.similarity - a.similarity);
      
      const topResults = similarities.slice(0, k);
      console.log(`Found ${topResults.length} results, top similarity: ${topResults[0]?.similarity.toFixed(4)}`);
      
      return topResults.map(item => ({
        document: item.document,
        score: item.similarity
      }));
      
    } catch (error) {
      console.error('❌ Error searching vector store:', error);
      return [];
    }
  }

  async getRelevantContext(query, threshold = 0.3) {
    const results = await this.search(query, 5);
    
    console.log('Search results:');
    results.forEach((result, idx) => {
      console.log(`${idx + 1}. Score: ${result.score.toFixed(4)} - ${result.document.metadata.condition}`);
    });
    
    // Filter by threshold and extract content
    const relevantDocs = results
      .filter(result => result.score > threshold)
      .map(result => result.document.content);
    
    const context = relevantDocs.join('\n\n');
    console.log(`Using ${relevantDocs.length} documents above threshold ${threshold}`);
    
    return context;
  }
}

// Create singleton instance
let vectorStoreInstance = null;

export async function getVectorStore() {
  if (!vectorStoreInstance) {
    vectorStoreInstance = new SimpleVectorStore();
    await vectorStoreInstance.initialize();
    await vectorStoreInstance.loadHealthData();
  }
  return vectorStoreInstance;
}

export { SimpleVectorStore };