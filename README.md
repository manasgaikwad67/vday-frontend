# 💕 Valentine's Day — Our Love Story

A private, emotionally powerful romantic web application built with React, Node.js, MongoDB, and AI (Groq API).

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React (Vite), Tailwind, Framer Motion |
| Backend  | Node.js, Express, MongoDB         |
| AI       | Groq API (Llama 3)                |
| Deploy   | Vercel (FE) + Render/Railway (BE) |

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev
```

## Environment Variables

### Backend `.env`

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/vday
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
JWT_SECRET=your_jwt_secret_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password
ENTRY_PASSWORD=our_secret
RELATIONSHIP_START_DATE=2024-02-14
HER_NAME=My Love
MY_NAME=Your Name
```

### Frontend `.env`

```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import on Vercel
3. Set `VITE_API_URL` to your backend URL
4. Deploy

### Backend → Render / Railway
1. Push `backend/` to GitHub
2. Create Web Service
3. Set environment variables
4. Start command: `node server.js`
5. Deploy

## Customization

- **Relationship date**: Set `RELATIONSHIP_START_DATE` in backend `.env`
- **Entry password**: Set `ENTRY_PASSWORD` in backend `.env`
- **Names**: Set `HER_NAME` and `MY_NAME` in backend `.env`
- **Memories**: Use the Admin Dashboard to add photos and captions
- **Secret questions**: Update via Admin Dashboard
- **Background music**: Replace `frontend/public/music/background.mp3`

---

*Built with love. Every line of code is a love letter.* 💖
