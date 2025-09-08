// scripts/test-setup.mjs
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getVectorStore } from '../lib/simpleVectorStore.js';
import { loadHealthRecords } from '../lib/dataLoader.js';
import fs from 'fs';
import path from 'path';

// Load environment variables manually
function loadEnvFile() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    // Set environment variables
    Object.assign(process.env, envVars);
    console.log('✅ Environment variables loaded');
  } catch (error) {
    console.log('❌ Could not load .env.local file:', error.message);
    console.log('Make sure you have GEMINI_API_KEY in your .env.local file');
  }
}

loadEnvFile();

async function testSetup() {
  console.log('🧪 Testing Setup...\n');

  // Test 1: Check health datasets (JSON and CSV)
  try {
    const records = await loadHealthRecords();
    console.log('✅ Health datasets loaded:', records.length, 'records');
    if (records.length === 0) {
      console.log('ℹ️ Add JSON/CSV files under lib/data to populate the knowledge base.');
    }
  } catch (error) {
    console.log('❌ Dataset load error:', error.message);
    return;
  }

  // Test 2: Check Gemini API key
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found');
    console.log('📝 Make sure your .env.local file has: GEMINI_API_KEY=your_key_here');
    return;
  }
  console.log('✅ GEMINI_API_KEY found');

  // Test 3: Test Gemini API
  console.log('\n🤖 Testing Gemini API...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Say 'Hello' in one word");
    const response = await result.response;
    console.log('✅ Gemini API Response:', response.text().trim());
  } catch (error) {
    console.log('❌ Gemini API Error:', error.message);
    console.log('🔑 Check your API key and internet connection');
    return;
  }

  // Test 4: Test Vector Store
  console.log('\n🔍 Testing Vector Store...');
  try {
    const vectorStore = await getVectorStore();
    const context = await vectorStore.getRelevantContext('What is malaria?', 0.2);
    
    console.log('✅ Vector Store working');
    console.log('📄 Context length:', context.length);
    if (context.length > 0) {
      console.log('📄 Context preview:', context.substring(0, 150) + '...');
    }
  } catch (error) {
    console.log('❌ Vector Store Error:', error.message);
    return;
  }

  // Test 5: End-to-End Test
  console.log('\n🎯 Testing End-to-End...');
  try {
    const vectorStore = await getVectorStore();
    const context = await vectorStore.getRelevantContext('dengue fever symptoms', 0.2);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Based on this health data context: ${context}
    
    Question: What is dengue fever?
    
    Provide a brief answer and end with "This is not medical advice. Please consult a doctor."`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    console.log('✅ End-to-End Test Successful');
    console.log('🤖 Sample Response:');
    console.log(response.text());
    console.log('\n🎉 All tests passed! Your setup is working correctly.');
    
  } catch (error) {
    console.log('❌ End-to-End Test Error:', error.message);
  }
}

testSetup();