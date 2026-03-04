# QR-DINE WORKFLOW DIAGRAM & REFERENCE

---

## 📊 COMPLETE SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                          QR-DINE SYSTEM                              │
└─────────────────────────────────────────────────────────────────────┘

LAYER 1: CLIENT SIDE (Customer Browser)
┌──────────────────────────────────────────────────────────┐
│  Customer UI (Angular 17)                                │
│  ├─ Home Page: Menu browsing, categories, search        │
│  ├─ Cart Page: Add/remove items, quantity control       │
│  └─ Order Page (/order): Direct from QR code            │
│                                                           │
│  Components:                                             │
│  ├─ HomeComponent: Menu display                         │
│  ├─ CartComponent: Order management                     │
│  └─ AdminDashboardComponent: Full control              │
└──────────────────────────────────────────────────────────┘
                          ↕ (HTTP + WebSocket)
LAYER 2: SERVER SIDE (Node.js)
┌──────────────────────────────────────────────────────────┐
│  Express.js API Server (Port 5000)                      │
│                                                           │
│  Routes:                                                 │
│  ├─ /api/menu → MenuController                          │
│  ├─ /api/orders → OrderController                       │
│  ├─ /api/tables → TableController                       │
│  └─ /api/admin → AdminController                        │
│                                                           │
│  Real-time:                                             │
│  └─ Socket.IO: Order notifications, live updates        │
└──────────────────────────────────────────────────────────┘
                          ↕ (Mongoose ORM)
LAYER 3: DATA LAYER
┌──────────────────────────────────────────────────────────┐
│  MongoDB Atlas (Cloud Database)                          │
│                                                           │
│  Collections:                                            │
│  ├─ tables: {tableNumber, qrCode, _id}                 │
│  ├─ menus: {name, category, price, image}              │
│  ├─ orders: {tableId, tableNumber, items[], status}    │
│  └─ admin: {username, password}                         │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 ORDER LIFECYCLE

```
CUSTOMER SIDE:
┌─────────────────────────────────────────────────────────────┐
│ 1. SCANNING                                                  │
│    Customer scans QR code → Browser opens /order?tableId=.. │
│                                                              │
│ 2. BROWSING                                                  │
│    GET /api/menu → Menu items display                       │
│    Customer selects items                                    │
│                                                              │
│ 3. CART MANAGEMENT                                           │
│    Customer adjusts quantities                              │
│    Local calculation: quantity × price = total              │
│                                                              │
│ 4. PLACING ORDER                                             │
│    POST /api/orders                                         │
│    Payload: {tableId, items[], totalAmount}                 │
│                                                              │
│ 5. CONFIRMATION                                              │
│    "✅ Order placed successfully!"                           │
│    Real-time status updates via Socket.IO                   │
└─────────────────────────────────────────────────────────────┘

ADMIN SIDE:
┌─────────────────────────────────────────────────────────────┐
│ 1. NOTIFICATION (Real-time)                                 │
│    Socket.IO: "newOrder" event                              │
│    🔔 Notification sound plays                              │
│                                                              │
│ 2. VIEWING ORDER                                             │
│    Admin Dashboard → Pending Orders tab                      │
│    Displays: Table Number | Items | Total | [Confirm]       │
│                                                              │
│ 3. PREPARATION                                               │
│    Staff prepares order in kitchen                           │
│    (System doesn't interfere)                                │
│                                                              │
│ 4. CONFIRMATION                                              │
│    Admin clicks [Confirm] when ready                         │
│    PUT /api/orders/:id                                       │
│    Status changes: pending → confirmed                       │
│                                                              │
│ 5. COMPLETION                                                │
│    Order moves to History tab                               │
│    Socket.IO: Customer sees update                           │
│    Kitchen notified order is complete                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 API FLOW DIAGRAM

```
MENU ENDPOINTS:
┌──────────────────────────────────────────┐
│ GET /api/menu                            │
│ → Returns all menu items                 │
│ ← [{_id, name, category, price, img}]   │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│ POST /api/menu (Admin)                   │
│ → Sends: {name, category, price, img}    │
│ ← Returns: {_id, ...all fields}          │
└──────────────────────────────────────────┘

ORDER ENDPOINTS:
┌──────────────────────────────────────────┐
│ POST /api/orders (Customer)              │
│ → Sends: {tableId, items[], totalAmount} │
│ ← Returns: Order object with _id         │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│ GET /api/orders/pending (Admin)          │
│ → No payload needed                      │
│ ← Returns: [all pending orders]          │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│ PUT /api/orders/:id (Admin)              │
│ → Sends: {status: "confirmed"}           │
│ ← Returns: Updated order object          │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│ GET /api/orders/history (Admin)          │
│ → No payload needed                      │
│ ← Returns: [all completed/cancelled]     │
└──────────────────────────────────────────┘
```

---

## 📱 USER JOURNEY FLOWS

### **CUSTOMER JOURNEY**
```
START
 │
 ├─→ Scans QR Code
 │   (Links to: /order?tableId=697b23a27984db44eccf91db)
 │
 ├─→ Cart Page Loads
 │   • Fetch: GET /api/menu
 │   • Display: All menu items
 │
 ├─→ Add Items
 │   • Click "Add to Cart"
 │   • Store in CartService (local)
 │   • Update total price
 │
 ├─→ Review Cart
 │   • See all items + quantities
 │   • Adjust ±/quantity
 │   • See updated total
 │
 ├─→ Confirm Order
 │   • Click "Confirm Order" button
 │   • POST /api/orders {tableId, items, total}
 │   • Backend: Create order record
 │
 ├─→ Success Message
 │   • "✅ Order placed successfully!"
 │   • Cart clears
 │
 ├─→ Real-time Updates (Socket.IO)
 │   • Listen for "orderConfirmed" event
 │   • Display: "Order Confirmed - Get ready!"
 │
 └─→ END (Order complete)

EXPECTED TIME: ~2-3 minutes per order
```

### **ADMIN JOURNEY**
```
START
 │
 ├─→ Login to /admin
 │   • Username: admin
 │   • Password: admin123
 │   • Validation → Redirect to dashboard
 │
 ├─→ Main Dashboard
 │   • View: 3 tabs (Orders, History, Manage Menu)
 │   • Default: Pending Orders tab
 │
 ├─→ Manage Menu (Setup Phase)
 │   • Go to "Manage Menu" tab
 │   • Click "Add Item"
 │   • Fill: Name, Category, Price, Image
 │   • Click "Add Item" button
 │   • Item appears on customer menu instantly
 │
 ├─→ Monitor Pending Orders
 │   • Stay on "Orders" tab
 │   • View all pending orders
 │   • Each order shows:
 │     - Table Number
 │     - Items ordered
 │     - Total price
 │     - [Confirm] [Cancel] buttons
 │
 ├─→ Receive New Order
 │   • Socket.IO notification arrives
 │   • 🔔 Sound plays
 │   • "NEW" badge appears on order card
 │
 ├─→ Fulfill Order
 │   • Read order details
 │   • Instruct kitchen staff
 │   • Wait for preparation
 │   • When ready, click [Confirm]
 │
 ├─→ Confirm Order
 │   • PUT /api/orders/:id {status: "confirmed"}
 │   • Order disappears from pending
 │   • Order appears in History tab
 │   • Customer sees update in real-time
 │
 ├─→ View History
 │   • Go to "Order History" tab
 │   • See all completed/cancelled orders
 │   • Useful for:
 │     - Daily reconciliation
 │     - Revenue tracking
 │     - Pattern analysis
 │
 ├─→ Repeat
 │   • Go back to "Orders" tab
 │   • Check for new pending orders
 │   • Confirm each one
 │
 └─→ END (Shift ends)

EXPECTED TIME: ~1 minute per order
```

---

## 🗄️ DATA RELATIONSHIPS

```
TABLE ENTITY:
┌────────────────────────────┐
│ Table                      │
├────────────────────────────┤
│ _id: ObjectId (unique)     │
│ tableNumber: 1-5           │
│ qrCode: Base64 image       │
│ createdAt: timestamp       │
└────────────────────────────┘
         │
         │ (1-to-Many)
         │
         ↓
ORDERS ENTITY:
┌────────────────────────────┐
│ Order                      │
├────────────────────────────┤
│ _id: ObjectId (unique)     │
│ tableId: ObjectId (ref)    │ ← Foreign key
│ tableNumber: String        │ ← Denormalized
│ items: [                   │
│   {itemId, name, qty}      │
│ ]                          │
│ totalAmount: number        │
│ status: pending/confirmed  │
│ createdAt: timestamp       │
│ updatedAt: timestamp       │
└────────────────────────────┘
         │
         │ (references)
         ↓
MENUITEM ENTITY:
┌────────────────────────────┐
│ MenuItem                   │
├────────────────────────────┤
│ _id: ObjectId (unique)     │
│ name: String               │
│ category: String           │
│ price: Number              │
│ description: String        │
│ image: Filename            │
│ available: Boolean         │
│ createdAt: timestamp       │
└────────────────────────────┘
```

---

## 🌐 NETWORK FLOW

```
CUSTOMER BROWSER                    BACKEND SERVER                DATABASE
(Port 4200)                         (Port 5000)                   (Cloud)
    │                                   │                            │
    │ 1. GET /menu                      │                            │
    ├──────────────────────────────────→│ Query MenuItem.find()      │
    │                                   ├───────────────────────────→│
    │                                   │ Return menu items          │
    │                                   │←───────────────────────────┤
    │   Menu items JSON                 │                            │
    │←──────────────────────────────────┤                            │
    │   (Display on home page)          │                            │
    │                                   │                            │
    │ 2. POST /orders                   │                            │
    │    {tableId, items, total}        │                            │
    ├──────────────────────────────────→│ Create Order record        │
    │                                   ├───────────────────────────→│
    │                                   │ Save to MongoDB            │
    │                                   │←───────────────────────────┤
    │   Order created (with _id)        │                            │
    │←──────────────────────────────────┤                            │
    │                                   │                            │
    │ 3. Socket.IO Connection           │                            │
    ├──────────────────────────────────→│ Store client socket        │
    │  (Keep open)                      │ connection                 │
    │                                   │                            │
    │   (Admin confirms order)          │                            │
    │   4. Real-time UPDATE EVENT       │                            │
    │←──────────────────────────────────┤ io.emit('orderConfirmed') │
    │   {order: {...}}                  │                            │
    │   (Update UI instantly)           │                            │


ADMIN BROWSER                       BACKEND SERVER                DATABASE
(Port 4200)                         (Port 5000)                   (Cloud)
    │                                   │                            │
    │ GET /orders/pending               │                            │
    ├──────────────────────────────────→│ Find {status: "pending"}   │
    │                                   ├───────────────────────────→│
    │                                   │←───────────────────────────┤
    │   All pending orders              │                            │
    │←──────────────────────────────────┤                            │
    │   (Display order cards)           │                            │
    │                                   │                            │
    │   PUT /orders/:id {confirmed}     │                            │
    ├──────────────────────────────────→│ Update status              │
    │                                   ├───────────────────────────→│
    │                                   │ Save changes               │
    │                                   │←───────────────────────────┤
    │   Order confirmed                 │                            │
    │←──────────────────────────────────┤                            │
    │                                   │                            │
    │ Socket.IO                         │                            │
    ├──────────────────────────────────→│ Broadcast to all clients   │
    │  io.emit('orderConfirmed')        │                            │
```

---

## 📋 REQUEST/RESPONSE EXAMPLES

### **1. CUSTOMER PLACES ORDER**
```
REQUEST:
POST http://localhost:5000/api/orders
{
  "tableId": "697b23a27984db44eccf91db",
  "items": [
    {
      "itemId": "697b23f37984db44eccf91ef",
      "name": "Biryani",
      "quantity": 1,
      "price": 250
    }
  ],
  "totalAmount": 250
}

RESPONSE (201 Created):
{
  "_id": "697c5e2f...",
  "tableId": "697b23a27984db44eccf91db",
  "tableNumber": "1",
  "items": [
    {
      "itemId": "697b23f3...",
      "name": "Biryani",
      "quantity": 1,
      "price": 250
    }
  ],
  "totalAmount": 250,
  "status": "pending",
  "isNewOrder": true,
  "createdAt": "2026-01-29T09:10:11Z"
}
```

### **2. ADMIN CONFIRMS ORDER**
```
REQUEST:
PUT http://localhost:5000/api/orders/697c5e2f...
{
  "status": "confirmed"
}

RESPONSE (200 OK):
{
  "_id": "697c5e2f...",
  "tableId": "697b23a27984db44eccf91db",
  "tableNumber": "1",
  "items": [...],
  "totalAmount": 250,
  "status": "confirmed",
  "isNewOrder": false,
  "updatedAt": "2026-01-29T09:12:45Z"
}
```

### **3. SOCKET.IO REAL-TIME EVENT**
```
BACKEND BROADCASTS:
io.emit('orderConfirmed', {
  _id: "697c5e2f...",
  tableNumber: "1",
  status: "confirmed",
  message: "Your order has been confirmed!"
})

CUSTOMER RECEIVES:
Event: 'orderConfirmed'
Data: {order object}
UI: Updates to show "Order Confirmed"
```

---

## 🎨 UI LAYOUT REFERENCE

### **CUSTOMER HOME PAGE**
```
┌─────────────────────────────────┐
│  QR-Dine Logo      [🛒 Cart]    │
├─────────────────────────────────┤
│                                 │
│      [Hero Image/Slideshow]     │
│                                 │
├─────────────────────────────────┤
│  Search: [________] [🔍]        │
├─────────────────────────────────┤
│  Categories:                    │
│  [All] [Starters] [Main] [...]  │
├─────────────────────────────────┤
│  Menu Items Grid:               │
│  ┌─────────┐ ┌─────────┐ ...   │
│  │ Image   │ │ Image   │       │
│  │ Biryani │ │ Samosa  │       │
│  │ ₹250    │ │ ₹50     │       │
│  │ [Add]   │ │ [Add]   │       │
│  └─────────┘ └─────────┘       │
│                                 │
└─────────────────────────────────┘
```

### **ADMIN DASHBOARD - PENDING ORDERS**
```
┌──────────────────────────────────────┐
│ QR-Dine Admin    [🔐 Logout]          │
├──────────────────────────────────────┤
│ [Orders] [History] [Manage Menu]     │
├──────────────────────────────────────┤
│ Pending Orders (3)                   │
├──────────────────────────────────────┤
│ ┌─────────────────────────────────┐  │
│ │ Table 1    [NEW]    10:25 AM    │  │
│ │                                 │  │
│ │ Biryani x1      ₹250            │  │
│ │ Samosa x2       ₹100            │  │
│ │ ────────────────────────        │  │
│ │ Total: ₹350                     │  │
│ │                                 │  │
│ │ [✓ Confirm]  [✗ Cancel]         │  │
│ └─────────────────────────────────┘  │
│                                       │
│ ┌─────────────────────────────────┐  │
│ │ Table 3                 10:22 AM│  │
│ │                                 │  │
│ │ Tandoori Chicken x1   ₹300      │  │
│ │ ────────────────────────        │  │
│ │ Total: ₹300                     │  │
│ │                                 │  │
│ │ [✓ Confirm]  [✗ Cancel]         │  │
│ └─────────────────────────────────┘  │
│                                       │
└──────────────────────────────────────┘
```

---

## 🔗 QUICK LINKS & URLS

| Page | URL | Role |
|------|-----|------|
| Home | `http://localhost:4200/` | Customer |
| Cart | `http://localhost:4200/cart` | Customer |
| Order (from QR) | `http://localhost:4200/order?tableId=...` | Customer |
| Admin Login | `http://localhost:4200/admin-login` | Admin |
| Admin Dashboard | `http://localhost:4200/admin` | Admin |
| Menu API | `http://localhost:5000/api/menu` | Backend |
| Orders API | `http://localhost:5000/api/orders` | Backend |
| Tables API | `http://localhost:5000/api/tables` | Backend |

---

**Last Updated**: January 29, 2026  
**Version**: 1.0  
**Status**: ✅ PRODUCTION READY

