# Radiant-Beauty-Glam
# Radiant Beauty Glam 💄✨

An e‑commerce web application for cosmetics and beauty products.  
Customers can browse products, manage their cart, place orders, and view order history.  
Admins can manage products, monitor orders, and add new admins through a secure dashboard.

---

## 📖 Table of Contents
- [Introduction](#introduction)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [System Features](#system-features)
- [Technologies Used](#technologies-used)
- [System Architecture](#system-architecture)
- [Screenshots](#screenshots)
- [GitHub Repository Link](#github-repository-link)
- [Deployment Link](#deployment-link)
- [CI/CD](#cicd)
- [Challenges Encountered](#challenges-encountered)
- [Future Work](#future-work)
- [Conclusion](#conclusion)
- [Getting Started](#getting-started)

---

## 📌 Introduction
Radiant Beauty Glam is a modern e‑commerce platform designed to simplify online shopping for cosmetics.  
It provides a seamless experience for customers and a powerful dashboard for administrators.

---

## ❗ Problem Statement
Cosmetics businesses often struggle with limited reach, inefficient inventory management, and lack of digital engagement.  
This project addresses these challenges by offering a scalable online store with role‑based access.

---

## 🎯 Objectives
- Build a responsive cosmetics e‑commerce platform.  
- Provide secure customer registration and login.  
- Implement an admin dashboard for product and order management.  
- Deploy with CI/CD pipelines for continuous delivery.  

---

## 🛠 System Features
### Customer
- Register/login as customer.  
- Browse products with details and prices.  
- Add/remove/update items in cart.  
- Place orders and view order history.  

### Admin
- Login with admin role.  
- Add, edit, delete products.  
- Monitor orders and update statuses.  
- Create new admin accounts.  

---

## 💻 Technologies Used
- **Frontend**: React, Tailwind CSS, React Router  
- **Backend**: Node.js, Express.js, MongoDB  
- **Auth**: JWT with role‑based access control  
- **Deployment**: Vercel/Netlify (frontend), Render/Heroku (backend)  
- **CI/CD**: GitHub Actions  

---

## 🏗 System Architecture
- **Client Layer**: React components (Login, Dashboard, Cart, Orders, Admin Dashboard)  
- **Server Layer**: Express routes for authentication, products, orders, and admin management  
- **Database Layer**: MongoDB collections for users, products, and orders  
- **Integration**: JWT middleware secures communication between frontend and backend  

---

## 📸 Screenshots
*(Insert screenshots of Login, Dashboard, Cart, Orders, Admin Dashboard here)*

---

## 🔗 GitHub Repository Link
[Frontend Repo](https://github.com/yourusername/radiant-beauty-glam-frontend)  
[Backend Repo](https://github.com/yourusername/radiant-beauty-glam-backend)

---

## 🌍 Deployment Link
[Live App](https://radiant-beauty-glam.vercel.app)

---

## ⚙️ CI/CD
- GitHub Actions pipeline runs linting and tests on each push.  
- Successful builds auto‑deploy frontend to Vercel/Netlify and backend to Render/Heroku.  

---

## 🚧 Challenges Encountered
- Managing role‑based authentication securely.  
- Aligning frontend expectations with backend schema.  
- Handling environment variables during deployment.  
- Resolving Git merge conflicts during collaboration.  

---

## 🔮 Future Work
- Integrate payment gateways (Stripe, PayPal, Mobile Money).  
- Add product reviews and ratings.  
- Implement analytics dashboards for admins.  
- Enhance security with two‑factor authentication.  
- Expand to multi‑vendor marketplace features.  

---

## ✅ Conclusion
Radiant Beauty Glam successfully delivers a functional MVP e‑commerce platform with customer and admin roles.  
It demonstrates modern web technologies solving real‑world business challenges in the cosmetics industry.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)  
- MongoDB running locally or in the cloud (Atlas)  

### Installation
Clone the repos:
```bash
git clone https://github.com/yourusername/radiant-beauty-glam-frontend.git
git clone https://github.com/yourusername/radiant-beauty-glam-backend.git
