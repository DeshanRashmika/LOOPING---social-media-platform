# 📱 Mini Social Media Platform

A lightweight, full-stack social networking web application designed to connect users. It includes user authentication, interactive posts with comments, and an engagement system for likes and followers.

## 🚀 Features

* **User Authentication:** Secure user registration and login.
* **User Profiles:** Dedicated pages to view user details and their posts.
* **Post Creation:** Users can create, read, and delete their thoughts/posts.
* **Interactions:** Users can like/unlike posts and add comments.
* **Follow System:** Ability to follow and unfollow other users.

## 💻 Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose ORM)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt

## 📂 Project Structure

```text
social-media-project/
├── frontend/                   # Client-side files
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── login.html
│   └── profile.html
│
└── backend/                    # Server-side API files
    ├── controllers/            # Business logic
    ├── models/                 # MongoDB Schemas (User, Post, Comment)
    ├── routes/                 # API Endpoints
    ├── middleware/             # Auth guards
    ├── .env                    # Environment variables
    └── server.js               # Main Express server setup
