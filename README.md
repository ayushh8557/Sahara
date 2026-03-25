# 🏥 Sahara – Secure Hospital Management System

## 📌 Overview

Sahara is a modern full-stack hospital management system designed to streamline healthcare workflows through a secure and role-based platform. Built using React, Node.js, Express, and MongoDB, it enables seamless interaction between doctors and patients while ensuring data privacy, scalability, and real-time updates.

The system replaces traditional manual processes with a digital solution, improving accessibility, efficiency, and accuracy in managing medical records, prescriptions, and reports.

---

## 🚀 Features

### 🔐 Role-Based Authentication

* Secure login for Doctors and Patients
* JWT-based authentication and authorization
* Protected routes to prevent unauthorized access

### 👨‍⚕️ Doctor Module

* Upload prescriptions, reports, and treatment notes
* Manage and update patient records
* Real-time data synchronization with database

### 🧑‍🤝‍🧑 Patient Module

* View medical history and prescriptions
* Access uploaded reports securely
* Clean and intuitive dashboard experience

### 🗄️ Database

* MongoDB-based scalable data storage
* Efficient schema design using Mongoose
* Real-time updates for accurate data retrieval

### 🎨 User Interface

* Built with React and Tailwind CSS
* Fully responsive (mobile + desktop)
* Minimal, modern, and user-friendly design

---

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB, Mongoose
**Authentication:** JWT (JSON Web Tokens)

---

## ⚙️ Installation & Setup

### Prerequisites

* Node.js installed
* MongoDB (local or Atlas)

### Steps

```bash
# Clone the repository
git clone https://github.com/ayushh8557/Sahara.git
cd Sahara

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file in the backend folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 📊 Project Structure

```
Sahara/
│
├── frontend/        # React frontend
├── backend/         # Node.js backend
├── README.md
```

---

## 🌟 Key Highlights

* Secure and scalable architecture
* Role-based access control
* Real-time data updates
* Clean UI/UX design
* Optimized for modern healthcare systems

---

## 📌 Future Improvements

* Appointment booking system
* Email/SMS notifications
* Video consultation feature
* Admin analytics dashboard

---

## 👨‍💻 Author

**Ayush Yadav**

---


This project is open-source and available under the MIT License.
