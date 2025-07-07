
# Logistics Website

A comprehensive logistics shipment platform built with React, Node.js, and MongoDB. This project consists of three separate apps:

1. **Main Shipment Website** — for customers to book shipments.
2. **Admin Dashboard** — for administrators to manage orders, users, and contact form submissions.
3. **Delivery Agent App** — for delivery personnel to view assigned pickups and deliveries filtered by city.

---

## 🚀 Features

### 🛒 User Flow (Main Website)
- **Login/Signup Required**: Users must log in or sign up before applying for shipment. The React app includes authentication with form validations for secure account creation and login.
- **Shipment Form**: Once logged in, users provide personal details, departure and delivery cities, freight type, weight, insurance choice, and delivery speed (express or standard).
- **Box Selection**: Users pick an appropriate box based on parcel dimensions to account for weight vs. size discrepancies.
- **Checkout**: Enter sender and receiver details.
- **Payment Integration**: Seamless Razorpay payment integration (currently in test mode).
- **Order Confirmation**: Users receive an Order ID for tracking and see a confirmation page after successful payment.
- **Tracking**: Order ID can be used for tracking purposes.

### 🛠️ Admin Dashboard
- View all orders with detailed information.
- Change **order status** through predefined stages:
  - **Confirmed**, **Picked Up**, **Shipped**, **In Transit**, **Out for Delivery**, **Delivered**.
- Orders placed by users are initially marked **Confirmed** and appear in both the admin and delivery agent dashboards.
- Search functionality to quickly find orders by order ID or customer details.
- View messages from the contact form.
- View and manage signed-in users for future promotional messages or marketing outreach.

### 🚚 Delivery Agent App
- Delivery agents can:
  - Select their city.
  - View orders **to be picked up** or **to be delivered**, filtered by their assigned city.
  - Mark orders as **Picked Up** or **Delivered**, updating the order status accordingly.
- The dashboard presents two sections: **To be Picked Up** and **To be Delivered**, helping agents manage tasks efficiently.

---

## 💻 Deployed Links

- **Main Shipment Website** (Traxo App): [https://logistics-website-traxo.onrender.com/](https://logistics-website-traxo.onrender.com/)
- **Admin Dashboard**: [https://logistics-website-admin-dashboard.onrender.com/](https://logistics-website-admin-dashboard.onrender.com/)
- **Delivery Agent App**: [https://logistics-website-delivery-agent-app.onrender.com/](https://logistics-website-delivery-agent-app.onrender.com/)

---

## 💰 Price Calculation Logic

The shipping cost is calculated dynamically using the following steps:

1. **Distance-Based Pricing**  
   - Distances between major Indian cities are calculated using the **Haversine formula**, which computes the great-circle distance between two latitude-longitude points.
   - Shipping cost scales with the calculated distance.

2. **Weight Calculation**  
   - Both actual weight and volumetric weight (based on selected box dimensions) are calculated.
   - The chargeable weight is the higher of the two.

3. **Base Rate**  
   - A base rate per kilogram applies and varies with distance.

4. **Freight Type Adjustments**
   - **Road** and **Rail** have the standard calculated price.
   - **Ocean Freight** (available for coastal cities) adds a surcharge of ₹500.
   - **Air Freight** adds a surcharge of ₹2,000.

5. **Add-Ons and Surcharges**  
   - Express delivery and insurance add fixed surcharges.

6. **Total Cost**  
   ```
   Shipping Price = (Base Rate × Chargeable Weight) + Freight Surcharge + Add-ons + GST
   ```

---

## 📅 Pickup and Delivery Date Logic

The application dynamically calculates pickup and estimated delivery dates based on the shipping speed and freight type:

### 🚚 Pickup Date Logic
- **Express Shipping**:  
  - Pickup date is set to **today**.
- **Standard Shipping**:  
  - Pickup date is set to **tomorrow**.
  - If tomorrow is **Sunday**, pickup moves to **Monday**.
  - If tomorrow is **Saturday**, pickup also moves to **Monday** (i.e., pickup is delayed by two days).

### 📦 Delivery Date Logic
- **Air Freight**:
  - **Express**: Delivery is on the **same day as pickup**.
  - **Standard**: Delivery is **one day after pickup**.
- **Road or Rail Freight** (any other freight charge):
  - **Express**: Delivery is **2-3 days after pickup**.
  - **Standard**: Delivery is **3-4 days after pickup**.
    
---

## 🔐 Sample Payment Details (Razorpay Test Mode)

To test the payment flow, click Success after selecting the payment method

### Card details:
```
Mastercard Card Number: 5267 3181 8797 5449
Visa Car Number : 4386 2894 0766 0153
CVV: 123  (Random CVV)
Expiry Date: 11/26  (Any Future date)

```

### UPI Details  - 

```
success@razorpay 
```

### Net Banking - 

```
Choose a Bank -> Click Pay
```

---

## 📂 Repository Structure

```
├── admin-dashboard/          # React app for admin interface
├── delivery-agent-app/       # React app for delivery agent dashboard
├── traxo/                    # Main customer app + backend
│   ├── backend/              # Node.js/Express backend (API shared by all apps)
│   └── [main app files]      # React customer-facing shipment website
├── .gitignore                # Git ignore file
└── README.md                 # Project documentation
```
---

## 🛠️ Technologies Used

- **Frontend**: React.js, Custom CSS, Bootstrap, SCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Payment Gateway**: Razorpay

---

## ✅ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnmolVerma06/Logistics-Website.git
   cd Logistics-Website
   ```

2. **Install dependencies**
   - For each app (`shipment-website`, `admin-dashboard`, `delivery-agent-app`) and the `backend`, run:
     ```bash
     npm install
     ```

3. **Configure environment variables**
   - Set up your `.env` file in the backend directory with your MongoDB URI, Razorpay keys, etc.

4. **Run the apps locally**
   - Start the backend server:
     ```bash
     npm run dev
     ```
   - In separate terminals, run the three React apps:
     ```bash
     npm start
     ```

5. **Access your apps locally**
   - Shipment Website: http://localhost:3000
   - Admin Dashboard: http://localhost:3001
   - Delivery Agent App: http://localhost:3002

---

## 🙌 Acknowledgements

Developed by [Anmol Verma](https://github.com/AnmolVerma06).

---
