# SkillNest Frontend

React + Tailwind CSS frontend for the SkillNest online education platform.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
Open `src/services/firebase.js` and replace the placeholder values with your actual Firebase project config:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "skillnest-db.firebaseapp.com",
  projectId: "skillnest-db",
  storageBucket: "skillnest-db.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

To get these values:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Project Settings → Your Apps → Web App
3. Copy the config object

### 3. Set backend URL
The `.env` file already points to `http://localhost:8080` (the API Gateway). Change if needed:
```
REACT_APP_API_URL=http://localhost:8080
```

### 4. Start the app
```bash
npm start
```

App opens at **http://localhost:3000**

---

## Backend Services Required
Make sure these are all running before using the frontend:

| Service | Port |
|---|---|
| API Gateway | 8080 |
| User Service | 8081 |
| Course Service | 8082 |
| Enrollment Service | 8083 |
| Class Service | 8084 |

---

## Pages & Routes

### Auth
- `/login` — Sign in
- `/register` — Create student or teacher account

### Student
- `/student/dashboard` — Overview, upcoming classes, enrolled courses
- `/student/courses` — Browse & enroll in courses
- `/student/my-courses` — Your enrolled courses
- `/student/classes` — All your scheduled/completed classes

### Teacher
- `/teacher/dashboard` — Stats, upcoming classes, quick actions
- `/teacher/courses` — Create & manage your courses
- `/teacher/classes` — All classes with reschedule/cancel
- `/teacher/availability` — Set available time slots
- `/teacher/students` — Students in your classes
- `/teacher/earnings` — Earnings breakdown

---

## Tech Stack
- React 18
- React Router v6
- Tailwind CSS
- Firebase Auth
- Axios
- react-hot-toast
