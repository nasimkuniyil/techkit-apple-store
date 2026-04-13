# TechKit - Apple Store

A full-stack e-commerce website inspired by Apple’s clean design and premium user experience. Built with **Node.js, Express.js, MongoDB, and EJS**.

This project demonstrates a complete backend-focused e-commerce platform with user authentication, product management, and a responsive frontend.

*Home page*
<img width="1919" height="879" alt="image" src="https://github.com/user-attachments/assets/4bdd8231-97d6-4102-9389-920c6e2e9859" />

*Products list page*
<img width="1919" height="871" alt="image" src="https://github.com/user-attachments/assets/e88253e0-f7ab-427f-b250-b645d1fda610" />

*Product details page*
<img width="1919" height="864" alt="image" src="https://github.com/user-attachments/assets/04f92a63-48ce-4a6e-8dcb-84730b80eb93" />

## ✨ Main Features

### User Features
- User Registration & Login (with secure password hashing)
- Protected routes (only logged-in users can access certain pages)
- Browse products with clean, Apple-like UI
- View detailed product information
- Add products to Cart
- Responsive design (mobile + desktop friendly)

### Admin Features
- Admin panel to manage products (Add, Edit, Delete products)
- View all registered users

### Backend Features
- **MVC Architecture** with separate layers:
  - Models (MongoDB schemas)
  - Controllers
  - Services
  - Routes
- User Authentication & Authorization using Session
- Middleware for authentication protection
- MongoDB database integration with Mongoose
- Environment-based configuration
- Clean and maintainable code structure

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Templating**: EJS
- **Frontend**: HTML, CSS, JavaScript
- **Others**: bcryptjs (password hashing), express-session, dotenv
