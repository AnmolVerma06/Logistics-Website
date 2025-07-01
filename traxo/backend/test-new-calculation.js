// Test the new shipping calculation logic
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

// City coordinates for 25 major Indian cities
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
    
    // 6. Apply minimum base shipping of ₹300
    if (baseShippingCost < 300) {
        baseShippingCost = 300;
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
    const totalCost = subtotal + gst;

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

// Test cases
console.log('=== Testing New Shipping Calculation Logic ===\n');

// Test 1: Short distance (≤500 km)
console.log('Test 1: Delhi to Kanpur (short distance)');
const test1 = calculateShippingCostV2({
    fromCity: 'Delhi',
    toCity: 'Kanpur',
    actualWeight: 5,
    dimensions: { length: 30, width: 20, height: 15 },
    express: false,
    insurance: false,
    freightType: 'road'
});
console.log('Result:', JSON.stringify(test1, null, 2));
console.log('');

// Test 2: Medium distance (501-700 km)
console.log('Test 2: Mumbai to Bangalore (medium distance)');
const test2 = calculateShippingCostV2({
    fromCity: 'Mumbai',
    toCity: 'Bangalore',
    actualWeight: 10,
    dimensions: { length: 40, width: 30, height: 25 },
    express: true,
    insurance: true,
    freightType: 'road'
});
console.log('Result:', JSON.stringify(test2, null, 2));
console.log('');

// Test 3: Long distance (701-999 km)
console.log('Test 3: Delhi to Mumbai (long distance)');
const test3 = calculateShippingCostV2({
    fromCity: 'Delhi',
    toCity: 'Mumbai',
    actualWeight: 15,
    dimensions: { length: 50, width: 40, height: 30 },
    express: false,
    insurance: true,
    freightType: 'air'
});
console.log('Result:', JSON.stringify(test3, null, 2));
console.log('');

// Test 4: Very long distance (≥1000 km)
console.log('Test 4: Delhi to Thiruvananthapuram (very long distance)');
const test4 = calculateShippingCostV2({
    fromCity: 'Delhi',
    toCity: 'Thiruvananthapuram',
    actualWeight: 20,
    dimensions: { length: 60, width: 50, height: 40 },
    express: true,
    insurance: true,
    freightType: 'ocean'
});
console.log('Result:', JSON.stringify(test4, null, 2));
console.log('');

// Test 5: Minimum base shipping test
console.log('Test 5: Light package with minimum base shipping');
const test5 = calculateShippingCostV2({
    fromCity: 'Delhi',
    toCity: 'Kanpur',
    actualWeight: 0.5,
    dimensions: { length: 10, width: 10, height: 5 },
    express: false,
    insurance: false,
    freightType: 'road'
});
console.log('Result:', JSON.stringify(test5, null, 2));
console.log('');

console.log('=== All tests completed ==='); 