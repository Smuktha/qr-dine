# QR-Dine: Complete Project Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Complete Workflow](#complete-workflow)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Customer Journey](#customer-journey)
8. [Admin Dashboard Features](#admin-dashboard-features)
9. [Setup & Installation](#setup--installation)
10. [Deployment Guide](#deployment-guide)
11. [File Organization](#file-organization)

---

## 🎯 Project Overview

**QR-Dine** is a restaurant table ordering system where:
- **Customers** scan a QR code on their table, browse the menu, add items to cart, and place orders
- **Admins** manage the restaurant: view orders, manage menu items, generate/delete QR codes, track order history

**Key Features:**
- ✅ Unique QR code per table (auto-generated with MongoDB ObjectId)
- ✅ Real-time order notifications (Socket.IO)
- ✅ Menu management (add/delete items with images)
- ✅ Order status tracking (pending → confirmed/cancelled)
- ✅ QR code generation, regeneration, and deletion
- ✅ No page refresh needed for real-time updates

---

## 🛠 Tech Stack

### Frontend (Angular 17)
- **Framework:** Angular 17 (Standalone Components)
- **Styling:** CSS3 with responsive design
- **HTTP Client:** For API communication
- **RxJS:** Observable-based state management
- **Socket.IO Client:** Real-time updates
- **Animation:** Angular Animations

### Backend (Node.js)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Real-time:** Socket.IO
- **QR Generation:** qrcode library
- **File Upload:** Multer
- **Password Hashing:** bcryptjs
- **Environment:** Dotenv

### Database (MongoDB)
- **Hosting:** MongoDB Atlas (Cloud)
- **Collections:**
  - `tables` - Restaurant tables with QR codes
  - `menus` - Menu items with images
  - `orders` - Customer orders with status
  - `admin` - Admin credentials (encrypted)

---

## 📁 Project Structure

```
QR-dine/
├── QR-dine/                          # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/                # Admin features
│   │   │   │   ├── pages/
│   │   │   │   │   ├── admin-dashboard/     # Main admin panel
│   │   │   │   │   ├── admin-login/        # Login page
│   │   │   │   │   ├── history/            # Order history
│   │   │   │   │   └── qr-viewer/          # QR code viewer (optional)
│   │   │   │   └── pages/admin-auth-guard  # Route protection
│   │   │   ├── customer/             # Customer facing
│   │   │   │   └── pages/home/       # Menu browsing
│   │   │   ├── cart/                 # Shopping cart & checkout
│   │   │   ├── services/             # API services
│   │   │   │   ├── menu.service.ts   # Menu CRUD
│   │   │   │   └── order.service.ts  # Order management
│   │   │   ├── app.routes.ts         # Routing configuration
│   │   │   ├── cart.service.ts       # Cart state management
│   │   │   └── app.config.ts         # App providers
│   │   └── main.ts                   # Bootstrap
│   ├── angular.json
│   └── package.json
│
├── qr-dine-backend/                  # Node.js Backend
│   ├── controllers/
│   │   ├── tableController.js        # Table CRUD + QR generation
│   │   ├── menuController.js         # Menu CRUD
│   │   ├── orderController.js        # Order management
│   │   └── adminController.js        # Admin auth
│   ├── routes/
│   │   ├── tableRoutes.js            # /api/tables endpoints
│   │   ├── menuRoutes.js             # /api/menus endpoints
│   │   ├── orderRoutes.js            # /api/orders endpoints
│   │   └── adminRoutes.js            # /api/admin endpoints
│   ├── models/
│   │   ├── Table.js                  # Table schema
│   │   ├── MenuItem.js               # Menu item schema
│   │   ├── Order.js                  # Order schema
│   │   └── Admin.js                  # Admin schema
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── server.js                     # Express app & Socket.IO
│   ├── .env                          # Environment variables
│   └── package.json
│
├── Documentation Files/
│   ├── PROJECT_COMPLETE_GUIDE.md     # This file
│   ├── QR-DINE_SYNOPSIS.md           # Detailed overview
│   ├── USER_GUIDE.md                 # How to use
│   └── QUICK_START.md                # 5-minute setup
│
└── uploads/                          # Menu item images (created at runtime)
```

---

## 🔄 Complete Workflow

### **1. QR Code Generation Flow**

```
Admin Creates Table (Table #5)
    ↓
Backend generates QR URL: http://localhost:4200/?tableId=<MongoDB_ObjectId>
    ↓
QRCode library converts URL → Base64 PNG image
    ↓
Stored in Database: tables.qrCode = "data:image/png;base64,..."
    ↓
Admin can Download/Print/Copy QR
```

### **2. Customer Ordering Flow**

```
Customer Scans QR on Table
    ↓
Redirected to: http://localhost:4200/?tableId=<id>
    ↓
Home Page Loads (Menu + tableId saved to localStorage)
    ↓
Browse Categories → Search Menu
    ↓
Add Items to Cart
    ↓
Click "Checkout" → Go to Cart Page
    ↓
Cart Page retrieves tableId from localStorage
    ↓
Click "Place Order" → Order sent to Backend with tableId
    ↓
Order saved to database with status: "pending"
    ↓
Socket.IO broadcasts → Admin gets real-time notification
```

### **3. Admin Dashboard Flow**

```
Admin Logs In (admin / admin123)
    ↓
localStorage.setItem('isAdminLoggedIn', 'true')
    ↓
Admin Dashboard loads with 4 tabs:
    ├── 🔔 Orders (New orders appear in real-time)
    ├── 📜 Order History (Confirmed/Cancelled orders)
    ├── 🍽️ Manage Menu (Add/Delete menu items with images)
    └── 📱 QR Codes (Add/Delete/Print/Copy/Regenerate QR codes)
    ↓
Admin clicks "Confirm" on order
    ↓
Order status → "confirmed"
    ↓
Socket.IO removes from pending list
    ↓
Admin can view order in History
```

---

## 📊 Database Schema

### **Tables Collection**
```javascript
{
  _id: ObjectId,           // Auto-generated MongoDB ID
  tableNumber: Number,     // Table 1, 2, 3, etc.
  qrCode: String,          // Base64 PNG image data
  createdAt: Date
}
```

### **Menus Collection**
```javascript
{
  _id: ObjectId,
  name: String,            // "Biryani", "Paneer Tikka"
  category: String,        // "Main Course", "Starters"
  price: Number,           // 250, 150, etc.
  description: String,     // Optional
  image: String,           // Filename (stored in /uploads)
  imageUrl: String,        // Full URL for frontend
  createdAt: Date
}
```

### **Orders Collection**
```javascript
{
  _id: ObjectId,
  tableId: ObjectId,       // Reference to Tables._id
  tableNumber: Number,     // Denormalized for quick access
  items: [
    {
      itemId: ObjectId,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,     // Sum of (price * quantity)
  status: String,          // "pending", "confirmed", "cancelled"
  createdAt: Date,
  updatedAt: Date
}
```

### **Admin Collection**
```javascript
{
  _id: ObjectId,
  username: String,        // "admin"
  password: String,        // Bcrypt hashed
  createdAt: Date
}
```

---

## 🔌 API Endpoints

### **Tables API** (`/api/tables`)
| Method | Endpoint | Purpose | Example |
|--------|----------|---------|---------|
| GET | `/` | Get all tables | Returns all 5 tables with QR codes |
| POST | `/` | Create new table | `{ tableNumber: 6 }` → Auto-generates QR |
| POST | `/generate-qr` | Regenerate all QR codes | Useful after deployment |
| DELETE | `/:id` | Delete a table | Removes table & QR code |

### **Menu API** (`/api/menus`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Get all menu items |
| POST | `/` | Add new item (with image upload) |
| PUT | `/:id` | Update menu item |
| DELETE | `/:id` | Delete menu item |

### **Orders API** (`/api/orders`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/pending` | Get pending orders |
| GET | `/history` | Get order history |
| POST | `/` | Place new order |
| PUT | `/:id` | Update order status |
| DELETE | `/:id` | Delete order |

### **Admin API** (`/api/admin`)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/login` | Authenticate admin |

---

## 👥 Customer Journey

### **Step 1: Scan QR Code**
- Scans table QR → Opens `http://localhost:4200/?tableId=697b23a27984db44eccf91db`

### **Step 2: Browse Menu**
- Home page loads with all menu items
- Can filter by category: Starters, Main Course, Desserts, Beverages, Snacks
- Can search by item name
- tableId is saved to localStorage

### **Step 3: Add to Cart**
- Click "Add to Cart" button on any item
- Item added to browser's cart (CartService)
- Quantity can be adjusted

### **Step 4: Place Order**
- Click "Checkout" → Goes to cart page (auto-includes tableId from localStorage)
- Reviews items and total price
- Clicks "Place Order"
- Order sent to backend with tableId, items, and total amount

### **Step 5: Confirmation**
- Success message appears
- Cart clears
- Admin gets real-time notification via Socket.IO

---

## 🎛️ Admin Dashboard Features

### **1. Orders Tab (🔔)**
- Shows pending orders in real-time
- Click "Confirm" to move to history
- Click "Cancel" to cancel order
- Order count badge shows number of pending orders

### **2. Order History Tab (📜)**
- Shows all confirmed/cancelled orders
- Displays order details: table number, items, total, date, status
- Search and filter options

### **3. Manage Menu Tab (🍽️)**
- **Add New Item:**
  - Category (dropdown)
  - Item name
  - Price
  - Description (optional)
  - Image upload
- **Menu Grid:**
  - Shows all items with images
  - Delete button to remove items
  - Images stored in `/uploads` folder

### **4. QR Codes Tab (📱)**
- **Add New Table:**
  - Input table number
  - Click "Add Table" button
  - QR code auto-generated with `http://localhost:4200/?tableId=<id>`
  - Table appears in grid

- **For Each Table:**
  - Display table number
  - Show QR code image
  - Display table MongoDB ID
  - **Actions:**
    - 📋 **Copy Link** - Copies order URL to clipboard
    - 🖨️ **Print** - Opens print dialog
    - 🗑️ **Delete** - Removes table and QR code
  
- **Global Actions:**
  - 🔄 **Regenerate All QR Codes** - Useful after changing FRONTEND_URL
  - Error handling for duplicate table numbers

---

## 🚀 Setup & Installation

### **Prerequisites**
- Node.js (v16+)
- MongoDB Atlas account (free tier)
- Angular CLI (optional, uses npm start)

### **Backend Setup**

```bash
cd qr-dine-backend

# 1. Install dependencies
npm install

# 2. Create .env file
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/qr-dine
PORT=5000
FRONTEND_URL=http://localhost:4200
NODE_ENV=development

# 3. Start server
npm start
# Server runs on http://localhost:5000
```

### **Frontend Setup**

```bash
cd QR-dine

# 1. Install dependencies
npm install

# 2. Start Angular dev server
npm start
# App runs on http://localhost:4200
```

### **Access Points**
- **Customer:** http://localhost:4200
- **Admin Login:** http://localhost:4200/admin-login
  - Username: `admin`
  - Password: `admin123`
- **Admin Dashboard:** http://localhost:4200/admin
- **API:** http://localhost:5000/api

---

## 📦 Deployment Guide

### **Frontend (Angular) - Deploy to Vercel**

```bash
# 1. Build production bundle
cd QR-dine
npm run build

# 2. Install Vercel CLI
npm i -g vercel

# 3. Deploy
vercel
# Follow prompts, select build output folder: dist/qr-dine/browser
```

### **Backend (Node.js) - Deploy to Render**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "QR-Dine Backend"
   git branch -M main
   git remote add origin https://github.com/username/qr-dine-backend.git
   git push -u origin main
   ```

2. **Create Render Account**
   - Visit render.com
   - Connect GitHub repository
   - Create New → Web Service
   - Build command: `npm install`
   - Start command: `node server.js`
   - Add Environment Variables:
     ```
     MONGO_URI=mongodb+srv://...
     PORT=5000
     FRONTEND_URL=https://your-vercel-app.vercel.app
     NODE_ENV=production
     ```

3. **After Deployment**
   - Update `.env` with deployed URLs
   - Go to Admin → QR Codes → "Regenerate All QR Codes"
   - QR codes now point to deployed frontend URL

### **Database (MongoDB Atlas)**
- Already cloud-hosted
- No action needed
- Connection string in `.env`

---

## 🗂️ File Organization & Cleanup

### **Files That Can Be Removed (Test Files)**
These are auto-generated test files not used in this project:
- `QR-dine/src/app/**/*.spec.ts` (8 files)
- `QR-dine/src/app/types-qrcode.d.ts` (type definitions, can keep)

**They're safe to delete:**
```bash
rm QR-dine/src/app/**/*.spec.ts
```

### **Unused Components** (Optional)
- `QR-dine/src/app/user/pages/menu/` - Duplicate menu component
- `QR-dine/src/app/admin/pages/view-orders/` - Not used (superseded by admin-dashboard)
- `QR-dine/src/app/admin/pages/table-qr/` - Older QR component (replaced by qr-viewer)

These can be kept for reference or deleted if not needed.

### **Keep These Essential Files**
```
QR-dine/
├── src/app/
│   ├── customer/pages/home/           ✅ Menu browsing
│   ├── cart/                          ✅ Order checkout
│   ├── admin/pages/admin-dashboard/   ✅ Admin hub
│   ├── admin/pages/admin-login/       ✅ Authentication
│   ├── admin/pages/admin-auth-guard   ✅ Route protection
│   ├── services/                      ✅ API communication
│   └── app.routes.ts                  ✅ Routing

qr-dine-backend/
├── controllers/                       ✅ Business logic
├── routes/                            ✅ API endpoints
├── models/                            ✅ Database schemas
├── server.js                          ✅ Express app
└── .env                               ✅ Configuration
```

---

## 🔑 Key Credentials

### **Admin Login**
```
Username: admin
Password: admin123
```

### **Database Connection** (from .env)
```
Host: cluster0.xialv02.mongodb.net
Username: qrdineUser
Database: qr-dine
```

### **Pre-created Data**
- **5 Tables** with auto-generated QR codes
- **1 Sample Menu Item:** Biryani (₹250, Main Course)
- **MongoDB ObjectIds** stored and ready to use

---

## 📈 How It Works: Technical Deep Dive

### **Socket.IO Real-Time Updates**
```javascript
// Backend (server.js)
io.emit('newOrder', order)  // Broadcast to all connected clients

// Frontend (order.service.ts)
this.socket.on('newOrder', order => this.newOrder$.next(order))

// Admin Dashboard listens
this.orderService.newOrder$.subscribe(order => 
  this.loadPendingOrders()  // Auto-refresh
)
```

### **QR Code Generation & Storage**
```javascript
// 1. Generate URL with tableId
const url = `http://localhost:4200/?tableId=${table._id}`

// 2. Convert to Base64 PNG
const qrCodeData = await QRCode.toDataURL(url)
// Result: "data:image/png;base64,iVBORw0KGgo..."

// 3. Store directly in MongoDB
table.qrCode = qrCodeData
await table.save()

// 4. Frontend displays
<img [src]="qrCode.startsWith('data:') ? qrCode : 'data:image/png;base64,' + qrCode" />
```

### **Order Flow with TableId**
```javascript
// 1. Customer scans QR
// URL: http://localhost:4200/?tableId=697b23a27984db44eccf91db

// 2. HomeComponent captures tableId
this.route.queryParams.subscribe(params => {
  localStorage.setItem('tableId', params['tableId'])
})

// 3. CartComponent retrieves it
this.tableId = localStorage.getItem('tableId')

// 4. Place order with tableId
this.http.post('/api/orders', {
  tableId: this.tableId,
  items: [...],
  totalAmount: 500
})

// 5. Admin sees which table ordered
Order.tableNumber = 1  // From tables collection
```

---

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ **Full-stack development** (Frontend + Backend + Database)
- ✅ **RESTful API design** with proper HTTP methods
- ✅ **Real-time communication** using Socket.IO
- ✅ **Database design** with normalized schemas
- ✅ **Authentication & Authorization** (localStorage + Auth Guard)
- ✅ **File uploads** with Multer middleware
- ✅ **Image storage** and serving
- ✅ **QR code generation** and storage
- ✅ **Responsive UI** design with CSS Grid/Flexbox
- ✅ **Component-based architecture** (Angular)
- ✅ **Service-based state management** (RxJS)
- ✅ **Error handling** and validation
- ✅ **Deployment** to production

---

## 📞 Support & Troubleshooting

### **Port Already in Use**
```bash
# Backend port 5000
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Frontend port 4200
netstat -ano | findstr :4200
```

### **MongoDB Connection Failed**
- Check internet connection
- Verify MongoDB Atlas IP whitelist includes your IP
- Confirm MONGO_URI in .env is correct

### **QR Codes Not Showing**
- Restart backend after updating FRONTEND_URL
- Go to Admin → QR Codes → "Regenerate All QR Codes"
- Clear browser cache (Ctrl+Shift+Delete)

### **Orders Not Updating in Real-Time**
- Verify Socket.IO is connected (check browser console)
- Check Network tab for WebSocket connection
- Restart backend server

---

**Project Complete! 🎉**

For questions or updates, refer to:
- `QR-DINE_SYNOPSIS.md` - Detailed overview
- `USER_GUIDE.md` - Step-by-step usage
- `QUICK_START.md` - Fast setup guide
