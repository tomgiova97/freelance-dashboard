# Freelance Management Dashboard

A professional Full-Stack management tool designed for freelancers to track projects, tasks, and payments in one unified interface. This project demonstrates modern web development practices including responsive design, CRUD operations with MongoDB, and Next.js 15 API routes.

## 🚀 Features

- **Weekly Dashboard:** Visualize your work week with a custom-built grid timeline.
- **Project Management:** Create and manage projects with detailed tracking of compensation and company info.
- **Task Tracking:** Manage task spans with start, end, and due date tracking.
- **Payment Ledger:** Track revenue with built-in date filters (1m, 6m, 1y, All) and automatic project balance updates.
- **Fully Responsive:** Optimized for both desktop and mobile devices.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** MongoDB (via Mongoose ODM)
- **Containerization:** Docker (for local database instance)
- **Language:** TypeScript
- **Styling:** CSS Modules

---

## 🏁 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Environment Setup
Create a file named `.env.local` in the root directory and add the following connection string (this matches the Docker configuration provided):

```env
MONGODB_URI=mongodb://admin:password@localhost:27017/freelance_db?authSource=admin
```

### 3. Spin up the Database
Start the MongoDB container in the background using Docker Compose:

```bash
docker-compose up -d
```

### 4. Install & Run
Install the project dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

- `/app`: Next.js pages and API route handlers.
- `/components`: Reusable UI components (Navbar, Modals, etc.).
- `/models`: Mongoose schemas for Projects, Tasks, and Payments.
- `/lib`: Database singleton connection logic.

## 📝 License
Distributed under the MIT License.