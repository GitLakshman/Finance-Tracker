# 💰 Expense Tracker

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/backend-Spring_Boot-6DB33F?logo=springboot&logoColor=white)

A comprehensive, full-stack personal finance application designed to help you manage your expenses, track your income, and stay on top of your budgets. Built with a modern tech stack featuring React on the frontend and Spring Boot on the backend.

## ✨ Features

- **Secure Authentication**: User registration, login, and secure session management using JSON Web Tokens (JWT) and OTP (One-Time Password) verification.
- **Dashboard & Visualizations**: Interactive charts and data visualizations using Recharts to provide clear insights into your financial health.
- **Income & Expense Management**: Easily add, categorize, and track your transactions.
- **Budget Tracking**: Set up budgets for different categories and monitor your progress.
- **Transaction History**: View unified transaction history with robust pagination, filtering, and sorting capabilities.
- **Responsive UI & Dark Mode**: A sleek interface customized with Tailwind CSS and Framer Motion, fully supporting dark mode.
- **Robust Exception Handling**: Global error handling on the backend ensures reliable responses and better debugging.

## 💻 Tech Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS, Framer Motion (for animations)
- **Forms & Validation**: React Hook Form, Zod
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Language**: TypeScript

### Backend
- **Framework**: Java 21, Spring Boot 3.5
- **Security**: Spring Security, JWT (jjwt)
- **Database**: MySQL, Spring Data JPA
- **Mail**: Spring Boot Starter Mail (for OTPs)
- **Other Tools**: Lombok, Maven

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Java Development Kit (JDK)](https://jdk.java.net/) (v21)
- [Maven](https://maven.apache.org/)
- [MySQL](https://www.mysql.com/)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your database and email credentials. Look for the `application.properties` or `application.yml` file in `src/main/resources` and update:
   - MySQL database URL, username, and password.
   - SMTP details for email notification (OTP verification).
3. Build and run the Spring Boot application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   The backend should now be running on `http://localhost:8080` (default port).

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://localhost:5173`.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

*Built by Lakshmana Prasad*
