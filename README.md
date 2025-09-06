# Kici Perfume - Full-Stack E-commerce Platform

A modern, full-stack e-commerce platform for premium perfumes built with React, Node.js, Express, and MongoDB.

## 🌟 Features

### Frontend (User Side)
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Product Catalog**: Browse perfumes with search, filter, and sort functionality
- **Product Details**: Detailed product pages with images and fragrance notes
- **Shopping Cart**: Add/remove items, quantity management, checkout flow
- **User Authentication**: Secure signup/login with JWT tokens
- **User Profile**: Manage personal information and view order history

### Admin Panel
- **Dashboard**: Key metrics and analytics overview
- **Product Management**: Add, edit, delete perfumes with image uploads
- **Order Management**: View and update order status, tracking
- **User Management**: View users, manage roles and permissions
- **Role-based Access**: Secure admin-only functionality

### Backend API
- **RESTful APIs**: Well-structured endpoints for all operations
- **Authentication**: JWT-based auth with role-based access control
- **Data Validation**: Input validation and sanitization
- **Security**: Helmet, CORS, rate limiting, password hashing
- **Database**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Security & Validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kici-perfume
   ```

2. **Install Frontend Dependencies**
   ```bash
   pnpm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Environment Setup**
   ```bash
   # In backend directory
   cp .env.example .env
   
   # Edit .env with your configuration:
   MONGODB_URI=mongodb://localhost:27017/kici-perfume
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Seed the Database**
   ```bash
   # In backend directory
   npm run seed
   ```

6. **Start the Development Servers**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   # In root directory
   pnpm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 👤 Demo Accounts

After running the seed script, you can use these accounts:

- **Admin**: admin@kici.com / password123
- **User**: john@example.com / password123
- **User**: jane@example.com / password123

## 📁 Project Structure

```
kici-perfume/
├── src/                          # Frontend React app
│   ├── components/
│   │   └── Layout.jsx           # Header, navigation, footer
│   ├── pages/
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── ProductsPage.jsx     # Product catalog
│   │   ├── ProductDetailPage.jsx # Product details
│   │   ├── CartPage.jsx         # Shopping cart
│   │   ├── AuthPage.jsx         # Login/signup
│   │   └── AdminPanel.jsx       # Admin dashboard
│   └── App.jsx                  # Main app component
├── backend/                      # Backend API
│   ├── models/                  # MongoDB schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── scripts/
│   │   └── seed.js              # Database seeding
│   └── server.js                # Express server
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `GET /api/orders/admin/all` - Get all orders (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PUT /api/users/:id/role` - Update user role (Admin)
- `PUT /api/users/:id/status` - Activate/deactivate user (Admin)

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator for all inputs
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Configured for frontend domain
- **Security Headers**: Helmet.js for security headers
- **Role-based Access**: Admin/user role separation

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern Animations**: Smooth transitions and hover effects
- **Loading States**: User feedback during operations
- **Error Handling**: User-friendly error messages
- **Search & Filter**: Advanced product filtering
- **Shopping Cart**: Persistent cart with quantity management

## 🚀 Deployment

### Frontend Deployment
The frontend is built with Vite and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

```bash
pnpm run build
# Deploy the 'dist' folder
```

### Backend Deployment
The backend can be deployed to:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

Environment variables needed:
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `CORS_ORIGIN` (your frontend URL)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@kici.com or create an issue in the repository.

---

**Built with ❤️ by the Kici Perfume Team**