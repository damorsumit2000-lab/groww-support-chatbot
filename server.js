const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdf = require('pdf-parse');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { HuggingFaceInferenceEmbeddings } = require('@langchain/community/embeddings/hf');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { HuggingFaceInference } = require('@langchain/community/llms/hf');
const { RetrievalQAChain } = require('langchain/chains');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Storage for documents and vector store
let vectorStore = null;
let documents = [];
let settings = {
  model: 'meta-llama/Llama-3-8b-chat-hf',
  responseStyle: 'balanced',
  temperature: 0.7,
  maxTokens: 800
};

// Model mapping
const MODEL_MAP = {
  'mistral-7b': 'mistralai/Mistral-7B-Instruct-v0.2',
  'llama-3-8b': 'meta-llama/Llama-3-8b-chat-hf',
  'llama-3-70b': 'meta-llama/Llama-3-70b-chat-hf',
  'mixtral-8x7b': 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  'gemma-7b': 'google/gemma-7b-it'
};

// Response style prompts
const STYLE_PROMPTS = {
  concise: 'Provide a brief, direct answer.',
  balanced: 'Provide a clear and informative answer with relevant details.',
  detailed: 'Provide a comprehensive, detailed answer with examples and explanations.',
  expert: 'Provide an expert-level, in-depth analysis with technical details and context.'
};

// Initialize embeddings and LLM
const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY || 'hf_your_api_key_here',
  model: 'sentence-transformers/all-MiniLM-L6-v2'
});

function getLLM() {
  const modelName = MODEL_MAP[settings.model] || MODEL_MAP['llama-3-8b'];
  return new HuggingFaceInference({
    model: modelName,
    apiKey: process.env.HUGGINGFACE_API_KEY || 'hf_your_api_key_here',
    temperature: settings.temperature,
    maxTokens: settings.maxTokens
  });
}

// Extract text from PDF
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info
    };
  } catch (error) {
    throw new Error('Failed to parse PDF: ' + error.message);
  }
}

// Split text into chunks
async function splitText(text) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ['\n\n', '\n', '. ', ' ', '']
  });

  const chunks = await splitter.createDocuments([text]);
  return chunks;
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Upload and train endpoint
app.post('/api/train', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Update settings if provided
    if (req.body.settings) {
      const newSettings = JSON.parse(req.body.settings);
      settings = { ...settings, ...newSettings };
    }

    console.log('Processing PDF:', req.file.originalname);

    // Extract text from PDF
    const pdfData = await extractTextFromPDF(req.file.buffer);
    console.log(`Extracted ${pdfData.text.length} characters from ${pdfData.pages} pages`);

    // Split into chunks
    const chunks = await splitText(pdfData.text);
    console.log(`Created ${chunks.length} chunks`);

    // Create or update vector store
    if (!vectorStore) {
      vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
    } else {
      await vectorStore.addDocuments(chunks);
    }

    // Store document metadata
    const docId = Date.now().toString();
    documents.push({
      id: docId,
      name: req.file.originalname,
      uploadedAt: new Date().toISOString(),
      chunks: chunks.length,
      pages: pdfData.pages,
      size: req.file.size
    });

    console.log('Training completed successfully');

    res.json({
      success: true,
      message: 'Document trained successfully',
      chunks: chunks.length,
      pages: pdfData.pages,
      documentId: docId
    });

  } catch (error) {
    console.error('Training error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!vectorStore) {
      return res.status(400).json({ 
        error: 'No documents trained yet. Please upload and train documents first.' 
      });
    }

    console.log('Processing question:', question);

    // Create retrieval chain
    const llm = getLLM();
    const chain = RetrievalQAChain.fromLLM(llm, vectorStore.asRetriever(3));

    // Build prompt with style
    const stylePrompt = STYLE_PROMPTS[settings.responseStyle] || STYLE_PROMPTS.balanced;
    const fullPrompt = `${stylePrompt}\n\nQuestion: ${question}`;

    // Get answer
    const response = await chain.call({ query: fullPrompt });

    console.log('Generated response');

    res.json({
      success: true,
      answer: response.text,
      model: settings.model,
      style: settings.responseStyle
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all documents
app.get('/api/documents', (req, res) => {
  res.json(documents);
});

// Delete document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = documents.findIndex(doc => doc.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }

    documents.splice(index, 1);

    // If no documents left, reset vector store
    if (documents.length === 0) {
      vectorStore = null;
    }

    res.json({ success: true, message: 'Document deleted' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get stats
app.get('/api/stats', (req, res) => {
  const totalChunks = documents.reduce((sum, doc) => sum + doc.chunks, 0);
  const lastUpdated = documents.length > 0 
    ? documents[documents.length - 1].uploadedAt 
    : null;

  res.json({
    totalDocuments: documents.length,
    totalChunks,
    lastUpdated
  });
});

// Update settings
app.post('/api/settings', (req, res) => {
  try {
    settings = { ...settings, ...req.body };
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get settings
app.get('/api/settings', (req, res) => {
  res.json(settings);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Admin panel: http://localhost:${PORT}/admin.html`);
  console.log(`💬 Chatbot: http://localhost:${PORT}/index.html`);
});

module.exports = app;