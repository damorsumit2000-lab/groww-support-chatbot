# 🚀 Complete Setup Guide

## Step 1: Get Hugging Face API Key

1. Go to https://huggingface.co/
2. Click "Sign Up" (or "Log In" if you have an account)
3. After logging in, go to https://huggingface.co/settings/tokens
4. Click "New token"
5. Give it a name (e.g., "Groww Chatbot")
6. Select "Read" access
7. Click "Generate token"
8. **Copy the token** (starts with `hf_...`)

## Step 2: Local Setup

### Install Node.js
If you don't have Node.js installed:
- Download from https://nodejs.org/ (LTS version recommended)
- Install and verify: `node --version`

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/damorsumit2000-lab/groww-support-chatbot.git
cd groww-support-chatbot

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Configure Environment

Edit `.env` file and add your Hugging Face API key:

```env
HUGGINGFACE_API_KEY=hf_your_actual_token_here
PORT=3000
NODE_ENV=development
```

### Start the Server

```bash
# Start server
npm start

# Or for development with auto-reload
npm run dev
```

### Access the Application

- **Admin Panel**: http://localhost:3000/admin.html
- **Chatbot**: http://localhost:3000/deploy.html
- **Original Chat**: http://localhost:3000/index.html

## Step 3: Train the Bot

1. Open http://localhost:3000/admin.html
2. Upload PDF files (Groww documentation, FAQs, guides)
3. Configure AI settings:
   - Model: Llama 3 8B (recommended)
   - Style: Balanced or Detailed
   - Temperature: 0.7
4. Click "Train Chatbot"
5. Wait for training to complete

## Step 4: Test the Chatbot

1. Open http://localhost:3000/deploy.html
2. Try asking questions like:
   - "How do I redeem mutual funds?"
   - "What are the market timings?"
   - "How does IPO allotment work?"

## Step 5: Deploy to Production (Optional)

### Option A: Deploy to Railway

1. Go to https://railway.app/
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `groww-support-chatbot` repository
5. Add environment variable:
   - Key: `HUGGINGFACE_API_KEY`
   - Value: Your HF token
6. Railway will auto-deploy
7. Get your deployment URL (e.g., `https://your-app.railway.app`)
8. Update `API_URL` in `deploy.html` to your Railway URL

### Option B: Deploy to Render

1. Go to https://render.com/
2. Sign up/Login with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: groww-chatbot
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variable: `HUGGINGFACE_API_KEY`
7. Click "Create Web Service"
8. Update `API_URL` in `deploy.html`

### Option C: Deploy Frontend to GitHub Pages

1. Update `API_URL` in `deploy.html` to your backend URL
2. Go to repository Settings → Pages
3. Source: Deploy from branch `main`
4. Folder: `/` (root)
5. Save
6. Access at: `https://damorsumit2000-lab.github.io/groww-support-chatbot/deploy.html`

## Troubleshooting

### "Cannot connect to server"
- Make sure backend is running: `npm start`
- Check if port 3000 is available
- Verify API_URL in HTML files

### "No documents trained yet"
- Upload PDFs via admin panel
- Wait for training to complete
- Check training logs for errors

### "Invalid API key"
- Verify your Hugging Face token
- Make sure it starts with `hf_`
- Check .env file is properly configured

### "Training failed"
- Check PDF file size (max 10MB)
- Ensure PDF has extractable text (not scanned images)
- Check Hugging Face API quota

## Next Steps

1. ✅ Upload comprehensive Groww documentation
2. ✅ Test with various questions
3. ✅ Adjust AI settings for optimal responses
4. ✅ Deploy to production
5. ✅ Share the chatbot URL with users

## Support

For issues:
- Check logs in terminal
- Review training logs in admin panel
- Open GitHub issue
- Contact: wqcyrmx2y5@privaterelay.appleid.com

---

**Happy Chatting! 🎉**