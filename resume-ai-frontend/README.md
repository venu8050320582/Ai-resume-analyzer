# TalentIQ — Resume AI Screening Frontend

React + TypeScript + Vite frontend for the Spring Boot Resume AI Screening backend.

## Requirements
- Node.js 20+ recommended
- Spring Boot backend running at `http://localhost:8080`
- MySQL and Gemini configuration are handled by your backend

## Run
1. Extract this ZIP.
2. Open the extracted `resume-ai-frontend` folder in VS Code.
3. Open a terminal in that folder:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env` (optional if backend uses port 8080).
5. Start the frontend:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:5173`.

## Backend API routes used
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/jobs`
- `GET /api/jobs/{id}`
- `POST /api/jobs`
- `PUT /api/jobs/{id}`
- `DELETE /api/jobs/{id}`
- `POST /api/resumes/upload` (multipart: `fullName`, `email`, optional `phone`, `file`)
- `POST /api/ai/analyze/{resumeId}/{jobId}`
- `GET /api/screening/job/{jobId}`
- `GET /api/screening/{id}`
- `GET /api/screening/resume/{resumeId}`

## Important backend note
Your Spring Boot backend must allow CORS requests from `http://localhost:5173`.
If you have not configured CORS yet, add a Spring MVC CORS configuration allowing that origin and the methods GET, POST, PUT, DELETE, OPTIONS, and headers Authorization, Content-Type.

The frontend stores the JWT in `localStorage` for this learning project. For production, prefer secure, HttpOnly cookies and add stronger server-side authorization and validation.

New users are assigned the `RECRUITER` role by the backend. The frontend reads the role returned from login and displays role-aware controls. Only the backend must enforce authorization; hiding buttons is not security.

## Build for production
```bash
npm run build
npm run preview
```

# Resume AI Screening Platform

A full-stack application that uses Google Gemini AI to analyze resumes, extract candidate information, identify skills, and support recruiters in evaluating candidates.

## Features
- **AI-Powered Resume Analysis:** Extracts key candidate details, work experience, and skill sets using Google Gemini AI.
- **Secure Authentication:** Role-based access and session management powered by JWT.
- **Resume Upload & Parsing:** Seamless upload and processing of candidate resumes.
- **Job Management:** Create and manage job postings with specific skill requirements.
- **Candidate Screening Results:** Automated matching, scoring, and evaluation insights for recruiters.

## Tech Stack
- **AI Engine:** Google Gemini API
- **Authentication:** JSON Web Tokens (JWT)
- **Frontend / Backend:** *(Add your specific frameworks here, e.g., React, Node.js/Express, Python/FastAPI, PostgreSQL/MongoDB)*

## Getting Started

### Prerequisites
- API Key from [Google AI Studio](https://aistudio.google.com/)
- *(Add Node.js, Python, or database prerequisites here)*

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/venu8050320582/AI-resume-screening-platform.git](https://github.com/venu8050320582/AI-resume-screening-platform.git)
   cd AI-resume-screening-platform