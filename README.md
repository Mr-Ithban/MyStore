# 🛍️ MyStore - Store Rating & Management Platform

A full-stack web application that allows users to register, discover stores, submit and modify star ratings, and view analytics. Built with **NestJS**, **Prisma ORM**, **PostgreSQL**, and **React (Vite + TypeScript)**.

---

## 🌟 Features & Role-Based Access Control

The platform provides a single unified login system supporting three distinct roles:

### 👑 1. System Administrator (`ADMIN`)
- **Dashboard Analytics**: Overview metrics showing total registered users, total stores, and total submitted ratings.
- **User Management**: Add new users with specific roles (`USER`, `STORE_OWNER`, `ADMIN`).
- **Store Management**: Register new stores and assign store owners.
- **Data Filtering & Sorting**: Apply filters across listings by Name, Email, Address, and Role with dynamic column sorting.
- **Store Owner Ratings**: Displays average store ratings directly in the owner's profile view.

### 👤 2. Normal User (`USER`)
- **Account Registration & Login**: Sign up page with real-time field validation.
- **Password Management**: Update account password at any time from the user profile.
- **Store Directory & Search**: Browse registered stores with live search filtering by Name and Address.
- **Rating Submissions**: Submit or modify star ratings (1 to 5 stars) for any store.

### 🏪 3. Store Owner (`STORE_OWNER`)
- **Owner Dashboard**: View store overall rating average and detailed customer feedback.
- **Customer Ratings List**: View customer names, email addresses, and specific ratings given to their store.
- **Account Security**: Update account password after logging in.

---

## 🔒 Form Validation Specifications

Strict form validation rules are enforced synchronously across both NestJS backend DTOs (`class-validator`) and React frontend forms:

| Field | Validation Rule |
| :--- | :--- |
| **Name** | Min 20 characters, Max 60 characters |
| **Address** | Max 400 characters |
| **Password** | 8 to 16 characters, must include at least 1 uppercase letter and 1 special character |
| **Email** | Valid RFC email address formatting |

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT (`@nestjs/jwt`) & Password Hashing (`bcrypt`)
- **Validation**: `class-validator` & `class-transformer`

### Frontend
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Routing**: `react-router-dom` v7
- **HTTP Client**: `axios`
- **Styling**: Vanilla CSS (Custom Design System with dark mode aesthetic)

## 📁 Project Structure

```text
MyStore/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database Schema Definition
│   │   └── contract.prisma     # Prisma Contract Specification
│   ├── src/
│   │   ├── admin/              # Admin Dashboard & Management Controller/Service
│   │   ├── auth/               # Auth Controller, Service, JWT Guards & DTOs
│   │   ├── prisma/             # Database Connection Service
│   │   ├── ratings/            # Store Rating Controller & Service
│   │   ├── stores/             # Store Directory & Owner Service
│   │   ├── users/              # User Controller
│   │   ├── app.module.ts       # Main NestJS Application Module
│   │   └── main.ts             # Application Bootstrap & Validation Pipe Setup
│   └── test/                   # Jest E2E & Unit Test Suites
└── frontend/
    ├── src/
    │   ├── api/                # Axios API Client Configuration
    │   ├── components/         # Navigation & Reusable UI Components
    │   ├── context/            # Authentication Context Provider
    │   ├── pages/              # Role-specific Page Components
    │   ├── App.tsx             # Protected Route Setup & App Router
    │   └── index.css           # Design Tokens & Core Stylesheet
    ├── index.html
    └── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **PostgreSQL** database server running locally or remotely

---

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend` root:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mystore?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="1h"
   PORT=3000
   CORS_ORIGIN="http://localhost:5173"
   ```

4. **Run Database Migrations & Prisma Client Generation**:
   ```bash
   npx prisma db push
   ```

5. **Start Backend Server**:
   ```bash
   # Development Mode
   npm run start:dev

   # Production Build
   npm run build
   npm run start:prod
   ```
   *Backend API will run at `http://localhost:3000/api`*

---

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *Frontend Application will be live at `http://localhost:5173`*

---

## 🧪 Running Tests

To run the NestJS backend unit test suite:

```bash
cd backend
npm test
```

---

## 📡 API Endpoint Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new normal user account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/profile` | Authenticated | Get currently authenticated user details |
| `POST` | `/api/auth/change-password` | Authenticated | Update user password |
| `GET` | `/api/stores` | Authenticated | List all stores with ratings & user submission |
| `POST` | `/api/ratings` | `USER` | Submit a new store rating (1-5 stars) |
| `PATCH` | `/api/ratings/:storeId` | `USER` | Modify an existing submitted rating |
| `GET` | `/api/stores/owner/dashboard` | `STORE_OWNER` | Get store owner dashboard analytics |
| `GET` | `/api/admin/dashboard` | `ADMIN` | System administrator dashboard overview |
| `GET` | `/api/admin/users` | `ADMIN` | List and filter users by role, email, address |
| `POST` | `/api/admin/users` | `ADMIN` | Create user (Normal, Admin, or Store Owner) |
| `GET` | `/api/admin/stores` | `ADMIN` | List all registered stores with average ratings |
| `POST` | `/api/admin/stores` | `ADMIN` | Register a new store |

---

## 📄 License

This project is open source and available under the [UNLICENSED](LICENSE) license.
