
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
   - A pre-calculated distance matrix determines the distance between major Indian cities.
   - Shipping cost scales with distance.

2. **Weight Calculation**  
   - Both actual weight and volumetric weight (based on selected box dimensions) are calculated.
   - The chargeable weight is the higher of the two.

3. **Base Rate**  
   - A base rate per kilogram applies and varies with distance.

4. **Add-Ons and Surcharges**  
   - Express delivery and insurance add fixed surcharges.

5. **Total Cost**  
   ```
   Shipping Price = (Base Rate × Chargeable Weight) + Add-ons
   ```

---

## 🔐 Sample Payment Details (Razorpay Test Mode)

To test the payment flow, use these card details:
```
Card Number: 4111 1111 1111 1111  
CVV: 123  
Expiry Date: 11/26  
```

---

## 📂 Repository Structure

```
.
├── shipment-website/          # Customer-facing React app
├── admin-dashboard/           # Admin React app
├── delivery-agent-app/        # Delivery agent React app
└── backend/                   # Node.js/Express API with MongoDB
```

---

## 🛠️ Technologies Used

- **Frontend**: React.js, Tailwind CSS
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
     npm start
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

## 📦 Future Improvements

- Real-time order status updates for customers and delivery agents.
- Push notifications for order updates.
- Enhanced analytics in admin dashboard.
- Integration with live distance APIs like Google Maps.
- Automated tracking updates.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

Developed by [Anmol Verma](https://github.com/AnmolVerma06).

---
