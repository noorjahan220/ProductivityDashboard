
# 🧠 Mini Productivity Dashboard

A compact web-based productivity dashboard that helps users manage their daily tasks, track weekly/monthly goals, and stay motivated with a quote of the day!

## 🌐 Live Demo
> [🔗 Link to Deployed Site](https://your-deployment-link.com) *(Update once deployed)*

---

## 🚀 Features

### 👤 User Authentication
- Secure registration & login
- JWT-based authentication
- Protected routes for dashboard access

### 📋 Task Management
- Add, edit, delete tasks
- Mark tasks as complete
- Optional: drag-and-drop task reordering 🔁

### 🎯 Goals Tracker
- Set and manage weekly/monthly goals
- Update or delete goals

### 💬 Daily Motivation
- Fetches a motivational quote from [ZenQuotes API](https://zenquotes.io/) or [Quotable API](https://github.com/lukePeavey/quotable)

### 🌗 Theme Toggle *(Bonus)*
- Light/Dark mode for user preference

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS or your chosen styling method
- react-beautiful-dnd *(Optional drag-and-drop)*

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcrypt.js for password hashing

---

## 📁 Folder Structure (Simplified)

client/
│
├── src/
│ ├── components/
│ ├── pages/
│ ├── hooks/
│ ├── services/
│ └── App.jsx
│
server/
│
├── controllers/
├── models/
├── routes/
├── middleware/
└── server.js

yaml
Copy
Edit

---

## 🔐 Environment Variables

Create a `.env` file in the root of the `server` folder:

PORT=5000
DB_USER=yourMongoUser
DB_PASS=yourMongoPassword
JWT_SECRET=yourJWTSecret

yaml
Copy
Edit

---

## 📦 Installation & Setup

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/mini-productivity-dashboard.git
cd mini-productivity-dashboard
2. Setup Server
bash
Copy
Edit
cd server
npm install
npm run dev
3. Setup Client
bash
Copy
Edit
cd client
npm install
npm run dev
Make sure both client and server are running concurrently.

📡 API Routes Overview
Auth
POST /register – Register user

POST /login – Login and receive token

GET /verifyToken – Verify JWT token

Tasks
GET /tasks – Get user tasks

POST /tasks – Add task

PUT /tasks/:id – Update task

DELETE /tasks/:id – Delete task

Goals
GET /goals – Get user goals

POST /goals – Add goal

PUT /goals/:id – Update goal

DELETE /goals/:id – Delete goal

📌 Future Improvements
✅ Drag-and-drop task reordering

✅ Dark/light mode toggle

🔒 Password reset functionality

📈 Task completion statistics dashboard

🙌 Acknowledgements
ZenQuotes API

Quotable API

React Beautiful DnD


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
