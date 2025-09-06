# 🌸 Kici Perfume - E-commerce Platform

A comprehensive perfume e-commerce platform built with React, Node.js, and SQLite. Features advanced perfume-specific functionality including fragrance notes, reviews, and personalized recommendations.

## 🚀 Features

### 🛍️ E-commerce Core
- **Product Catalog** - Browse perfumes by category, brand, or fragrance family
- **Advanced Search** - Filter by price, concentration, gender, season, and occasion
- **Shopping Cart** - Persistent cart with automatic expiration
- **Wishlist** - Save favorite products with personal notes
- **User Reviews** - Detailed reviews with fragrance performance ratings
- **Order Management** - Complete order tracking and history

### 🌺 Perfume-Specific Features
- **Fragrance Notes** - Detailed top, heart, and base note information
- **Concentration Types** - Parfum, EDP, EDT, EDC, Eau Fraiche
- **Perfumer Information** - Track renowned fragrance creators
- **Seasonal Recommendations** - Suggest perfumes based on season and occasion
- **Longevity & Sillage Ratings** - Performance metrics for each fragrance
- **Gender Targeting** - Men's, Women's, and Unisex categories

### 👤 User Experience
- **User Authentication** - Secure login/registration with JWT
- **Profile Management** - Personal preferences and fragrance history
- **Loyalty Points** - Reward system for repeat customers
- **Multiple Addresses** - Shipping and billing address management
- **Newsletter Subscription** - Stay updated with new releases

### 🛡️ Admin Features
- **Product Management** - Add, edit, and manage perfume inventory
- **Order Processing** - Track and update order status
- **User Management** - Customer support and account management
- **Analytics Dashboard** - Sales and performance metrics
- **Coupon System** - Create and manage discount codes

## 🏗️ Technical Architecture

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe admin panel

### Backend
- **Node.js & Express** - RESTful API server
- **Sequelize ORM** - Database management and migrations
- **SQLite** - Local database for development
- **JWT Authentication** - Secure token-based auth
- **bcrypt** - Password hashing and security

### Database Schema
- **16 Interconnected Tables** - Comprehensive data model
- **Foreign Key Constraints** - Data integrity enforcement
- **Indexes** - Optimized query performance
- **JSON Fields** - Flexible data storage for arrays and objects

## 📊 Database Structure

```
Users ──┬── Orders ──── Order Items ──── Products
        ├── Reviews ─────────────────────┘
        ├── Addresses
        ├── Cart ──── Cart Items ────────┘
        └── Wishlist ───────────────────┘

Products ──┬── Product Images
           ├── Product Fragrance Notes ── Fragrance Notes
           ├── Categories (hierarchical)
           └── Brands

Orders ──── Coupons
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishadtailor19/kici_perfume.git
   cd kici_perfume
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Set up the database**
   ```bash
   # Seed the database with sample data
   npm run seed-db
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (Terminal 1)
   cd backend
   npm run dev
   
   # Start frontend server (Terminal 2)
   cd ..
   npm run dev
   
   # Start admin panel (Terminal 3)
   cd admin-panel
   npm run dev
   ```

5. **Access the applications**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000/api
   - **Admin Panel**: http://localhost:3001

## 🔐 Default Credentials

### Admin User
- **Email**: admin@kici-perfume.com
- **Password**: admin123

### Sample Customer
- **Email**: john@example.com
- **Password**: password123

## 📁 Project Structure

```
kici_perfume/
├── src/                    # Frontend React app
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   └── App.jsx            # Main app component
├── backend/               # Node.js API server
│   ├── config/           # Database configuration
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── scripts/          # Database seeding
│   └── server.js         # Express server
├── admin-panel/          # TypeScript admin interface
│   ├── src/
│   │   ├── components/   # Admin UI components
│   │   ├── pages/        # Admin pages
│   │   └── services/     # API services
└── public/               # Static assets
    └── images/           # Product images
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin)

### Users (Admin)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🎨 Sample Data

The database comes pre-populated with:
- **8 Categories**: Floral, Fresh, Oriental, Woody, Citrus, Spicy, Gourmand, Aquatic
- **4 Brands**: Kici Signature, Maison Lumière, Essence Royale, Urban Scents
- **15 Fragrance Notes**: Complete collection of top, heart, and base notes
- **5 Products**: Diverse perfume collection with detailed descriptions
- **2 Users**: Admin and sample customer accounts

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
# Database
DATABASE_PATH=./database/kici_perfume.sqlite

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Database Reset
To reset the database with fresh sample data:
```bash
cd backend
npm run reset-db
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Build admin panel
cd admin-panel
npm run build

# Start production server
cd ../backend
npm start
```

### Database Migration
For production, update the database configuration in `backend/config/database.js` to use PostgreSQL or MySQL instead of SQLite.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Fragrance Community** - For inspiration and expertise
- **Open Source Libraries** - For making this project possible
- **Contributors** - For their valuable contributions

## 📞 Support

For support, email support@kici-perfume.com or create an issue on GitHub.

---

**Made with ❤️ for perfume enthusiasts worldwide**