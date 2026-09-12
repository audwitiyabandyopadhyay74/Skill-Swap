# 🚀 How to Run Skill Swap

Welcome to **Skill Swap** — A peer-to-peer skill exchange platform featuring real-time WebRTC video calling, collaborative whiteboard, Socket.io instant messaging, and Google Gemini AI Co-Pilot integration.

---

## 🛠️ Prerequisites

Ensure you have the following installed on your machine:
* **Node.js**: `v18.x` or higher
* **npm**: `v9.x` or higher
* **Git**

---

## ⚙️ Environment Configuration

### 1. Backend Environment Variables (`Backend/.env`)
Create a `.env` file inside the `Backend/` directory (or use default fallbacks):

```env
PORT=6000
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=skillswap_super_secret_jwt_key_2026
GEMINI_API_KEY=your_google_gemini_api_key
```

### 2. Frontend Environment Variables (`Frontend/frontend/.env.local`)
Create a `.env.local` file inside the `Frontend/frontend/` directory (optional):

```env
NEXT_PUBLIC_API_URL=http://localhost:6000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:6000
```

---

## 🏃 Running the Application Locally

### Step 1: Start the Backend Server
Open a terminal window and execute:

```bash
cd Backend
npm install
npm run dev
```

> **Backend Port**: Runs on `http://localhost:6000` with live Socket.io signaling.

---

### Step 2: Start the Next.js Frontend App
Open a second terminal window and execute:

```bash
cd Frontend/frontend
npm install
npm run dev
```

> **Frontend Application**: Runs on `http://localhost:3000`.

---

## 🌐 Opening the Platform

1. Open your web browser and navigate to: **`http://localhost:3000`**
2. **Sign In** or **Sign Up** for a new account.
3. Explore the main sections:
   * 🏠 **Home**: Overview dashboard with skill points, badge status, and scheduled meetings.
   * 🔍 **Exchange Feed**: Browse skill posts, filter by categories, like, comment, and send proposals.
   * 💬 **Messages**: Instant direct messaging powered by Socket.io.
   * 🎥 **Sessions**: Scheduled WebRTC video call room with real-time Whiteboard & PIP camera.
   * 👤 **Profile**: Customize your bio, offered skills, and wanted skills.
   * ✨ **Gemini AI**: Generate AI post details, learning roadmaps, and exchange ideas.

---

## 💻 Tech Stack Summary

* **Frontend**: Next.js (App Router), React, Tailwind CSS, GSAP, Framer Motion, Lucide & React Icons.
* **Backend**: Node.js, Express.js, Socket.io (Real-time signaling & DMs), Mongoose / Memory Store.
* **Collaboration**: WebRTC 1-on-1 Video Calling, HTML5 Canvas Whiteboard.
* **AI Integration**: Google Gemini API.

---

## ☁️ Production Build

To create an optimized production build for the frontend:

```bash
cd Frontend/frontend
npm run build
npm start
```
