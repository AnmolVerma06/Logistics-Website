const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    weight: { type: String },
    dimensions: { type: String },
    proImg: { type: String }
});

const detailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String },
    country: { type: String },
    post_code: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true }
});

const shippingCostSchema = new mongoose.Schema({
    fromCity: String,
    toCity: String,
    actualWeight: Number,
    volumetricWeight: Number,
    chargeableWeight: Number,
    distanceKm: Number,
    ratePerKg: Number,
    baseShippingCost: Number,
    fuelSurcharge: Number,
    fuelSurchargePercent: Number,
    handlingCharge: Number,
    addOns: {
        insurance: Number,
        expressCharge: Number,
        freightCharge: Number
    },
    subtotal: Number,
    gst: Number,
    totalCost: Number,
    discountOrMultiplier: String,
    breakdown: mongoose.Schema.Types.Mixed
});

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String, required: true },
    status: { type: String, default: 'Confirmed', required: true },
    cartItems: [itemSchema],
    sender: detailsSchema,
    receiver: detailsSchema,
    shippingCost: shippingCostSchema,
    estimatedPickup: { type: Date },
    estimatedDeliveryStart: { type: Date },
    estimatedDeliveryEnd: { type: Date },
    grandTotal: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    departureCity: { type: String, required: true },
    deliverCity: { type: String, required: true },
    weight: { type: String },
    freightType: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 