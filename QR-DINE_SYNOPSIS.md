# QR-DINE: Digital Restaurant Management System
## PROJECT SYNOPSIS

---

## 1. PROJECT TITLE
**QR-DINE: A Digital Restaurant Management & Customer Ordering System**

---

## 2. PROJECT OVERVIEW

QR-Dine is a comprehensive full-stack web application designed to revolutionize the dining experience by enabling contactless ordering and real-time order management. The system allows customers to scan a QR code placed at their table to access a digital menu, browse food items by category, add items to a cart, and place orders directly from their mobile devices. Meanwhile, restaurant staff and administrators can manage menus, track orders in real-time, and monitor table availability through an intuitive admin dashboard.

This project demonstrates modern web development practices including real-time communication, responsive design, and scalable backend architecture.

---

## 3. OBJECTIVES & GOALS

### Primary Objectives:
- **Digitize Ordering Process**: Eliminate paper menus and reduce ordering time
- **Real-Time Updates**: Enable live order status tracking using WebSocket technology
- **Admin Control**: Provide restaurant management with tools to manage menus, tables, and orders
- **User-Friendly Interface**: Design an intuitive customer interface for seamless ordering
- **Scalability**: Build a modular architecture that can handle multiple restaurants and tables

### Expected Outcomes:
- Reduction in order processing time
- Improved customer experience through real-time updates
- Reduced paper waste and operational costs
- Enhanced staff efficiency in order management
- Foundation for future expansion (payment integration, loyalty programs, etc.)

---

## 4. SCOPE

### In Scope:
- ✅ Customer-facing mobile app for browsing menu and placing orders
- ✅ Admin dashboard for menu management
- ✅ Real-time order tracking (pending, completed, history)
- ✅ QR code generation for table identification
- ✅ Multi-category menu filtering and search functionality
- ✅ Image upload for menu items
- ✅ Table management system
- ✅ Socket.IO for real-time updates between frontend and backend

### Out of Scope (Future Enhancement):
- ❌ Payment gateway integration (Razorpay, Stripe, etc.)
- ❌ SMS/Email notifications
- ❌ Mobile app (Android/iOS native)
- ❌ Analytics and reporting dashboards
- ❌ Multi-language support

---

## 5. SYSTEM ARCHITECTURE

### Frontend Architecture (Angular 17)
```
QR-Dine (Frontend)
├── Customer Module
│   ├── Home Component (Menu browsing, category filtering)
│   ├── Cart Component (Order summary, quantity management)
│   └── Menu Service (API communication)
├── Admin Module
│   ├── Dashboard Component (Order management, real-time updates)
│   ├── Admin QR Component (QR code display for tables)
│   ├── Table Management Component
│   ├── Menu Management Component (Add/Edit/Delete items)
│   ├── Order History Component
│   └── Admin Authentication Guard
├── Services
│   ├── Cart Service (Local state management)
│   ├── Menu Service (Menu CRUD operations)
│   └── Order Service (Order placement and tracking)
└── Shared Components
    └── Authentication & Authorization
```

### Backend Architecture (Node.js/Express)
```
qr-dine-backend (Backend)
├── Server (Express + Socket.IO)
├── Database (MongoDB)
├── Controllers
│   ├── Menu Controller (CRUD for menu items)
│   ├── Order Controller (Order management)
│   ├── Table Controller (Table & QR code management)
│   └── Admin Controller (Admin authentication)
├── Models
│   ├── MenuItem Schema
│   ├── Order Schema
│   ├── Table Schema
│   └── Admin Schema
├── Routes
│   ├── Menu Routes (/api/menu)
│   ├── Order Routes (/api/orders)
│   ├── Table Routes (/api/tables)
│   └── Admin Routes (/api/admin)
├── Middleware
│   └── Error Handling & CORS
└── Config
    └── Database Connection (MongoDB Atlas)
```

---

## 6. TECHNOLOGY STACK

### Frontend
- **Framework**: Angular 17.0.0 (Standalone Components)
- **Styling**: CSS3 with responsive design
- **HTTP Client**: Angular HttpClient for REST API calls
- **Real-time**: Socket.io-client 4.8.1 for WebSocket communication
- **QR Code**: qrcode.js 1.5.4 for QR code generation
- **State Management**: RxJS Observables & Services
- **Forms**: Reactive Forms (FormsModule)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB (Atlas Cloud)
- **Real-time Communication**: Socket.IO 4.8.1
- **Authentication**: Bcryptjs 2.4.3 for password hashing
- **File Upload**: Multer 1.4.5-lts.1 for image upload handling
- **QR Code Generation**: qrcode 1.5.4
- **Environment**: dotenv 16.3.1 for configuration
- **CORS**: cors 2.8.5 for cross-origin requests
- **Async Handler**: express-async-handler 1.2.0

### Database
- **Primary DB**: MongoDB (Document-based, flexible schema)
- **Hosting**: MongoDB Atlas (Cloud)
- **Collections**:
  - `menus` (Menu items with images, categories, prices)
  - `orders` (Order details, status, timestamps)
  - `tables` (Table numbers and QR codes)
  - `admin` (Admin credentials with bcrypt hashing)

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Angular CLI 17.0.0
- **Version Control**: Git (GitHub)
- **API Testing**: Postman
- **Image Storage**: File upload to local /uploads folder

---

## 7. KEY FEATURES BREAKDOWN

### 👤 Customer Features
1. **QR Code Scanning**: Access menu via table QR code
2. **Menu Browsing**: View items with prices, descriptions, and images
3. **Category Filtering**: Filter by Starters, Main Course, Desserts, Beverages, Snacks
4. **Search**: Find menu items by name
5. **Shopping Cart**: Add/remove items, adjust quantities
6. **Order Placement**: Submit order with real-time confirmation
7. **Order Tracking**: View real-time order status (Pending, In Progress, Ready, Completed)
8. **Visual Feedback**: Animations and alerts for user actions

### 🔐 Admin Features
1. **Secure Login**: Authentication with username/password
2. **Menu Management**: 
   - Add new menu items with images, category, price, description
   - Edit existing items
   - Delete items
   - View all menu items in real-time
3. **Order Management**:
   - View pending orders with real-time updates
   - Mark orders as completed
   - Access order history with filters
4. **Table Management**:
   - Add new tables with automatic QR code generation
   - View all tables and their QR codes
   - Edit table information
5. **Real-time Dashboard**:
   - Live order status updates via WebSocket
   - Pending orders count
   - Order history with timestamps
   - Connected admin notification

### ⚙️ System Features
1. **Real-time Communication**: WebSocket via Socket.IO
2. **Responsive Design**: Works on desktop, tablet, and mobile
3. **Image Management**: Upload and serve menu item images
4. **Error Handling**: Graceful error messages and validation
5. **CORS Support**: Allow cross-origin API requests

---

## 8. DATA MODELS

### MenuItem Schema
```javascript
{
  name: String (required),
  category: String (required),
  price: Number (required),
  description: String,
  image: String (filename),
  available: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  items: Array<{
    menuItemId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }>,
  tableId: ObjectId (required),
  totalPrice: Number,
  status: String (Pending|In Progress|Ready|Completed),
  createdAt: Date,
  updatedAt: Date
}
```

### Table Schema
```javascript
{
  tableNumber: Number (required, unique),
  qrCode: String (Base64 encoded QR code image),
  createdAt: Date
}
```

### Admin Schema
```javascript
{
  username: String (required, unique),
  password: String (hashed with bcrypt),
  createdAt: Date
}
```

---

## 9. API ENDPOINTS

### Menu Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all menu items |
| POST | `/api/menu` | Add new menu item (with image) |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Delete menu item |

### Order Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place new order |
| GET | `/api/orders/pending` | Get pending orders |
| GET | `/api/orders/:id` | Get order details |
| GET | `/api/orders/history` | Get order history |
| PATCH | `/api/orders/:id/status` | Update order status |

### Table Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tables` | Get all tables |
| GET | `/api/tables/:tableNumber` | Get specific table |
| POST | `/api/tables` | Create new table with QR |
| PUT | `/api/tables/:id` | Update table |
| DELETE | `/api/tables/:id` | Delete table |

### Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/register` | Create admin account |

---

## 10. USER WORKFLOWS

### 🧑‍🍽️ Customer Workflow
1. Customer scans QR code at table
2. Browser opens `/order?tableId=<id>`
3. Customer views menu with categories and search
4. Customer adds items to cart
5. Customer adjusts quantities and views total price
6. Customer clicks "Confirm Order"
7. Order is sent to backend
8. Customer sees real-time order status updates
9. When order is ready, customer receives notification

### 👨‍💼 Admin Workflow
1. Admin navigates to `/admin` route
2. Admin logs in with username/password (default: admin/admin123)
3. Admin is redirected to dashboard
4. Admin can:
   - **Manage Menu**: Add/Edit/Delete items with images
   - **Manage Tables**: Create QR codes for tables
   - **View Orders**: See pending orders with real-time updates
   - **Track Orders**: Update order status
   - **View History**: Access completed orders

---

## 11. INSTALLATION & SETUP

### Prerequisites
- Node.js 16+
- npm 8+
- MongoDB Atlas account (free tier available)
- Modern web browser

### Backend Setup
```bash
cd qr-dine-backend
npm install
# Create .env file with:
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/qr-dine
FRONTEND_URL=http://localhost:4200
npm start
```

### Frontend Setup
```bash
cd QR-dine
npm install
ng serve
# Navigate to http://localhost:4200
```

---

## 12. CHALLENGES & SOLUTIONS

| Challenge | Solution |
|-----------|----------|
| Real-time updates between multiple clients | Implemented Socket.IO for WebSocket communication |
| QR code generation and scanning | Used qrcode.js library, encoded table info in URL |
| Image upload handling | Integrated Multer middleware for file uploads |
| Cross-origin requests | Configured CORS in Express backend |
| Authentication security | Used bcryptjs for password hashing |
| Scalability concerns | Designed modular architecture, used async handlers |
| Missing database connection | Set up MongoDB Atlas for cloud-based database |
| Angular animation errors | Enabled BrowserAnimationsModule in providers |

---

## 13. FUTURE ENHANCEMENTS

1. **Payment Integration**: Razorpay/Stripe for online payments
2. **Mobile App**: React Native or Flutter for native mobile apps
3. **Email/SMS Notifications**: Notify customers when order is ready
4. **Analytics Dashboard**: Track popular items, peak hours, revenue
5. **Multi-language Support**: Support Hindi, Marathi, etc.
6. **User Accounts**: Customer registration and order history
7. **Ratings & Reviews**: Allow customers to review menu items
8. **Staff App**: Separate app for kitchen staff to see orders
9. **Table Occupancy**: Auto-detect when tables are free
10. **Loyalty Program**: Points and discounts for repeat customers

---

## 14. PROJECT TEAM

| Member | Role | Responsibilities |
|--------|------|------------------|
| **Maithri** | Full Stack Developer | Frontend (Angular), UI/UX design, customer interface |
| **Muktha** | Backend Developer | Node.js/Express API, MongoDB setup, server architecture |
| **Shipali** | Developer/Tester | Testing, admin features, data collection, documentation |

---

## 15. PROJECT STATUS & TIMELINE

- **Phase 1**: ✅ Completed
  - Frontend setup and customer interface
  - Backend API and database design
  - Basic CRUD operations for menu

- **Phase 2**: ✅ Completed
  - Admin dashboard implementation
  - QR code generation and table management
  - Real-time updates with Socket.IO
  - Image upload functionality

- **Phase 3**: 🔄 In Progress
  - Bug fixes and optimization
  - Testing and deployment

- **Phase 4**: ⏳ Future
  - Payment integration
  - Mobile app development
  - Advanced features

---

## 16. CONCLUSION

QR-Dine represents a modern solution to restaurant management challenges by digitizing the ordering process and enabling real-time communication between customers and staff. The project demonstrates full-stack web development capabilities using contemporary technologies (Angular, Node.js, MongoDB, Socket.IO) and best practices in software architecture.

The modular and scalable design allows for easy integration of future features such as payment gateways, mobile apps, and advanced analytics. With a user-friendly interface and robust backend, QR-Dine is ready for deployment in real-world restaurant environments.

---

## 17. REFERENCES & RESOURCES

- **Angular Documentation**: https://angular.io
- **Express.js Guide**: https://expressjs.com
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Socket.IO Documentation**: https://socket.io
- **QR Code Generator**: https://davidshimjs.github.io/qrcodejs/

---

**Document Version**: 1.0  
**Last Updated**: January 26, 2026  
**Project**: QR-Dine v1.0

