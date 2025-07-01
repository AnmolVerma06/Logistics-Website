const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Order = require('./models/Order');
const rateLimit = require('express-rate-limit');
const ContactMessage = require('./models/ContactMessage');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret'; // Change this in production

// Middleware
app.use(cors({
  origin: ['https://logistics-website-delivery-agent-app.onrender.com'],
  credentials: true, // Optional: needed if you're sending cookies or auth headers
}));
app.use(express.json());

// MongoDB connection

mongoose.connect('mongodb+srv://vermaanmol010:Asmodeus123@cluster0.h7tophq.mongodb.net/logistics?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
  

// Static distance database for 25 major Indian cities
const cities = {
    'Mumbai': 'Maharashtra',
    'Delhi': 'National Capital Territory',
    'Bangalore': 'Karnataka',
    'Bengaluru': 'Karnataka', // Alternative name
    'Hyderabad': 'Telangana',
    'Chennai': 'Tamil Nadu',
    'Kolkata': 'West Bengal',
    'Pune': 'Maharashtra',
    'Ahmedabad': 'Gujarat',
    'Jaipur': 'Rajasthan',
    'Lucknow': 'Uttar Pradesh',
    'Kanpur': 'Uttar Pradesh',
    'Nagpur': 'Maharashtra',
    'Indore': 'Madhya Pradesh',
    'Bhopal': 'Madhya Pradesh',
    'Patna': 'Bihar',
    'Surat': 'Gujarat',
    'Vadodara': 'Gujarat',
    'Baroda': 'Gujarat', // Alternative name
    'Ranchi': 'Jharkhand',
    'Raipur': 'Chhattisgarh',
    'Chandigarh': 'Chandigarh',
    'Ludhiana': 'Punjab',
    'Guwahati': 'Assam',
    'Coimbatore': 'Tamil Nadu',
    'Visakhapatnam': 'Andhra Pradesh',
    'Thiruvananthapuram': 'Kerala'
};

// Pre-calculated distances between cities (in kilometers)
const distanceMatrix = {
    'Mumbai': {
        'Delhi': 1150, 'Bangalore': 850, 'Hyderabad': 620, 'Chennai': 1050, 'Kolkata': 1650,
        'Pune': 150, 'Ahmedabad': 530, 'Jaipur': 1150, 'Lucknow': 1350, 'Kanpur': 1250,
        'Nagpur': 800, 'Indore': 600, 'Bhopal': 750, 'Patna': 1650, 'Surat': 280,
        'Vadodara': 450, 'Ranchi': 1550, 'Raipur': 1200, 'Chandigarh': 1400, 'Ludhiana': 1500,
        'Guwahati': 2500, 'Coimbatore': 1200, 'Visakhapatnam': 1400, 'Thiruvananthapuram': 1500
    },
    'Delhi': {
        'Mumbai': 1150, 'Bangalore': 1750, 'Hyderabad': 1250, 'Chennai': 1750, 'Kolkata': 1300,
        'Pune': 1200, 'Ahmedabad': 800, 'Jaipur': 280, 'Lucknow': 500, 'Kanpur': 450,
        'Nagpur': 950, 'Indore': 750, 'Bhopal': 600, 'Patna': 850, 'Surat': 950,
        'Vadodara': 850, 'Ranchi': 1100, 'Raipur': 1200, 'Chandigarh': 250, 'Ludhiana': 300,
        'Guwahati': 1800, 'Coimbatore': 2000, 'Visakhapatnam': 1600, 'Thiruvananthapuram': 2500
    },
    'Bangalore': {
        'Mumbai': 850, 'Delhi': 1750, 'Hyderabad': 500, 'Chennai': 350, 'Kolkata': 1800,
        'Pune': 750, 'Ahmedabad': 1400, 'Jaipur': 1800, 'Lucknow': 1800, 'Kanpur': 1750,
        'Nagpur': 1200, 'Indore': 1400, 'Bhopal': 1500, 'Patna': 1800, 'Surat': 1400,
        'Vadodara': 1400, 'Ranchi': 1700, 'Raipur': 1400, 'Chandigarh': 2000, 'Ludhiana': 2100,
        'Guwahati': 2500, 'Coimbatore': 350, 'Visakhapatnam': 1000, 'Thiruvananthapuram': 600
    },
    'Hyderabad': {
        'Mumbai': 620, 'Delhi': 1250, 'Bangalore': 500, 'Chennai': 650, 'Kolkata': 1300,
        'Pune': 500, 'Ahmedabad': 1000, 'Jaipur': 1300, 'Lucknow': 1200, 'Kanpur': 1150,
        'Nagpur': 450, 'Indore': 700, 'Bhopal': 750, 'Patna': 1200, 'Surat': 1000,
        'Vadodara': 1000, 'Ranchi': 1100, 'Raipur': 700, 'Chandigarh': 1500, 'Ludhiana': 1600,
        'Guwahati': 2000, 'Coimbatore': 800, 'Visakhapatnam': 550, 'Thiruvananthapuram': 1100
    },
    'Chennai': {
        'Mumbai': 1050, 'Delhi': 1750, 'Bangalore': 350, 'Hyderabad': 650, 'Kolkata': 1650,
        'Pune': 1000, 'Ahmedabad': 1400, 'Jaipur': 1800, 'Lucknow': 1800, 'Kanpur': 1750,
        'Nagpur': 1200, 'Indore': 1400, 'Bhopal': 1500, 'Patna': 1800, 'Surat': 1400,
        'Vadodara': 1400, 'Ranchi': 1700, 'Raipur': 1400, 'Chandigarh': 2000, 'Ludhiana': 2100,
        'Guwahati': 2500, 'Coimbatore': 450, 'Visakhapatnam': 800, 'Thiruvananthapuram': 700
    },
    'Kolkata': {
        'Mumbai': 1650, 'Delhi': 1300, 'Bangalore': 1800, 'Hyderabad': 1300, 'Chennai': 1650,
        'Pune': 1600, 'Ahmedabad': 1600, 'Jaipur': 1500, 'Lucknow': 900, 'Kanpur': 950,
        'Nagpur': 1100, 'Indore': 1200, 'Bhopal': 1100, 'Patna': 500, 'Surat': 1600,
        'Vadodara': 1600, 'Ranchi': 400, 'Raipur': 800, 'Chandigarh': 1500, 'Ludhiana': 1600,
        'Guwahati': 1000, 'Coimbatore': 2000, 'Visakhapatnam': 1200, 'Thiruvananthapuram': 2200
    },
    'Pune': {
        'Mumbai': 150, 'Delhi': 1200, 'Bangalore': 750, 'Hyderabad': 500, 'Chennai': 1000,
        'Kolkata': 1600, 'Ahmedabad': 650, 'Jaipur': 1200, 'Lucknow': 1300, 'Kanpur': 1200,
        'Nagpur': 700, 'Indore': 500, 'Bhopal': 650, 'Patna': 1500, 'Surat': 400,
        'Vadodara': 550, 'Ranchi': 1400, 'Raipur': 1000, 'Chandigarh': 1500, 'Ludhiana': 1600,
        'Guwahati': 2400, 'Coimbatore': 1100, 'Visakhapatnam': 1300, 'Thiruvananthapuram': 1400
    },
    'Ahmedabad': {
        'Mumbai': 530, 'Delhi': 800, 'Bangalore': 1400, 'Hyderabad': 1000, 'Chennai': 1400,
        'Kolkata': 1600, 'Pune': 650, 'Jaipur': 650, 'Lucknow': 1000, 'Kanpur': 950,
        'Nagpur': 800, 'Indore': 500, 'Bhopal': 650, 'Patna': 1200, 'Surat': 250,
        'Vadodara': 100, 'Ranchi': 1200, 'Raipur': 900, 'Chandigarh': 1000, 'Ludhiana': 1100,
        'Guwahati': 2000, 'Coimbatore': 1600, 'Visakhapatnam': 1400, 'Thiruvananthapuram': 1800
    },
    'Jaipur': {
        'Mumbai': 1150, 'Delhi': 280, 'Bangalore': 1800, 'Hyderabad': 1300, 'Chennai': 1800,
        'Kolkata': 1500, 'Pune': 1200, 'Ahmedabad': 650, 'Lucknow': 550, 'Kanpur': 500,
        'Nagpur': 900, 'Indore': 500, 'Bhopal': 400, 'Patna': 900, 'Surat': 900,
        'Vadodara': 800, 'Ranchi': 1200, 'Raipur': 1000, 'Chandigarh': 500, 'Ludhiana': 600,
        'Guwahati': 2000, 'Coimbatore': 2000, 'Visakhapatnam': 1600, 'Thiruvananthapuram': 2500
    },
    'Lucknow': {
        'Mumbai': 1350, 'Delhi': 500, 'Bangalore': 1800, 'Hyderabad': 1200, 'Chennai': 1800,
        'Kolkata': 900, 'Pune': 1300, 'Ahmedabad': 1000, 'Jaipur': 550, 'Kanpur': 80,
        'Nagpur': 700, 'Indore': 800, 'Bhopal': 600, 'Patna': 400, 'Surat': 1200,
        'Vadodara': 1100, 'Ranchi': 600, 'Raipur': 700, 'Chandigarh': 750, 'Ludhiana': 800,
        'Guwahati': 1200, 'Coimbatore': 2000, 'Visakhapatnam': 1200, 'Thiruvananthapuram': 2200
    },
    'Kanpur': {
        'Mumbai': 1250, 'Delhi': 450, 'Bangalore': 1750, 'Hyderabad': 1150, 'Chennai': 1750,
        'Kolkata': 950, 'Pune': 1200, 'Ahmedabad': 950, 'Jaipur': 500, 'Lucknow': 80,
        'Nagpur': 650, 'Indore': 750, 'Bhopal': 550, 'Patna': 350, 'Surat': 1150,
        'Vadodara': 1050, 'Ranchi': 550, 'Raipur': 650, 'Chandigarh': 700, 'Ludhiana': 750,
        'Guwahati': 1150, 'Coimbatore': 1950, 'Visakhapatnam': 1150, 'Thiruvananthapuram': 2150
    },
    'Nagpur': {
        'Mumbai': 800, 'Delhi': 950, 'Bangalore': 1200, 'Hyderabad': 450, 'Chennai': 1200,
        'Kolkata': 1100, 'Pune': 700, 'Ahmedabad': 800, 'Jaipur': 900, 'Lucknow': 700,
        'Kanpur': 650, 'Indore': 300, 'Bhopal': 250, 'Patna': 800, 'Surat': 800,
        'Vadodara': 800, 'Ranchi': 700, 'Raipur': 400, 'Chandigarh': 1200, 'Ludhiana': 1300,
        'Guwahati': 1800, 'Coimbatore': 1400, 'Visakhapatnam': 900, 'Thiruvananthapuram': 1600
    },
    'Indore': {
        'Mumbai': 600, 'Delhi': 750, 'Bangalore': 1400, 'Hyderabad': 700, 'Chennai': 1400,
        'Kolkata': 1200, 'Pune': 500, 'Ahmedabad': 500, 'Jaipur': 500, 'Lucknow': 800,
        'Kanpur': 750, 'Nagpur': 300, 'Bhopal': 200, 'Patna': 900, 'Surat': 500,
        'Vadodara': 400, 'Ranchi': 900, 'Raipur': 600, 'Chandigarh': 1000, 'Ludhiana': 1100,
        'Guwahati': 1900, 'Coimbatore': 1600, 'Visakhapatnam': 1100, 'Thiruvananthapuram': 1800
    },
    'Bhopal': {
        'Mumbai': 750, 'Delhi': 600, 'Bangalore': 1500, 'Hyderabad': 750, 'Chennai': 1500,
        'Kolkata': 1100, 'Pune': 650, 'Ahmedabad': 650, 'Jaipur': 400, 'Lucknow': 600,
        'Kanpur': 550, 'Nagpur': 250, 'Indore': 200, 'Patna': 700, 'Surat': 650,
        'Vadodara': 550, 'Ranchi': 700, 'Raipur': 500, 'Chandigarh': 800, 'Ludhiana': 900,
        'Guwahati': 1700, 'Coimbatore': 1700, 'Visakhapatnam': 1200, 'Thiruvananthapuram': 1900
    },
    'Patna': {
        'Mumbai': 1650, 'Delhi': 850, 'Bangalore': 1800, 'Hyderabad': 1200, 'Chennai': 1800,
        'Kolkata': 500, 'Pune': 1500, 'Ahmedabad': 1200, 'Jaipur': 900, 'Lucknow': 400,
        'Kanpur': 350, 'Nagpur': 800, 'Indore': 900, 'Bhopal': 700, 'Surat': 1200,
        'Vadodara': 1200, 'Ranchi': 300, 'Raipur': 600, 'Chandigarh': 1100, 'Ludhiana': 1200,
        'Guwahati': 800, 'Coimbatore': 2000, 'Visakhapatnam': 1200, 'Thiruvananthapuram': 2200
    },
    'Surat': {
        'Mumbai': 280, 'Delhi': 950, 'Bangalore': 1400, 'Hyderabad': 1000, 'Chennai': 1400,
        'Kolkata': 1600, 'Pune': 400, 'Ahmedabad': 250, 'Jaipur': 900, 'Lucknow': 1200,
        'Kanpur': 1150, 'Nagpur': 800, 'Indore': 500, 'Bhopal': 650, 'Patna': 1200,
        'Vadodara': 150, 'Ranchi': 1200, 'Raipur': 900, 'Chandigarh': 1000, 'Ludhiana': 1100,
        'Guwahati': 2000, 'Coimbatore': 1600, 'Visakhapatnam': 1400, 'Thiruvananthapuram': 1800
    },
    'Vadodara': {
        'Mumbai': 450, 'Delhi': 850, 'Bangalore': 1400, 'Hyderabad': 1000, 'Chennai': 1400,
        'Kolkata': 1600, 'Pune': 550, 'Ahmedabad': 100, 'Jaipur': 800, 'Lucknow': 1100,
        'Kanpur': 1050, 'Nagpur': 800, 'Indore': 400, 'Bhopal': 550, 'Patna': 1200,
        'Surat': 150, 'Ranchi': 1200, 'Raipur': 900, 'Chandigarh': 1000, 'Ludhiana': 1100,
        'Guwahati': 2000, 'Coimbatore': 1600, 'Visakhapatnam': 1400, 'Thiruvananthapuram': 1800
    },
    'Ranchi': {
        'Mumbai': 1550, 'Delhi': 1100, 'Bangalore': 1700, 'Hyderabad': 1100, 'Chennai': 1700,
        'Kolkata': 400, 'Pune': 1400, 'Ahmedabad': 1200, 'Jaipur': 1200, 'Lucknow': 600,
        'Kanpur': 550, 'Nagpur': 700, 'Indore': 900, 'Bhopal': 700, 'Patna': 300,
        'Surat': 1200, 'Vadodara': 1200, 'Raipur': 400, 'Chandigarh': 1300, 'Ludhiana': 1400,
        'Guwahati': 800, 'Coimbatore': 1900, 'Visakhapatnam': 1000, 'Thiruvananthapuram': 2100
    },
    'Raipur': {
        'Mumbai': 1200, 'Delhi': 1200, 'Bangalore': 1400, 'Hyderabad': 700, 'Chennai': 1400,
        'Kolkata': 800, 'Pune': 1000, 'Ahmedabad': 900, 'Jaipur': 1000, 'Lucknow': 700,
        'Kanpur': 650, 'Nagpur': 400, 'Indore': 600, 'Bhopal': 500, 'Patna': 600,
        'Surat': 900, 'Vadodara': 900, 'Ranchi': 400, 'Chandigarh': 1300, 'Ludhiana': 1400,
        'Guwahati': 1200, 'Coimbatore': 1600, 'Visakhapatnam': 600, 'Thiruvananthapuram': 1800
    },
    'Chandigarh': {
        'Mumbai': 1400, 'Delhi': 250, 'Bangalore': 2000, 'Hyderabad': 1500, 'Chennai': 2000,
        'Kolkata': 1500, 'Pune': 1500, 'Ahmedabad': 1000, 'Jaipur': 500, 'Lucknow': 750,
        'Kanpur': 700, 'Nagpur': 1200, 'Indore': 1000, 'Bhopal': 800, 'Patna': 1100,
        'Surat': 1000, 'Vadodara': 1000, 'Ranchi': 1300, 'Raipur': 1300, 'Ludhiana': 100,
        'Guwahati': 2200, 'Coimbatore': 2200, 'Visakhapatnam': 1800, 'Thiruvananthapuram': 2700
    },
    'Ludhiana': {
        'Mumbai': 1500, 'Delhi': 300, 'Bangalore': 2100, 'Hyderabad': 1600, 'Chennai': 2100,
        'Kolkata': 1600, 'Pune': 1600, 'Ahmedabad': 1100, 'Jaipur': 600, 'Lucknow': 800,
        'Kanpur': 750, 'Nagpur': 1300, 'Indore': 1100, 'Bhopal': 900, 'Patna': 1200,
        'Surat': 1100, 'Vadodara': 1100, 'Ranchi': 1400, 'Raipur': 1400, 'Chandigarh': 100,
        'Guwahati': 2300, 'Coimbatore': 2300, 'Visakhapatnam': 1900, 'Thiruvananthapuram': 2800
    },
    'Guwahati': {
        'Mumbai': 2500, 'Delhi': 1800, 'Bangalore': 2500, 'Hyderabad': 2000, 'Chennai': 2500,
        'Kolkata': 1000, 'Pune': 2400, 'Ahmedabad': 2000, 'Jaipur': 2000, 'Lucknow': 1200,
        'Kanpur': 1150, 'Nagpur': 1800, 'Indore': 1900, 'Bhopal': 1700, 'Patna': 800,
        'Surat': 2000, 'Vadodara': 2000, 'Ranchi': 800, 'Raipur': 1200, 'Chandigarh': 2200,
        'Ludhiana': 2300, 'Coimbatore': 2700, 'Visakhapatnam': 2000, 'Thiruvananthapuram': 3000
    },
    'Coimbatore': {
        'Mumbai': 1200, 'Delhi': 2000, 'Bangalore': 350, 'Hyderabad': 800, 'Chennai': 450,
        'Kolkata': 2000, 'Pune': 1100, 'Ahmedabad': 1600, 'Jaipur': 2000, 'Lucknow': 2000,
        'Kanpur': 1950, 'Nagpur': 1400, 'Indore': 1600, 'Bhopal': 1700, 'Patna': 2000,
        'Surat': 1600, 'Vadodara': 1600, 'Ranchi': 1900, 'Raipur': 1600, 'Chandigarh': 2200,
        'Ludhiana': 2300, 'Guwahati': 2700, 'Visakhapatnam': 1200, 'Thiruvananthapuram': 400
    },
    'Visakhapatnam': {
        'Mumbai': 1400, 'Delhi': 1600, 'Bangalore': 1000, 'Hyderabad': 550, 'Chennai': 800,
        'Kolkata': 1200, 'Pune': 1300, 'Ahmedabad': 1400, 'Jaipur': 1600, 'Lucknow': 1200,
        'Kanpur': 1150, 'Nagpur': 900, 'Indore': 1100, 'Bhopal': 1200, 'Patna': 1200,
        'Surat': 1400, 'Vadodara': 1400, 'Ranchi': 1000, 'Raipur': 600, 'Chandigarh': 1800,
        'Ludhiana': 1900, 'Guwahati': 2000, 'Coimbatore': 1200, 'Thiruvananthapuram': 1600
    },
    'Thiruvananthapuram': {
        'Mumbai': 1500, 'Delhi': 2500, 'Bangalore': 600, 'Hyderabad': 1100, 'Chennai': 700,
        'Kolkata': 2200, 'Pune': 1400, 'Ahmedabad': 1800, 'Jaipur': 2500, 'Lucknow': 2200,
        'Kanpur': 2150, 'Nagpur': 1600, 'Indore': 1800, 'Bhopal': 1900, 'Patna': 2200,
        'Surat': 1800, 'Vadodara': 1800, 'Ranchi': 2100, 'Raipur': 1800, 'Chandigarh': 2700,
        'Ludhiana': 2800, 'Guwahati': 3000, 'Coimbatore': 400, 'Visakhapatnam': 1600
    }
};

// City coordinates for Haversine distance calculation
const cityCoordinates = {
    'Mumbai': { lat: 19.0760, lon: 72.8777 },
    'Delhi': { lat: 28.7041, lon: 77.1025 },
    'Bangalore': { lat: 12.9716, lon: 77.5946 },
    'Hyderabad': { lat: 17.3850, lon: 78.4867 },
    'Chennai': { lat: 13.0827, lon: 80.2707 },
    'Kolkata': { lat: 22.5726, lon: 88.3639 },
    'Pune': { lat: 18.5204, lon: 73.8567 },
    'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
    'Jaipur': { lat: 26.9124, lon: 75.7873 },
    'Lucknow': { lat: 26.8467, lon: 80.9462 },
    'Kanpur': { lat: 26.4499, lon: 80.3319 },
    'Nagpur': { lat: 21.1458, lon: 79.0882 },
    'Indore': { lat: 22.7196, lon: 75.8577 },
    'Bhopal': { lat: 23.2599, lon: 77.4126 },
    'Patna': { lat: 25.5941, lon: 85.1376 },
    'Surat': { lat: 21.1702, lon: 72.8311 },
    'Vadodara': { lat: 22.3072, lon: 73.1812 },
    'Ranchi': { lat: 23.3441, lon: 85.3096 },
    'Raipur': { lat: 21.2514, lon: 81.6296 },
    'Chandigarh': { lat: 30.7333, lon: 76.7794 },
    'Ludhiana': { lat: 30.9010, lon: 75.8573 },
    'Guwahati': { lat: 26.1445, lon: 91.7362 },
    'Coimbatore': { lat: 11.0168, lon: 76.9558 },
    'Visakhapatnam': { lat: 17.6868, lon: 83.2185 },
    'Thiruvananthapuram': { lat: 8.5241, lon: 76.9366 },
    'Udaipur': { lat: 24.5854, lon: 73.7125 }
};

// Haversine formula to calculate distance between two points
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

// Function to normalize city names
const normalizeCityName = (cityName) => {
    let normalized = cityName.trim();
    
    // Handle alternative names
    if (normalized.toLowerCase() === 'bengaluru') {
        normalized = 'Bangalore';
    } else if (normalized.toLowerCase() === 'baroda') {
        normalized = 'Vadodara';
    }
    
    // Check if city exists in our database
    if (!cities[normalized] && !distanceMatrix[normalized]) {
        throw new Error(`City "${normalized}" not found in our database. Please use one of the 25 major Indian cities.`);
    }
    
    return normalized;
};

// Function to get distance between two cities
const getDistance = (origin, destination) => {
    const normalizedOrigin = normalizeCityName(origin);
    const normalizedDestination = normalizeCityName(destination);
    
    // Check if we have the distance in our matrix
    if (distanceMatrix[normalizedOrigin] && distanceMatrix[normalizedOrigin][normalizedDestination]) {
        return {
            distance: distanceMatrix[normalizedOrigin][normalizedDestination],
            origin: normalizedOrigin,
            destination: normalizedDestination,
            originState: cities[normalizedOrigin],
            destinationState: cities[normalizedDestination]
        };
    }
    
    // Try reverse direction
    if (distanceMatrix[normalizedDestination] && distanceMatrix[normalizedDestination][normalizedOrigin]) {
        return {
            distance: distanceMatrix[normalizedDestination][normalizedOrigin],
            origin: normalizedOrigin,
            destination: normalizedDestination,
            originState: cities[normalizedOrigin],
            destinationState: cities[normalizedDestination]
        };
    }
    
    throw new Error(`Distance not found between "${normalizedOrigin}" and "${normalizedDestination}"`);
};

// Function to calculate volumetric weight
const calculateVolumetricWeight = (length, width, height) => {
    return (length * width * height) / 5000;
};

// Function to get chargeable weight (higher of actual vs volumetric)
const getChargeableWeight = (actualWeight, length, width, height) => {
    const volumetricWeight = calculateVolumetricWeight(length, width, height);
    return Math.max(actualWeight, volumetricWeight);
};

// Function to get base rate per kg based on distance
const getBaseRate = (distance) => {
    if (distance < 500) {
        return 30; // ₹30/kg for < 500 km
    } else if (distance <= 1000) {
        return 40; // ₹40/kg for 500–1000 km
    } else {
        return 50; // ₹50/kg for > 1000 km
    }
};

// Function to calculate shipping cost
const calculateShippingCost = (params) => {
    const {
        departureCity,
        deliveryCity,
        actualWeight,
        length,
        width,
        height,
        freightType,
        insurance,
        deliveryOption
    } = params;

    // Get distance between cities
    const distanceResult = getDistance(departureCity, deliveryCity);
    const distance = distanceResult.distance;

    // Calculate chargeable weight
    const chargeableWeight = getChargeableWeight(actualWeight, length, width, height);
    const volumetricWeight = calculateVolumetricWeight(length, width, height);

    // Get base rate per kg
    const baseRate = getBaseRate(distance);

    // Calculate base shipping cost
    let baseCost = chargeableWeight * baseRate;

    // Apply freight type surcharges
    let freightSurcharge = 0;
    if (freightType === 'air') {
        freightSurcharge = 2000; // ₹2000 extra for air freight
    } else if (freightType === 'ocean') {
        freightSurcharge = 500; // ₹500 extra for ocean freight
    }
    // Road and Rail have no extra charge

    // Apply insurance surcharge
    let insuranceSurcharge = 0;
    if (insurance === 'yes') {
        insuranceSurcharge = 100; // ₹100 extra for insurance
    }

    // Apply delivery option surcharge
    let deliverySurcharge = 0;
    if (deliveryOption === 'express') {
        deliverySurcharge = 200; // ₹200 extra for express delivery
    }

    // Calculate subtotal
    const subtotal = baseCost + freightSurcharge + insuranceSurcharge + deliverySurcharge;

    // Calculate GST (18%)
    const gst = subtotal * 0.18;

    // Calculate total
    const total = subtotal + gst;

    return {
        distance,
        actualWeight,
        volumetricWeight,
        chargeableWeight,
        baseRate,
        baseCost,
        freightSurcharge,
        insuranceSurcharge,
        deliverySurcharge,
        subtotal,
        gst,
        total,
        breakdown: {
            distance: `${distance} km`,
            actualWeight: `${actualWeight} kg`,
            volumetricWeight: `${volumetricWeight.toFixed(2)} kg`,
            chargeableWeight: `${chargeableWeight.toFixed(2)} kg`,
            baseRate: `₹${baseRate}/kg`,
            baseCost: `₹${baseCost.toFixed(2)}`,
            freightSurcharge: freightSurcharge > 0 ? `₹${freightSurcharge.toFixed(2)}` : '₹0.00',
            insuranceSurcharge: insuranceSurcharge > 0 ? `₹${insuranceSurcharge.toFixed(2)}` : '₹0.00',
            deliverySurcharge: deliverySurcharge > 0 ? `₹${deliverySurcharge.toFixed(2)}` : '₹0.00',
            subtotal: `₹${subtotal.toFixed(2)}`,
            gst: `₹${gst.toFixed(2)}`,
            total: `₹${total.toFixed(2)}`
        }
    };
};

// Pure JavaScript function to calculate shipping cost based on user input
const calculateShippingCostV2 = (input) => {
    const {
        fromCity,
        toCity,
        actualWeight,
        dimensions,
        express,
        insurance,
        freightType
    } = input;

    // Validate input
    if (!fromCity || !toCity || !actualWeight || !dimensions) {
        throw new Error('Missing required fields: fromCity, toCity, actualWeight, dimensions');
    }

    if (!dimensions.length || !dimensions.width || !dimensions.height) {
        throw new Error('Dimensions must include length, width, and height');
    }

    // Validate cities exist in our coordinates
    if (!cityCoordinates[fromCity]) {
        throw new Error(`City "${fromCity}" not found in our database`);
    }
    if (!cityCoordinates[toCity]) {
        throw new Error(`City "${toCity}" not found in our database`);
    }

    // 1. Calculate volumetric weight using new formula: (L × W × H) / 4000
    const volumetricWeight = (dimensions.length * dimensions.width * dimensions.height) / 4000;

    // 2. Determine chargeable weight (greater of actual or volumetric)
    const chargeableWeight = Math.max(actualWeight, volumetricWeight);

    // 3. Calculate distance using Haversine formula
    const fromCoords = cityCoordinates[fromCity];
    const toCoords = cityCoordinates[toCity];
    const distanceKm = calculateHaversineDistance(
        fromCoords.lat, fromCoords.lon,
        toCoords.lat, toCoords.lon
    );

    // 4. Determine rate per kg and handling charges based on distance slabs
    let ratePerKg, fuelSurchargePercent, handlingCharge;
    
    if (distanceKm <= 500) {
        ratePerKg = 30;
        fuelSurchargePercent = 20;
        handlingCharge = 50;
    } else if (distanceKm <= 700) {
        ratePerKg = 40;
        fuelSurchargePercent = 50;
        handlingCharge = 75;
    } else if (distanceKm <= 999) {
        ratePerKg = 50;
        fuelSurchargePercent = 40;
        handlingCharge = 100;
    } else {
        ratePerKg = 60;
        fuelSurchargePercent = 0; // No fuel surcharge above 1000km
        handlingCharge = 150;
    }

    // 5. Calculate base shipping cost
    let baseShippingCost = chargeableWeight * ratePerKg;
    
    // 6. Apply minimum base shipping of ₹300 and distance-based minimums
    if (baseShippingCost < 300) {
        baseShippingCost = 300;
    }
    
    // Apply distance-based minimum base shipping
    if (distanceKm > 1500) {
        baseShippingCost = Math.max(baseShippingCost, 2000);
    } else if (distanceKm > 1000) {
        baseShippingCost = Math.max(baseShippingCost, 1200);
    } else if (distanceKm > 500) {
        baseShippingCost = Math.max(baseShippingCost, 600);
    }

    // 7. Calculate fuel surcharge
    const fuelSurcharge = (baseShippingCost * fuelSurchargePercent) / 100;

    // 8. Calculate add-on charges
    const addOns = {
        insurance: insurance === true ? 100 : 0,
        expressCharge: express === true ? 200 : 0,
        freightCharge: 0
    };

    // Freight type charges
    if (freightType === 'flight') {
        addOns.freightCharge = 2000;
    } else if (freightType === 'ocean') {
        addOns.freightCharge = 500;
    }

    // 9. Calculate subtotal
    const subtotal = baseShippingCost + fuelSurcharge + handlingCharge + 
                    addOns.insurance + addOns.expressCharge + addOns.freightCharge;

    // 10. Calculate GST (18%)
    const gst = subtotal * 0.18;

    // 11. Calculate total cost
    let totalCost = subtotal + gst;
    let discountOrMultiplier = null;
    if (chargeableWeight < 4) {
        totalCost = totalCost * 0.5;
        discountOrMultiplier = '50% discount for <3kg';
    } else if (chargeableWeight > 10) {
        totalCost = totalCost * 2;
        discountOrMultiplier = '2x price for >10kg';
    } else if (chargeableWeight > 4) {
        discountOrMultiplier = 'No discount (4-10kg)';
    }

    return {
        fromCity,
        toCity,
        actualWeight,
        volumetricWeight: parseFloat(volumetricWeight.toFixed(2)),
        chargeableWeight: parseFloat(chargeableWeight.toFixed(2)),
        distanceKm: parseFloat(distanceKm.toFixed(2)),
        ratePerKg,
        baseShippingCost: parseFloat(baseShippingCost.toFixed(2)),
        fuelSurcharge: parseFloat(fuelSurcharge.toFixed(2)),
        fuelSurchargePercent,
        handlingCharge,
        addOns,
        subtotal: parseFloat(subtotal.toFixed(2)),
        gst: parseFloat(gst.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2)),
        discountOrMultiplier,
        breakdown: {
            baseShipping: parseFloat(baseShippingCost.toFixed(2)),
            fuelSurcharge: parseFloat(fuelSurcharge.toFixed(2)),
            handling: handlingCharge,
            insurance: addOns.insurance,
            express: addOns.expressCharge,
            freight: addOns.freightCharge,
            subtotal: parseFloat(subtotal.toFixed(2)),
            gst: parseFloat(gst.toFixed(2)),
            total: parseFloat(totalCost.toFixed(2))
        }
    };
};

// Auth routes
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create and save the user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json({ message: 'Signup successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    // Issue JWT token
    const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful!', token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Protected route example
app.get('/api/profile', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Shipping calculation endpoint
app.post('/api/calculate-price', async (req, res) => {
    try {
        const {
            departureCity,
            deliveryCity,
            actualWeight,
            length,
            width,
            height,
            freightType = 'road',
            insurance = 'no',
            deliveryOption = 'standard'
        } = req.body;

        console.log('Shipping calculation request:', req.body);

        // Validate required fields
        if (!departureCity || !deliveryCity || !actualWeight || !length || !width || !height) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['departureCity', 'deliveryCity', 'actualWeight', 'length', 'width', 'height'],
                optional: ['freightType', 'insurance', 'deliveryOption']
            });
        }

        // Validate freight type
        if (freightType && !['road', 'rail', 'air', 'ocean'].includes(freightType)) {
            return res.status(400).json({
                error: 'Invalid freight type. Must be "road", "rail", "air", or "ocean"'
            });
        }

        // Validate insurance
        if (insurance && !['yes', 'no'].includes(insurance)) {
            return res.status(400).json({
                error: 'Invalid insurance option. Must be "yes" or "no"'
            });
        }

        // Validate delivery option
        if (deliveryOption && !['standard', 'express'].includes(deliveryOption)) {
            return res.status(400).json({
                error: 'Invalid delivery option. Must be "standard" or "express"'
            });
        }

        // Calculate shipping cost
        const result = calculateShippingCost({
            departureCity,
            deliveryCity,
            actualWeight: parseFloat(actualWeight),
            length: parseFloat(length),
            width: parseFloat(width),
            height: parseFloat(height),
            freightType,
            insurance,
            deliveryOption
        });

        console.log('Shipping calculation result:', result);

        res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Error calculating shipping cost:', error);
        res.status(400).json({
            error: 'Shipping calculation failed',
            details: error.message
        });
    }
});

// Distance calculation endpoint (existing)
app.post('/api/calculate-distance', async (req, res) => {
  try {
    const { origin, destination } = req.body;
    
    console.log('Distance calculation request:', { origin, destination });
    
    if (!origin || !destination) {
      return res.status(400).json({ 
        error: 'Origin and destination are required' 
      });
    }

    // Get distance from static database
    const distanceResult = getDistance(origin, destination);
    const price = distanceResult.distance * 5; // 5 rupees per kilometer

    console.log('Distance calculation result:', {
      distance: distanceResult.distance,
      price: price,
      origin: distanceResult.origin,
      destination: distanceResult.destination
    });

    res.json({
      success: true,
      distance: distanceResult.distance,
      price: price,
      origin: distanceResult.origin,
      destination: distanceResult.destination,
      originState: distanceResult.originState,
      destinationState: distanceResult.destinationState,
      distanceText: `${distanceResult.distance} km`,
      note: 'Static distance database'
    });

  } catch (error) {
    console.error('Error calculating distance:', error);
    res.status(400).json({
      error: 'Distance calculation failed',
      details: error.message
    });
  }
});

// Get list of available cities
app.get('/api/cities', (req, res) => {
  res.json({
    cities: cities,
    totalCities: Object.keys(cities).length,
    note: '25 major Indian cities available for distance calculation'
  });
});

// Test distance endpoint
app.get('/api/test-distance', (req, res) => {
  try {
    const { origin, destination } = req.query;
    
    if (!origin || !destination) {
      return res.status(400).json({ 
        error: 'Origin and destination query parameters are required' 
      });
    }

    const distanceResult = getDistance(origin, destination);
    const price = distanceResult.distance * 5;
    
    res.json({
      request: { origin, destination },
      result: distanceResult,
      price: price,
      totalCities: Object.keys(cities).length
    });

  } catch (error) {
    res.status(400).json({
      error: 'Test failed',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running with static distance database',
    totalCities: Object.keys(cities).length
  });
});

// New endpoint for calculation form + cart dimensions
app.post('/api/calculate-shipping-v2', async (req, res) => {
    try {
        const {
            fromCity,
            toCity,
            actualWeight,
            dimensions,
            express,
            insurance,
            freightType
        } = req.body;

        console.log('Shipping calculation V2 request:', req.body);

        // Validate required fields
        if (!fromCity || !toCity || !actualWeight || !dimensions) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['fromCity', 'toCity', 'actualWeight', 'dimensions'],
                optional: ['express', 'insurance', 'freightType']
            });
        }

        // Validate dimensions
        if (!dimensions.length || !dimensions.width || !dimensions.height) {
            return res.status(400).json({
                error: 'Dimensions must include length, width, and height'
            });
        }

        // Validate freight type
        if (freightType && !['flight', 'ocean', 'road'].includes(freightType)) {
            return res.status(400).json({
                error: 'Invalid freight type. Must be "flight", "ocean", or "road"'
            });
        }

        // Calculate shipping cost using V2 function
        const result = calculateShippingCostV2({
            fromCity,
            toCity,
            actualWeight: parseFloat(actualWeight),
            dimensions: {
                length: parseFloat(dimensions.length),
                width: parseFloat(dimensions.width),
                height: parseFloat(dimensions.height)
            },
            express: express === true,
            insurance: insurance === true,
            freightType: freightType || 'road'
        });

        console.log('Shipping calculation V2 result:', result);

        res.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Error calculating shipping cost V2:', error);
        res.status(400).json({
            error: 'Shipping calculation failed',
            details: error.message
        });
    }
});

// Endpoint to get calculation form data and calculate shipping with cart dimensions
app.post('/api/calculate-with-cart', async (req, res) => {
    try {
        const { cartItems } = req.body;

        console.log('Calculate with cart request:', { cartItems });

        // Get calculation form data from localStorage (frontend will send this)
        const calculationData = req.body.calculationData;
        
        if (!calculationData) {
            return res.status(400).json({
                error: 'Calculation form data is required'
            });
        }

        // Aggregate dimensions from cart items
        let totalWeight = 0;
        let maxLength = 0, maxWidth = 0, maxHeight = 0;

        if (cartItems && cartItems.length > 0) {
            cartItems.forEach(item => {
                // Add weight - handle weight ranges like "2-6kg"
                let itemWeight = 0;
                if (item.weight) {
                    if (typeof item.weight === 'string') {
                        // Handle weight ranges like "2-6kg" or "5kg"
                        const weightMatch = item.weight.match(/(\d+)(?:\s*-\s*(\d+))?\s*kg?/i);
                        if (weightMatch) {
                            const minWeight = parseFloat(weightMatch[1]) || 0;
                            const maxWeight = parseFloat(weightMatch[2]) || minWeight;
                            itemWeight = Math.max(minWeight, maxWeight); // Use the higher weight
                        } else {
                            itemWeight = parseFloat(item.weight) || 0;
                        }
                    } else {
                        itemWeight = Number(item.weight) || 0;
                    }
                }
                totalWeight += itemWeight * (item.qty || 1);
                
                // Parse dimensions from item
                if (item.dimensions) {
                    let dims = [];
                    if (typeof item.dimensions === 'string') {
                        dims = item.dimensions.match(/\d+/g) || [];
                    }
                    if (dims.length === 3) {
                        const l = parseFloat(dims[0]) || 0;
                        const w = parseFloat(dims[1]) || 0;
                        const h = parseFloat(dims[2]) || 0;
                        maxLength = Math.max(maxLength, l);
                        maxWidth = Math.max(maxWidth, w);
                        maxHeight = Math.max(maxHeight, h);
                    }
                }
            });
        }

        // Use calculation form data for cities and options
        // Ensure we have minimum values
        if (totalWeight <= 0) {
            totalWeight = 1; // Minimum 1kg
        }
        if (maxLength <= 0) maxLength = 10; // Minimum 10cm
        if (maxWidth <= 0) maxWidth = 10;   // Minimum 10cm
        if (maxHeight <= 0) maxHeight = 10;  // Minimum 10cm

        const result = calculateShippingCostV2({
            fromCity: calculationData.departureCity,
            toCity: calculationData.deliverCity,
            actualWeight: totalWeight,
            dimensions: {
                length: maxLength,
                width: maxWidth,
                height: maxHeight
            },
            express: calculationData.deliveryOption === 'express',
            insurance: calculationData.insurance === 'yes',
            freightType: calculationData.freightType === 'air' ? 'flight' : calculationData.freightType
        });

        console.log('Calculate with cart result:', result);

        res.json({
            success: true,
            cartSummary: {
                totalWeight,
                dimensions: { length: maxLength, width: maxWidth, height: maxHeight },
                itemCount: cartItems ? cartItems.length : 0
            },
            ...result
        });

    } catch (error) {
        console.error('Error calculating with cart:', error);
        res.status(400).json({
            error: 'Calculation failed',
            details: error.message
        });
    }
});

// Endpoint to save a completed order
app.post('/api/save-order', async (req, res) => {
    console.log("Received request to save order. Body:", JSON.stringify(req.body, null, 2));
    try {
        const { orderId, paymentId, cartItems, sender, receiver, shippingCost, estimatedPickup, estimatedDeliveryStart, estimatedDeliveryEnd, grandTotal, subtotal, departureCity, deliverCity, weight, freightType } = req.body;

        // Basic validation
        if (!paymentId || !cartItems || !sender || !receiver || !grandTotal || !subtotal) {
            console.error("Order save failed: Missing required fields.");
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Check if order already exists based on paymentId for idempotency
        const existingOrder = await Order.findOne({ paymentId });
        if (existingOrder) {
            console.log("Idempotency check: Order with this paymentId already exists. Returning existing order.");
            return res.status(200).json({ message: 'Order already exists.', order: existingOrder });
        }

        const newOrder = new Order({
            orderId,
            paymentId,
            cartItems,
            sender,
            receiver,
            shippingCost,
            estimatedPickup,
            estimatedDeliveryStart,
            estimatedDeliveryEnd,
            grandTotal,
            subtotal,
            departureCity,
            deliverCity,
            weight,
            freightType
        });

        await newOrder.save();
        console.log("Order successfully saved to database. Order ID:", newOrder.orderId);
        res.status(201).json({ message: 'Order saved successfully.', order: newOrder });

    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ error: 'Failed to save order.' });
    }
});

// Admin endpoints
app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders.' });
    }
});

app.get('/api/admin/users', async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.json(allUsers);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Endpoint to update order status
app.put('/api/admin/orders/:orderId/status', async (req, res) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Server error');
    }
});

// Public endpoint for tracking an order
app.get('/api/track', async (req, res) => {
    const { orderId, senderName } = req.query;

    if (!orderId || !senderName) {
        return res.status(400).json({ message: 'Order ID and Sender Name are required.' });
    }

    try {
        const order = await Order.findOne({ 
            orderId: orderId,
            'sender.name': { $regex: new RegExp(`^${senderName}$`, 'i') } 
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found. Please check your details and try again.' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order for tracking:', error);
        res.status(500).json({ message: 'Server error while trying to track order.' });
    }
});

// Endpoints for Delivery Agent App
app.get('/api/delivery/pickup', async (req, res) => {
    try {
        const orders = await Order.find({ status: 'Confirmed' }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders for pickup:', error);
        res.status(500).json({ message: 'Server error while fetching orders for pickup.' });
    }
});

app.get('/api/delivery/deliver', async (req, res) => {
    try {
        const orders = await Order.find({ status: 'Out for delivery' }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders for delivery:', error);
        res.status(500).json({ message: 'Server error while fetching orders for delivery.' });
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    try {
        const newMessage = new ContactMessage({ name, email, subject, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

// Get all contact messages
app.get('/api/contact-messages', async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ error: 'Failed to fetch contact messages.' });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the Transfar Logistics API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 