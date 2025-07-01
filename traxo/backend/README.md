# Transfar Backend Server

This is the backend server for the Transfar transport logistics application.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Distance Matrix API**
4. Create credentials (API Key)
5. Copy your API key

### 3. Configure Environment Variables
1. Copy `env.example` to `.env`
2. Replace `your_google_api_key_here` with your actual Google API key

```bash
cp env.example .env
# Then edit .env and add your API key
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST /api/calculate-distance
Calculate distance and price between two cities.

**Request Body:**
```json
{
  "origin": "Mumbai, India",
  "destination": "Delhi, India"
}
```

**Response:**
```json
{
  "success": true,
  "distance": 1150.5,
  "price": 5752.5,
  "origin": "Mumbai, India",
  "destination": "Delhi, India"
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Backend server is running"
}
```

## Error Handling
The API returns appropriate error messages for:
- Missing origin/destination
- Invalid API key
- Network errors
- Google API errors 