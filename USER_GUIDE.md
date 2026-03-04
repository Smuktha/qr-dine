# QR-DINE USER GUIDE
**Complete Instructions for Customers & Admins**

---

## 👥 FOR CUSTOMERS: How to Order Food

### **Step 1: Scan the QR Code** 📱
- Look for the QR code sticker on your dining table
- Use your smartphone camera or any QR code scanner app
- The app will automatically open the ordering page

### **Step 2: View the Menu** 🍽️
- See all available dishes with prices
- Dishes are organized by **categories**: Starters, Main Course, Desserts, Beverages, Snacks
- Use the **search bar** to find specific dishes

### **Step 3: Add Items to Cart** 🛒
- Click on a dish you want to order
- Press **"Add to Cart"** button
- You'll see a confirmation message: "✅ Biryani added to cart!"

### **Step 4: Adjust Quantities** ➕➖
- In the **Cart** page, use + and - buttons to change quantities
- Remove items by clicking the **"Remove"** button
- See the **total price** update instantly

### **Step 5: Confirm Your Order** ✅
- Click **"Confirm Order"** button
- Review items in the popup
- Click **"Place Order"** to finalize
- You'll see: "✅ Your order has been placed successfully!"

### **Step 6: Wait for Your Order** ⏱️
- Your order is now sent to the restaurant kitchen
- The admin will confirm when they start preparing
- You'll receive a **real-time notification** when the order is ready
- Come to the counter or wait at your table

---

## 👨‍💼 FOR ADMINS: How to Manage the Restaurant

### **Admin Login**
- **URL**: http://localhost:60920/admin
- **Username**: `admin`
- **Password**: `admin123`
- Click **"Login"** to access the dashboard

---

## 📋 ADMIN DASHBOARD FEATURES

### **Tab 1: Pending Orders** 🔔
**Shows all new and active orders**

Each order card displays:
- 🎯 **Table Number**: Which table placed this order (e.g., "Table 1")
- 🕐 **Order Time**: When the order was placed
- 🍴 **Items Ordered**: List with quantities and prices
  - Example: "Biryani x2 — ₹500"
- 💰 **Total Amount**: Total price for the order
- ✨ **NEW badge**: Highlights brand new orders

**Actions:**
- **✓ Confirm**: Mark as "In Progress" → Order goes to history
- **✗ Cancel**: Cancel the order → Removed from kitchen queue

**How it works:**
```
Customer places order → Admin hears notification sound → 
See "NEW" badge on order card → Confirm when ready → 
Order moves to "Order History"
```

---

### **Tab 2: Order History** 📜
**Shows all completed and cancelled orders**

View:
- All confirmed orders
- Cancelled orders
- Order timestamps
- Complete order details
- Useful for daily reconciliation

---

### **Tab 3: Manage Menu** 🍽️
**Add, edit, and remove dishes**

### **Add New Dish:**
1. Fill in fields:
   - **Dish Name**: e.g., "Butter Chicken"
   - **Category**: Select from dropdown (Starters, Main Course, etc.)
   - **Price**: e.g., 280
   - **Description**: e.g., "Creamy tomato-based curry"
   - **Image**: Upload a photo (optional)

2. Click **"Add Item"** button
3. Dish appears on customer menu immediately
4. All customers see the new item in real-time

### **Delete Dish:**
- Click **"Delete"** on any menu item
- Confirm when asked
- Dish removed instantly from customer menu

### **Menu Updates:**
- Changes appear on customer screens **immediately**
- Real-time sync using WebSocket (Socket.IO)
- No need for customer to refresh

---

## 🎯 COMPLETE WORKFLOW EXAMPLE

### **Real Scenario: Table 1 Orders Lunch**

**Customer (Table 1) Actions:**
```
1. Scans QR code on their table
2. Sees menu: Biryani (₹250), Tandoori Chicken (₹300)
3. Adds: 1x Biryani + 1x Tandoori Chicken
4. Total: ₹550
5. Clicks "Confirm Order"
6. Gets: "✅ Order placed successfully!"
```

**Admin Actions (Simultaneously):**
```
1. Working in admin dashboard
2. Hears notification BEEP 🔔
3. Sees new order card:
   ┌─────────────────────┐
   │ Table 1      [NEW]  │
   │ Biryani x1  - ₹250  │
   │ Tandoori x1 - ₹300  │
   │ Total: ₹550         │
   │ [✓ Confirm] [✗ Cancel]
   └─────────────────────┘
4. Kitchen starts preparing
5. Clicks "Confirm" when ready
6. Order moves to "Order History"
```

**Customer Sees:**
```
- Order status updates in real-time
- When admin confirms → "Order Confirmed!"
- When order is ready → Gets notified
```

---

## 🔄 TABLE MANAGEMENT (Admin Only)

### **View All Tables:**
- Go to **"Table QR"** section in admin
- See all tables (1, 2, 3, 4, 5, etc.)
- Each table shows its unique QR code

### **Add New Table:**
- Click **"Add Table"** button
- Enter table number (e.g., 6)
- System generates QR code automatically
- Print and place on the table

### **QR Code Links:**
- Each QR links to: `/order?tableId=<unique_id>`
- When scanned → Opens order page for that table
- Admin knows which table ordered what

---

## 🚀 QUICK ACCESS LINKS

**Customer Interface**
- Home/Menu: http://localhost:60920/
- Cart/Order: http://localhost:60920/order (via QR scan)

**Admin Interface**
- Dashboard: http://localhost:60920/admin
- Default credentials: admin / admin123

**API Testing**
- Backend: http://localhost:5000/api/...
- Example: http://localhost:5000/api/menu

---

## ⚙️ TROUBLESHOOTING

### **Issue: Order not appearing in admin dashboard**
**Solution:**
- Refresh admin page (F5)
- Check if backend is running
- Verify Socket.IO connection in browser console

### **Issue: QR code not scanning**
**Solution:**
- Ensure good lighting
- Print QR codes clearly
- Use modern smartphone camera
- Or manually type: http://localhost:60920/order?tableId=...

### **Issue: Menu items not showing**
**Solution:**
- Admin must add items first (in Manage Menu tab)
- Items appear immediately on customer screen
- Clear browser cache if not showing

### **Issue: Image upload not working**
**Solution:**
- Check file size (max 10MB)
- Use JPEG, PNG, GIF, or WebP format
- Ensure /uploads folder exists on server

### **Issue: Admin login fails**
**Solution:**
- Username: `admin`
- Password: `admin123`
- Exact match (case-sensitive)
- Clear localStorage if locked out

---

## 💡 TIPS FOR BEST RESULTS

### **For Restaurant Owners:**
- ✅ Place QR codes on each table clearly
- ✅ Add restaurant logo and branding
- ✅ Customize menu with popular dishes
- ✅ Use clear, appetizing images for dishes
- ✅ Keep menu prices updated
- ✅ Monitor pending orders during rush hours

### **For Customers:**
- ✅ Scan from a distance if QR is reflective
- ✅ Try different angles if scan fails
- ✅ Use phone's native camera app (fastest)
- ✅ Don't navigate away until order is confirmed
- ✅ Ask staff if you need help

### **For Staff:**
- ✅ Monitor "Pending Orders" tab regularly
- ✅ Confirm orders as soon as preparation starts
- ✅ Check "Order History" at end of day
- ✅ Add new items to menu as needed

---

## 📞 SUPPORT

**If you encounter any issues:**
1. Check this guide first
2. Verify backend and frontend are running
3. Check browser console for errors (F12)
4. Verify internet connection
5. Restart the application

---

## 🎉 ENJOY YOUR QR-DINE EXPERIENCE!

Thank you for using **QR-Dine** - The Modern Restaurant Ordering System!

**Version**: 1.0  
**Last Updated**: January 29, 2026

