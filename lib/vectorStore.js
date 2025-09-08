// lib/vectorStore.js
import { IndexFlatIP } from 'faiss-node';
import { pipeline } from '@xenova/transformers';
import fs from 'fs';
import path from 'path';

class VectorStore {
  constructor() {
    this.index = null;
    this.documents = [];
    this.extractor = null;
    this.dimension = 384; // MiniLM-L6-v2 embedding dimension
  }

  async initialize() {
    console.log('Loading embedding model...');
    this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    // Initialize FAISS index
    this.index = new IndexFlatIP(this.dimension);
    
    console.log('Vector store initialized');
  }

  async loadHealthData() {
    try {
      const dataPath = path.join(process.cwd(), 'lib/data/health_data.json');
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      const healthData = JSON.parse(fileContent);

      console.log('Processing health data...');
      
      // Convert health data to documents
      const documents = healthData.map((item, idx) => ({
        id: idx,
        content: `Condition: ${item.Condition}. Year: ${item.Year}. Reported Cases: ${item.Reported_Cases}. Deaths: ${item.Deaths || 'Not Available'}. Affected Demographics: ${item.Affected_Demographics}. Source: ${item.Source}.`,
        metadata: {
          condition: item.Condition,
          year: item.Year,
          cases: item.Reported_Cases,
          deaths: item.Deaths
        }
      }));

      // Generate embeddings for all documents
      const contents = documents.map(doc => doc.content);
      const embeddings = await this.extractor(contents, { pooling: 'mean', normalize: true });
      
      // Add vectors to FAISS index
      const vectors = [];
      for (let i = 0; i < documents.length; i++) {
        const embedding = Array.from(embeddings.data.slice(i * this.dimension, (i + 1) * this.dimension));
        vectors.push(embedding);
      }

      // Add all vectors to the index at once
      this.index.add(vectors);
      this.documents = documents;
      
      console.log(`Added ${documents.length} documents to vector store`);
      
    } catch (error) {
      console.error('Error loading health data:', error);
      throw error;
    }
  }

  async search(query, k = 3) {
    if (!this.extractor || !this.index) {
      throw new Error('Vector store not initialized');
    }

    try {
      // Create embedding for the query
      const queryEmbedding = await this.extractor(query, { pooling: 'mean', normalize: true });
      const queryVector = Array.from(queryEmbedding.data);

      // Search in FAISS index
      const result = this.index.search(queryVector, k);
      
      // Return relevant documents with scores
      return result.labels.map((idx, i) => ({
        document: this.documents[idx],
        score: result.distances[i]
      }));
      
    } catch (error) {
      console.error('Error searching vector store:', error);
      return [];
    }
  }

  async getRelevantContext(query, threshold = 0.5) {
    const results = await this.search(query, 3);
    
    // Filter by threshold and extract content
    const relevantDocs = results
      .filter(result => result.score > threshold)
      .map(result => result.document.content);
    
    return relevantDocs.length > 0 ? relevantDocs.join('\n\n') : '';
  }
}

// Create singleton instance
let vectorStoreInstance = null;

export async function getVectorStore() {
  if (!vectorStoreInstance) {
    vectorStoreInstance = new VectorStore();
    await vectorStoreInstance.initialize();
    await vectorStoreInstance.loadHealthData();
  }
  return vectorStoreInstance;
}

export { VectorStore };