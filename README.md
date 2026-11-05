# Echo Mini Social Media App

A simple social media app built with React, Vite, Express, and MongoDB. It supports user signup/login, profile management, post creation, image uploads, likes, follows, and feed browsing.

## Overview

This project is designed as a lightweight social platform where users can:

- create an account and log in
- update their profile picture
- post text and image updates
- view a global feed
- view only their own posts
- like posts
- follow/unfollow other users

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- TailwindCSS

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads

## Project Structure

```bash
.
├── backend/
│   ├── app.js
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore
```

## Features

- User sign up and login
- Secure JWT-based authentication
- Profile picture upload
- Create, view, and delete posts
- Feed showing all posts from users
- My Posts page for personal content
- Like/unlike posts
- Follow/unfollow users
- Profile stats for followers and following

## Environment Setup

Create a `.env` file in the backend folder with the following values:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Run Locally

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```


