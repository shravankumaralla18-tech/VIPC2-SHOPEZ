# ShopEZ Backend

Node.js and Express API for the ShopEZ e-commerce platform. The backend handles authentication, products, carts, orders, reviews, and admin operations using MongoDB with Mongoose.

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- CORS
- dotenv

## Folder Structure

```text
backend/
  config/          MongoDB connection setup
  controllers/     Request handlers and business logic
  middleware/      Auth and admin authorization middleware
  models/          Mongoose schemas
  routes/          Express API route definitions
  seeder.js        Sample data seeding script
  server.js        API entry point
```

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in this folder:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/shopez
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

Start the development server:

```bash
npm run dev
```

Start the production server:

```bash
npm start
```

## API Routes

- `GET /api/health` - API health check
- `/api/auth` - Register, login, and user auth flows
- `/api/products` - Product listing, details, reviews, and product management
- `/api/orders` - Order creation and order history
- `/api/admin` - Admin dashboard and management routes

## Notes

- The API defaults to port `5000` if `PORT` is not set.
- The frontend expects the API at `http://localhost:5001/api` unless `VITE_API_URL` is configured in the frontend.
- Do not commit real `.env` values or secrets.
