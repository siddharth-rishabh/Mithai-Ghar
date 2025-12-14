# 🍬 Mithai Ghar – Sweet Shop Management System

Mithai Ghar is a full-stack Sweet Shop Management System built as part of a technical assignment. The project demonstrates backend API development, frontend SPA design, authentication, role-based access control, Test-Driven Development (TDD), and responsible use of AI tools.

The application allows users to browse and purchase sweets, while admin users can manage the sweet inventory.

---

## ✨ Features

### 👤 Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (Admin / User)

### 🧁 User Features
- View all available sweets
- Search sweets by name or category
- Purchase sweets
- Purchase button disabled when stock is zero
- Protected routes for authenticated users

### 🛠 Admin Features
- Add new sweets
- Update sweets
- Delete sweets
- Restock sweets
- Admin-only UI controls and API protection

---

## 🧰 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

### Testing
- Jest
- Supertest
- Test-Driven Development (TDD)

---

## 🧪 Test-Driven Development (TDD)

The backend was developed using the Red → Green → Refactor approach:
1. Wrote failing test cases first for authentication and sweet management APIs.
2. Implemented minimal logic to pass the tests.
3. Refactored the code while keeping all tests passing.

Tests cover authentication, authorization, sweet CRUD operations, and purchase/restock logic.

---

## 📁 Project Structure

Mithai-Ghar/
- backend/
  - controllers/
  - models/
  - routes/
  - middlewares/
  - tests/
  - server.js
- frontend/
  - pages/
  - components/
  - App.jsx
  - main.jsx
- README.md

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend folder:

MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  
ADMIN_EMAILS=admin@example.com  
PORT=3000  

Admin users are identified using the email addresses listed in `ADMIN_EMAILS`.

---

