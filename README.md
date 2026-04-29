# AI Learning App

An intelligent learning platform that combines AI-powered chat assistance with document management, flashcards, and quizzes to enhance your learning experience.

## Features

- **AI Chat Interface**: Interactive conversations with AI for learning support
- **Document Management**: Upload and organize learning materials
- **Flashcards**: Create and study flashcards for effective memorization
- **Quizzes**: Take quizzes to test your knowledge
- **Progress Tracking**: Monitor your learning progress over time

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Multer (file uploads)
- JWT Authentication
- Google Gemini AI integration

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend/vite-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Register/Login to your account
2. Upload documents for AI analysis
3. Use the AI chat for learning assistance
4. Create flashcards from your documents
5. Take quizzes to test your knowledge
6. Track your progress in the dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user's documents

### AI Chat
- `POST /api/ai/chat` - Send message to AI

### Flashcards
- `POST /api/flashcards` - Create flashcard
- `GET /api/flashcards` - Get user's flashcards

### Quizzes
- `POST /api/quizzes` - Create quiz
- `GET /api/quizzes` - Get user's quizzes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue on GitHub.