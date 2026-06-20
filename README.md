# ShopEZ

ShopEZ is a full-stack e-commerce application built with React, Vite, Node.js, Express, and MongoDB. It includes product browsing, authentication, cart management, checkout/order flows, product reviews, and an admin dashboard for store management.

## Features

- User registration and login with JWT authentication
- Product listing, search, filtering, sorting, and product details
- Shopping cart with backend persistence
- Order creation and user order history
- Product ratings and reviews
- Admin dashboard for users, orders, products, sales metrics, and charts
- Responsive React frontend styled with Tailwind CSS

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS, Lucide React, Recharts
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, CORS, dotenv

## Project Structure

```text
ShopEZ/
  backend/
    config/          Database configuration
    controllers/     API controller logic
    middleware/      Authentication and admin middleware
    models/          Mongoose models
    routes/          Express routes
    seeder.js        Sample data seeding script
    server.js        Backend entry point

  frontend/
    public/          Static public assets
    src/
      assets/        Frontend images and static assets
      components/    Reusable React components
      context/       Auth and cart context providers
      pages/         Route-level pages
      services/      Axios API client
      App.jsx        Main app routes/layout
      main.jsx       Frontend entry point

  docs/
    frontend.md              Frontend notes
    fsd-documentation.md     Full system documentation
    phase-wise-templates.md  Phase-wise project templates
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env` before running the backend:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/shopez
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Useful Commands

```bash
# Backend
cd backend
npm start
npm run dev

# Frontend
cd frontend
npm run dev
npm run build
npm run preview
npm run lint
```
