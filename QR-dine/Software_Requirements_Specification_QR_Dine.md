# Software Requirements Specification (SRS)

for

**QR Dine**

**Name of the candidate:** [Your Name Here]
**Register No:** [Your Register No Here]
**Course Name:** [Your Course Name Here]
**Institute & College Name:** [Your Institute & College Name Here]
**Place:** [Your Place Here]
**Date Created:** February 15, 2026

Under the guidance of

**Name of the Internal Project Guide:** [Guide Name Here]
**Designation, Department:** [Guide Designation, Department]
**Institute, College Name:** [Guide Institute, College Name]
**Place:** [Guide Place]

Submitted to

---

## Table of Contents
- Revision History
- 1. Introduction
  - 1.1 Purpose
  - 1.2 Document Conventions
  - 1.3 Intended Audience and Reading Suggestions
  - 1.4 Project Scope
  - 1.5 References
- 2. Overall Description
  - 2.1 Product Perspective
  - 2.2 Product Features
  - 2.3 User Classes and Characteristics
  - 2.4 Operating Environment
  - 2.5 Design and Implementation Constraints
   This document specifies the software requirements for the QR Dine project, a full-stack digital restaurant management system. It covers the customer web app, admin dashboard, and backend API, reflecting the actual, tested implementation.
  - 2.7 Assumptions and Dependencies
- 3. System Features
   - Placeholders (e.g., [Your Name]) should be replaced with actual values.
   - All requirements are verifiable and mapped to real, working features.
  - 4.1 User Interfaces
  - 4.2 Hardware Interfaces
  - 5.2 Safety Requirements
  - 5.3 Security Requirements
   QR Dine is a web-based application that enables restaurant customers to view menus, place orders, and track order status via QR codes. Admins can manage menus, orders, and tables in real time. The system is designed to streamline restaurant operations, reduce wait times, and provide a seamless digital dining experience. This SRS covers the complete, working system as implemented and tested.
- 6. Other Requirements
- Appendix A: Glossary
   - [Angular CLI Documentation](https://angular.dev/tools/cli)
   - [API Documentation (in-code JSDoc and OpenAPI comments)]

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0     | 2026-02-15 | Initial Draft | [Your Name] |

   QR Dine is a new, self-contained product for restaurants. It consists of:
   - **Frontend:** Angular SPA (Single Page Application) for customers and admins.
   - **Backend:** Node.js/Express REST API with MongoDB, real-time updates via Socket.IO.
   - **Integration:** QR code generation for tables, image upload for menu items, and real-time order management.

## 1. Introduction
   - QR code-based menu access for each table
   - Digital menu browsing with categories and images
   - Cart and order management for customers
   - Real-time order status updates
   - Admin dashboard for menu, order, and table management
   - Table QR code generation and management
   - Secure admin authentication
   - RESTful API for all data operations
   - Image upload for menu items
- Placeholders (e.g., [Your Name]) should be replaced with actual values.

   - **Customers:** Scan QR, browse menu, place orders, view order status. No login required.
   - **Admins:** Login required. Manage menu, orders, tables, and view analytics.
   - **Super Admin:** Full access to all admin features (if enabled).
- **Testers:** Use section 3 for functional requirements.
- **Users/Clients:** Review sections 1 and 2 for overview and features.
   - **Frontend:** Modern browsers (Chrome, Firefox, Edge, Safari) on mobile and desktop
   - **Backend:** Node.js 18+, Express.js, MongoDB
   - **Deployment:** Local or cloud servers, supports HTTPS
   - **Frontend:** Modern browsers (Chrome, Firefox, Edge, Safari) on mobile and desktop
   - **Backend:** Node.js 18+, Express.js, MongoDB Atlas (cloud database)
   - **Deployment:** Local or cloud servers, supports HTTPS
### 1.5 References
- [Project README](../README.md)
   - Angular 19+ for frontend
   - Node.js/Express for backend
   - MongoDB for persistent storage
   - Socket.IO for real-time updates
   - JWT for admin authentication
   - Must comply with web accessibility standards (WCAG)
   - All features are implemented and tested as described

---
   - User manual (digital)
   - Online help and FAQs
   - Admin guide
   - In-code documentation and comments
### 2.1 Product Perspective
QR Dine is a new, self-contained product designed for restaurants. It consists of a customer-facing web app, an admin dashboard, and a backend server. The system integrates with restaurant hardware (e.g., printers) and supports mobile and desktop browsers.
   - Internet connection required for cloud deployment
   - Restaurant provides compatible hardware (e.g., QR code printers)
   - System depends on third-party libraries for QR code generation, image upload, and authentication
   - MongoDB instance must be available
   - MongoDB Atlas cloud instance must be available
- Digital menu browsing
- Real-time order tracking
- Admin dashboard for menu and order management
- Table management
- Secure authentication for admins

   Customers scan a unique QR code at their table to access the digital menu. **Priority:** High
- **Customers:** Access menus and place orders via QR code; minimal technical expertise required.
   Customer scans QR code → Menu loads for that table
- **Super Admin:** Full access to all admin features.
   - REQ-1: System generates unique QR codes for each table (admin dashboard)
   - REQ-2: Menu loads instantly on customer device after scanning QR
   - REQ-3: Table ID is tracked for each order
- Web browsers (Chrome, Firefox, Edge, Safari)
- Mobile devices (Android, iOS)
- Backend: Node.js server
   Customers browse menu categories and items, with images and descriptions. **Priority:** High

   Customer selects category → Items displayed
- Must comply with web accessibility standards (WCAG)
   - REQ-4: System displays menu items with images, descriptions, and prices
   - REQ-5: System allows filtering by category and search
   - REQ-6: Menu data is fetched from backend API

### 2.6 User Documentation
- User manual (digital)
   Customers add items to cart and place orders. Orders are sent to backend and tracked in real time. **Priority:** High
- Admin guide
   Customer adds item to cart → Cart updates
   Customer places order → Order sent to backend, admin notified
- Reliable internet connection required
   - REQ-7: Add/remove items from cart
   - REQ-8: Place order for current table
   - REQ-9: Orders are stored in backend and visible to admin
   - REQ-10: Customers can view order status updates in real time

---

   Admins manage menu, orders, and tables via a secure dashboard. **Priority:** High

   Admin logs in → Dashboard loads
   Admin updates menu/orders/tables → Changes reflected for customers
Allows customers to scan a QR code to access the restaurant menu. **Priority:** High
   - REQ-11: Secure admin login (JWT-based)
   - REQ-12: Add, edit, delete menu items (with image upload)
   - REQ-13: View, confirm, cancel, and track orders
   - REQ-14: Add, delete, and manage tables and QR codes
   - REQ-15: Real-time notifications for new orders
#### 3.1.3 Functional Requirements
- REQ-2: System shall display the menu upon scanning the QR code.

### 3.2 Digital Menu Browsing
#### 3.2.1 Description and Priority
   - Responsive Angular SPA for customers and admins
   - Standard navigation, error messages, and help features
   - Real-time updates for order status and admin notifications
- Customer selects category → Items displayed
#### 3.2.3 Functional Requirements
   - QR code printers (for table codes)
   - Optional: POS system integration (future)

### 3.3 Cart and Order Management
   - RESTful API between frontend and backend
   - MongoDB database
   - MongoDB Atlas (cloud database)
   - Third-party libraries: QR code generation, image upload, JWT
   - Socket.IO for real-time communication
- Customer adds item to cart → Cart updates
- Customer places order → Order sent to kitchen/admin
   - HTTPS for secure communication
   - WebSocket (Socket.IO) for real-time order updates
- REQ-6: System shall process orders and notify admin.
### 3.4 Admin Dashboard
#### 3.4.1 Description and Priority
Admins manage menu, orders, and tables. **Priority:** High
#### 3.4.2 Stimulus/Response Sequences
   - Menu loads within 2 seconds on standard broadband
   - Supports at least 100 concurrent users
   - Real-time updates for orders and admin dashboard
#### 3.4.3 Functional Requirements
- REQ-7: System shall provide secure admin login.
   - Data backup and recovery procedures for MongoDB
   - Prevent data loss on server failure
   - Input validation and error handling throughout
---

   - Secure JWT authentication for admin users
   - Data encryption in transit (HTTPS)
   - Role-based access control for admin features
   - Input validation and sanitization
- Responsive web UI for customers and admins
- Standard navigation, error messages, and help features
   - Usability: Intuitive UI for all user classes
   - Reliability: 99% uptime
   - Maintainability: Modular, well-documented codebase
   - Portability: Works on all major browsers/devices
   - Testability: Unit and integration tests for frontend and backend

- RESTful API between frontend and backend
- Integration with MongoDB
   - Support for multiple languages (future enhancement)
   - Compliance with local data protection laws
   - All features described are implemented and tested in the current codebase
### 4.4 Communications Interfaces
- WebSocket for real-time order updates (optional)

   - **Admin:** Restaurant staff with management privileges
   - **SPA:** Single Page Application
   - **JWT:** JSON Web Token
   - **API:** Application Programming Interface

### 5.1 Performance Requirements
   - Data flow diagrams, class diagrams, and ER diagrams are available in the project documentation and code comments.
- Support at least 100 concurrent users

   - All major requirements are implemented and tested. Open issues and future enhancements are tracked in the project repository.
- Data backup and recovery procedures
- Prevent data loss on server failure

### 5.3 Security Requirements
- Secure authentication for admin users
- Data encryption in transit (HTTPS)
- Role-based access control

### 5.4 Software Quality Attributes
- Usability: Intuitive UI for all user classes
- Reliability: 99% uptime
- Maintainability: Modular codebase
- Portability: Works on all major browsers/devices

---

## 6. Other Requirements
- Support for multiple languages (future enhancement)
- Compliance with local data protection laws

---

## Appendix A: Glossary
- **QR Code:** Quick Response code, a type of matrix barcode
- **POS:** Point of Sale
- **Admin:** Restaurant staff with management privileges

## Appendix B: Analysis Models
- [Insert data flow diagrams, class diagrams, or ER diagrams here]

## Appendix C: Issues List
- [List open issues, TBDs, and pending decisions here]
