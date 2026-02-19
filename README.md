# Teraleads Senior Full-Stack Assessment

This project is a patient assistant dashboard for a dental clinic, built as a monorepo.

## 📂 Structure
- `client/`: React + Vite + TailwindCSS Frontend
- `server/`: Node.js + Express + PostgreSQL Backend
- `ai-service/`: Python + FastAPI AI Microservice

## 🚀 Quick Start
### Prerequisites
- Docker & Docker Compose
- Node.js v18+
- Python 3.10+

### Running the App
1. **Database**:
   The project uses SQLite for local development (configured in `server/prisma/schema.prisma`). No Docker required for DB.
   
2. **Backend**:
   ```bash
   cd server
   npm install
   npx prisma migrate dev --name init
   npm run dev
   ```
   Server runs on `http://localhost:3000`.

3. **AI Service**:
   ```bash
   cd ai-service
   pip install -r requirements.txt
   # Use python3 or python depending on your system
   python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```
   AI Service runs on `http://localhost:8000`.

4. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`.

## 🤖 AI Disclosure
This project was developed with the assistance of an AI coding agent (Antigravity).
- **Architecture**: The agent helped scaffold the monorepo structure and Docker configuration.
- **Boilerplate**: The agent generated the initial Express and FastAPI boilerplate.
- **Frontend**: The agent generated the initial React components and Tailwind configuration.
- **Logic**: Core business logic and database schema design were refined by the agent based on user requirements.

## 🛠 Tech Stack
- **Frontend**: React, Vite, TailwindCSS, React Query
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL
- **AI Service**: Python, FastAPI
- **DevOps**: Docker Compose

## 🔗 Live Deployments
*URLs will be added here after deployment*
- Frontend: [Link]
- Backend: [Link]
- DB: [Link]

Email: test10@example.com
Password: password123
