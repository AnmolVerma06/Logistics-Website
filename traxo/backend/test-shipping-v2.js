// Test file for the new shipping calculation function
// This demonstrates the pure JavaScript function that calculates shipping cost

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

    // 1. Calculate volumetric weight
    const volumetricWeight = (dimensions.length * dimensions.width * dimensions.height) / 5000;

    // 2. Determine chargeable weight
    const chargeableWeight = Math.max(actualWeight, volumetricWeight);

    // 3. Calculate distance using Haversine formula
    const fromCoords = cityCoordinates[fromCity];
    const toCoords = cityCoordinates[toCity];
    const distanceKm = calculateHaversineDistance(
        fromCoords.lat, fromCoords.lon,
        toCoords.lat, toCoords.lon
    );

    // 4. Determine base rate per kg based on distance
    let ratePerKg = 30; // Default for < 500 km
    if (distanceKm >= 500 && distanceKm <= 1000) {
        ratePerKg = 40;
    } else if (distanceKm > 1000) {
        ratePerKg = 50;
    }

    // 5. If express = true, add ₹15/kg to base rate
    if (express === true) {
        ratePerKg += 15;
    }

    // 6. Base shipping cost
    const baseCost = chargeableWeight * ratePerKg;

    // Apply add-on charges
    const addOns = {
        insurance: insurance === true ? 100 : 0,
        expressCharge: (express === true && express !== 'standard') ? 200 : 0,
        freightCharge: 0
    };

    // Freight type charges
    if (freightType === 'flight') {
        addOns.freightCharge = 2000;
    } else if (freightType === 'ocean') {
        addOns.freightCharge = 500;
    } else if (freightType === 'road') {
        addOns.freightCharge = 0;
    }

    // Calculate subtotal
    const subtotal = baseCost + addOns.insurance + addOns.expressCharge + addOns.freightCharge;

    // Calculate GST (18%)
    const gst = subtotal * 0.18;

    // Calculate total cost
    const totalCost = subtotal + gst;

    return {
        fromCity,
        toCity,
        actualWeight,
        volumetricWeight: parseFloat(volumetricWeight.toFixed(2)),
        chargeableWeight: parseFloat(chargeableWeight.toFixed(2)),
        distanceKm: parseFloat(distanceKm.toFixed(2)),
        ratePerKg,
        baseCost: parseFloat(baseCost.toFixed(2)),
        addOns,
        subtotal: parseFloat(subtotal.toFixed(2)),
        gst: parseFloat(gst.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2))
    };
};

// Test the function with the example provided
console.log('=== Shipping Cost Calculation Test ===\n');

const testInput = {
    "fromCity": "Kanpur",
    "toCity": "Udaipur",
    "actualWeight": 4,
    "dimensions": { "length": 60, "width": 40, "height": 30 },
    "express": true,
    "insurance": true,
    "freightType": "flight"
};

console.log('📥 Input:');
console.log(JSON.stringify(testInput, null, 2));

console.log('\n📤 Output:');
const result = calculateShippingCostV2(testInput);
console.log(JSON.stringify(result, null, 2));

console.log('\n📊 Calculation Breakdown:');
console.log(`1. Volumetric Weight: ${result.volumetricWeight} kg`);
console.log(`2. Chargeable Weight: ${result.chargeableWeight} kg (max of actual and volumetric)`);
console.log(`3. Distance: ${result.distanceKm} km (Haversine calculation)`);
console.log(`4. Base Rate: ₹${result.ratePerKg}/kg`);
console.log(`5. Base Cost: ₹${result.baseCost}`);
console.log(`6. Add-ons:`);
console.log(`   - Insurance: ₹${result.addOns.insurance}`);
console.log(`   - Express Charge: ₹${result.addOns.expressCharge}`);
console.log(`   - Freight Charge: ₹${result.addOns.freightCharge}`);
console.log(`7. Subtotal: ₹${result.subtotal}`);
console.log(`8. GST (18%): ₹${result.gst}`);
console.log(`9. Total Cost: ₹${result.totalCost}`);

// Test with different cities
console.log('\n=== Additional Tests ===\n');

const testCases = [
    {
        name: "Mumbai to Delhi (Road, Standard, No Insurance)",
        input: {
            fromCity: "Mumbai",
            toCity: "Delhi",
            actualWeight: 10,
            dimensions: { length: 50, width: 30, height: 20 },
            express: false,
            insurance: false,
            freightType: "road"
        }
    },
    {
        name: "Bangalore to Kolkata (Ocean, Express, Insurance)",
        input: {
            fromCity: "Bangalore",
            toCity: "Kolkata",
            actualWeight: 25,
            dimensions: { length: 80, width: 60, height: 40 },
            express: true,
            insurance: true,
            freightType: "ocean"
        }
    }
];

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    const testResult = calculateShippingCostV2(testCase.input);
    console.log(`Total Cost: ₹${testResult.totalCost}`);
    console.log(`Distance: ${testResult.distanceKm} km`);
    console.log(`Chargeable Weight: ${testResult.chargeableWeight} kg`);
    console.log('---');
});

console.log('\n✅ All tests completed successfully!'); 