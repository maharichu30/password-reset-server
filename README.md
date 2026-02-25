Sure! Here’s a complete `README.md` ready to copy-paste:

````markdown
# Password Reset Server

A Node.js backend server for handling user authentication and password reset functionality, built with **Express**, **MongoDB**, and **NodeMailer**.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [API Endpoints](#api-endpoints)  
- [Folder Structure](#folder-structure)  
- [License](#license)  

---

## Features

- User registration and login with hashed passwords (**bcryptjs**)  
- Password reset flow using tokens and email notifications (**NodeMailer**)  
- Token expiration handling for security  
- MongoDB for user data storage  
- CORS enabled for cross-origin requests  

---

## Tech Stack

- **Node.js**  
- **Express.js**  
- **MongoDB**  
- **Mongoose**  
- **bcryptjs**  
- **crypto**  
- **NodeMailer**  
- **dotenv**  
- **cors**  

---

## Getting Started

### Prerequisites

- Node.js >= 18  
- MongoDB Atlas account (or local MongoDB instance)  
- Gmail account for sending reset emails  

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/password-reset-server.git
cd password-reset-server
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables (see below).

4. Start the server in development mode:

```bash
npm run dev
```

Server will run on `http://localhost:3002` (or the port specified in your `.env`).

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3002
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/password-reset
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

> **Note:** Use an App Password for Gmail instead of your main password for security.

---

## API Endpoints

Base URL: `/api/auth`

| Method | Endpoint                 | Description                  | Body Parameters     |
| ------ | ------------------------ | ---------------------------- | ------------------- |
| POST   | `/register`              | Register a new user          | `email`, `password` |
| POST   | `/login`                 | Login an existing user       | `email`, `password` |
| POST   | `/forgot-password`       | Request password reset email | `email`             |
| POST   | `/reset-password/:token` | Reset password using token   | `password`          |

---

## Folder Structure

```
password-reset-server/
│
├── config/
│   └── db.js              # MongoDB connection
│
├── controllers/
│   └── authController.js  # Authentication logic
│
├── models/
│   └── User.js            # User schema
│
├── routes/
│   └── authRoutes.js      # Auth routes
│
├── .env                   # Environment variables
├── index.js               # Entry point
├── package.json
└── README.md
```

---

## License

This project is licensed under the MIT License.

---

## How to Test Password Reset Flow (Optional)

1. Send a POST request to `/api/auth/forgot-password` with `{ "email": "user@example.com" }`.
2. Check your Gmail for the reset link.
3. Send a POST request to `/api/auth/reset-password/:token` with `{ "password": "newpassword" }`.
4. You can now login with the new password.

```
```
