# 🤖 Groww Support Chatbot with AI Training

An intelligent chatbot system with admin panel for uploading PDFs and training the bot using open-source AI models. The bot provides comprehensive, detailed answers based on the trained documentation.

## ✨ Features

- **📤 PDF Upload & Training**: Upload multiple PDFs through an intuitive admin panel
- **🧠 AI-Powered Responses**: Uses open-source models (Llama 3, Mistral, Mixtral, Gemma) for comprehensive answers
- **⚙️ Customizable Settings**: 
  - Choose from multiple AI models
  - Adjust response style (concise, balanced, detailed, expert)
  - Control temperature and token limits
- **📊 Document Management**: Track uploaded documents, chunks, and training stats
- **💬 Smart Retrieval**: Uses vector embeddings for accurate context retrieval
- **🎨 Beautiful UI**: Modern, responsive design for both admin and chat interfaces

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Hugging Face account (free) for API access

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/damorsumit2000-lab/groww-support-chatbot.git
cd groww-support-chatbot
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Hugging Face API key:
```
HUGGINGFACE_API_KEY=hf_your_actual_api_key_here
```

Get your free API key from: https://huggingface.co/settings/tokens

4. **Start the server**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

5. **Access the application**
- **Admin Panel**: http://localhost:3000/admin.html
- **Chatbot**: http://localhost:3000/index.html

## 📖 Usage

### Admin Panel

1. **Upload PDFs**
   - Click the upload area or drag & drop PDF files
   - Multiple files supported (max 10MB each)
   - Files are automatically validated

2. **Configure AI Settings**
   - Select AI model (Llama 3 8B recommended for balance)
   - Choose response style:
     - **Concise**: Brief, direct answers
     - **Balanced**: Clear with relevant details (recommended)
     - **Detailed**: Comprehensive with examples
     - **Expert**: In-depth technical analysis
   - Adjust temperature (0-1) for creativity
   - Set max tokens for response length

3. **Train the Bot**
   - Click "Train Chatbot" after uploading files
   - Monitor progress in real-time
   - View training logs and statistics

4. **Manage Documents**
   - View all trained documents
   - See chunk counts and upload dates
   - Delete documents when needed

### Chatbot Interface

1. Open the chatbot at http://localhost:3000/index.html
2. Type your question about Groww
3. Get comprehensive AI-generated answers based on trained documents
4. Responses include model and style information

## 🏗️ Architecture

### Backend (`server.js`)
- **Express.js** server with REST API
- **Multer** for file upload handling
- **pdf-parse** for PDF text extraction
- **LangChain** for:
  - Text splitting and chunking
  - Vector embeddings (HuggingFace)
  - Vector store (in-memory)
  - Retrieval QA chain
- **HuggingFace Inference** for AI models

### Frontend
- **admin.html**: Admin panel for PDF upload and training
- **index.html**: User-facing chatbot interface
- Pure JavaScript (no frameworks)
- Responsive design with modern CSS

## 🤖 Available AI Models

| Model | Size | Best For | Speed |
|-------|------|----------|-------|
| Mistral 7B | 7B | Fast responses | ⚡⚡⚡ |
| Llama 3 8B | 8B | Balanced (recommended) | ⚡⚡ |
| Llama 3 70B | 70B | Most detailed answers | ⚡ |
| Mixtral 8x7B | 47B | Expert mix | ⚡⚡ |
| Gemma 7B | 7B | Google's model | ⚡⚡ |

## 📊 API Endpoints

### Training & Documents
- `POST /api/train` - Upload and train with PDF
- `GET /api/documents` - List all trained documents
- `DELETE /api/documents/:id` - Delete a document
- `GET /api/stats` - Get training statistics

### Chat
- `POST /api/chat` - Send question, get AI response

### Settings
- `GET /api/settings` - Get current settings
- `POST /api/settings` - Update settings

### Health
- `GET /api/health` - Server health check

## 🔧 Configuration

### Environment Variables
```env
HUGGINGFACE_API_KEY=your_api_key
PORT=3000
NODE_ENV=development
```

### Default Settings
```javascript
{
  model: 'llama-3-8b',
  responseStyle: 'balanced',
  temperature: 0.7,
  maxTokens: 800
}
```

## 📝 How It Works

1. **PDF Upload**: Admin uploads PDF documents
2. **Text Extraction**: PDF content is extracted using pdf-parse
3. **Chunking**: Text is split into 1000-character chunks with 200-character overlap
4. **Embedding**: Chunks are converted to vector embeddings
5. **Storage**: Embeddings stored in vector database
6. **Query**: User asks a question
7. **Retrieval**: Top 3 relevant chunks retrieved using similarity search
8. **Generation**: AI model generates comprehensive answer based on context
9. **Response**: Answer delivered to user with model info

## 🎯 Best Practices

1. **Document Quality**: Upload well-formatted PDFs with clear text
2. **Model Selection**: 
   - Use Llama 3 8B for most cases
   - Use Llama 3 70B for complex queries requiring deep analysis
   - Use Mistral 7B for quick, simple answers
3. **Response Style**: Match style to your use case
4. **Temperature**: 
   - Lower (0.3-0.5) for factual, consistent answers
   - Higher (0.7-0.9) for creative, varied responses
5. **Regular Updates**: Retrain with updated documentation

## 🚀 Deployment

### Deploy to Railway/Render/Heroku

1. Set environment variables in platform dashboard
2. Ensure `HUGGINGFACE_API_KEY` is set
3. Platform will auto-detect Node.js and run `npm start`

### Deploy Frontend to GitHub Pages

The chatbot interface can be deployed to GitHub Pages, but you'll need to update the `API_URL` in `index.html` to point to your deployed backend.

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙋 Support

For issues or questions:
- Open an issue on GitHub
- Contact: wqcyrmx2y5@privaterelay.appleid.com

## 🎉 Acknowledgments

- Built with LangChain
- Powered by Hugging Face models
- Inspired by modern AI chatbot architectures

---

**Made with ❤️ by Sumit Damor**