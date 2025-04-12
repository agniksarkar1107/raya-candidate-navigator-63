# RAYA Candidate Navigator

A sophisticated AI-powered recruitment platform that streamlines the candidate search and engagement process using advanced natural language processing and machine learning techniques.

## 🚀 Features

- **Intelligent Candidate Search**: Advanced semantic search powered by ChromaDB and Google's Gemini Pro
- **Resume Screening**: Automated analysis of resumes with detailed scoring and insights
- **AI Assistant**: Interactive chat interface for recruitment queries
- **Candidate Engagement**: Automated email generation and outreach
- **Web Search Integration**: Real-time candidate profile discovery
- **Modern UI**: Built with React, TypeScript, and shadcn/ui components

## 🛠️ Tech Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **AI/ML**: 
  - Google Gemini Pro
  - ChromaDB for vector storage
  - LangChain for AI workflows
- **Database**: SQLite (with ChromaDB for vector storage)
- **File Processing**: PyPDF2, python-docx

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Google Cloud API key for Gemini Pro
- Git

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/raya-candidate-navigator-63.git
   cd raya-candidate-navigator-63
   ```

2. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   # Navigate to backend directory
   cd backend

   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt

   # Set up environment variables
   cp .env.example .env
   # Edit .env with your API keys and configuration

   # Start the backend server
   python main.py
   ```

4. **Start Both Servers**
   ```bash
   # From the root directory
   npm run start:all
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
GOOGLE_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

## 📚 API Documentation

The backend provides several key endpoints:

- `/api/ai-assistant/chat`: AI-powered chat interface
- `/api/resume-screening/analyze`: Resume analysis and scoring
- `/api/candidate-search/search`: Semantic candidate search
- `/api/candidate-search/engage`: Candidate engagement and email generation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini Pro for AI capabilities
- ChromaDB for vector storage
- The open-source community for various tools and libraries
