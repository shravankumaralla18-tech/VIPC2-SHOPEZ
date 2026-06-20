# ShopEZ Frontend

React and Vite frontend for the ShopEZ e-commerce platform. It provides product browsing, authentication screens, cart flows, profile pages, product details, and the admin dashboard.

## Tech Stack

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React
- Recharts

## Folder Structure

```text
frontend/
  public/          Static public assets
  src/
    assets/        Images and static frontend assets
    components/    Reusable UI components
    context/       Auth and cart state providers
    pages/         Route-level screens
    services/      API client setup
    App.jsx        Main routes and layout
    main.jsx       React entry point
```

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Environment

The API client is configured in `src/services/api.js`.

By default, it uses:

```env
http://localhost:5001/api
```

To override it, create a `.env` file in this folder:

```env
VITE_API_URL=http://localhost:5001/api
```

## Pages

- `Home.jsx` - Landing and featured product experience
- `Products.jsx` - Product catalog
- `ProductDetails.jsx` - Product details and reviews
- `Cart.jsx` - Shopping cart
- `Login.jsx` and `Register.jsx` - Authentication screens
- `Profile.jsx` - User profile and order access
- `AdminDashboard.jsx` - Admin management dashboard
