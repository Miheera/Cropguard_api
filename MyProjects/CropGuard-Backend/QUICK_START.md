# ⚡ Quick Start Guide

## 🗄️ Database Setup (5 minutes)

### Step 1: Choose Your Database

**Option A: MongoDB Atlas (Cloud - Easiest)**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create cluster (free tier)
4. Get connection string

**Option B: Local MongoDB**
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service

### Step 2: Create `.env` File

Create file: `CropGuard-Backend/.env`

**For Local MongoDB**:
```env
MONGO_URI=mongodb://localhost:27017/cropguard
PORT=5000
JWT_SECRET=my_secret_key_12345
```

**For MongoDB Atlas**:
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cropguard?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=my_secret_key_12345
```

### Step 3: View Your Database

**Download MongoDB Compass**: https://www.mongodb.com/try/download/compass

**Connect**:
- Local: `mongodb://localhost:27017`
- Atlas: Use connection string from Atlas

**View Collections**:
- `users` - All user accounts
- `detections` - All disease detections
- `issuereports` - Issue reports
- `helprequests` - Help requests

---

## 🔌 API Testing (Optional)

### You DON'T Need Postman
- ✅ Your app already uses the API
- ✅ Everything is integrated

### But Postman is Useful For:
- Testing endpoints manually
- Debugging issues
- Checking if backend works

### Quick Postman Test

**1. Test Backend is Running**:
```
GET http://10.10.1.195:5000/
Should return: "CropGuard AI Backend is running..."
```

**2. Test Login**:
```
POST http://10.10.1.195:5000/api/auth/login
Body (JSON):
{
  "name": "testuser",
  "password": "testpass"
}
```

**3. Test Detection** (Need auth token):
```
POST http://10.10.1.195:5000/api/detect
Headers:
  Authorization: Bearer YOUR_TOKEN
Body (form-data):
  image: [select file]
```

---

## 🤖 ML Model Integration (The Important Part!)

### 📍 Exact Location

**File**: `CropGuard-Backend/controllers/detectionController.js`

**Lines 3-25**: Replace this function:
```javascript
const runDummyAIAnalysis = (imageBuffer) => {
  // ⬇️ REPLACE THIS ENTIRE FUNCTION ⬇️
  // Current: Returns dummy data
  // Future: Call your ML model here
}
```

### 🎯 What You Need to Do

**Your ML model should:**
1. **Input**: `imageBuffer` (the uploaded image)
2. **Process**: Run your ML model on the image
3. **Output**: Return this format:
```javascript
{
  cropType: 'Tomato',        // e.g., 'Tomato', 'Rice', 'Wheat'
  disease: 'Leaf Blight',    // e.g., 'Leaf Blight', 'Rust', 'Healthy'
  confidence: 0.92,          // 0.0 to 1.0 (92% confidence)
  recommendations: {
    organic: 'Apply neem oil...',
    chemical: 'Use fungicide...',
    preventive: 'Ensure good air...'
  }
}
```

### 🔧 Integration Methods

#### Method 1: Python Service (Recommended)
```javascript
// In detectionController.js
const axios = require('axios');

const runDummyAIAnalysis = async (imageBuffer) => {
  // Send to Python ML service
  const formData = new FormData();
  formData.append('image', imageBuffer);
  
  const response = await axios.post('http://localhost:5001/predict', formData);
  return response.data;
};
```

**Python Service** (`ml_service/server.py`):
```python
from flask import Flask, request, jsonify
import your_ml_model

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    image = request.files['image']
    result = your_ml_model.predict(image)
    return jsonify(result)
```

#### Method 2: Direct Integration (TensorFlow.js)
```javascript
const tf = require('@tensorflow/tfjs-node');

const runDummyAIAnalysis = async (imageBuffer) => {
  const model = await tf.loadLayersModel('file://./model/model.json');
  // Process image and predict
  const prediction = model.predict(processedImage);
  return formatResult(prediction);
};
```

#### Method 3: External API
```javascript
const runDummyAIAnalysis = async (imageBuffer) => {
  const response = await axios.post('https://your-ml-api.com/predict', {
    image: imageBuffer.toString('base64')
  });
  return response.data;
};
```

### ✅ After Integration

1. **Test**: Upload image from app
2. **Check**: Results should come from your ML model
3. **Verify**: Check database - detections should be saved
4. **View**: Use MongoDB Compass to see saved detections

---

## 📊 Summary

### Database
- **Type**: MongoDB
- **View**: MongoDB Compass
- **Location**: `.env` file → `MONGO_URI`
- **Collections**: users, detections, issuereports, helprequests

### API
- **Already Integrated**: ✅ Yes, in `src/lib/api.ts`
- **Postman**: Optional
- **Base URL**: `http://10.10.1.195:5000/api`

### ML Model
- **File**: `controllers/detectionController.js`
- **Function**: `runDummyAIAnalysis()` (lines 3-25)
- **Input**: `imageBuffer`
- **Output**: Object with cropType, disease, confidence, recommendations
- **Method**: Python service (recommended) or direct integration

---

## 🚀 Next Steps

1. ✅ Set up MongoDB (create `.env` file)
2. ✅ Install MongoDB Compass (to view database)
3. ✅ Test API (optional - use Postman)
4. ⚠️ **Integrate ML Model** (replace `runDummyAIAnalysis()`)
5. ✅ Test with real images

**The ML model integration is the only thing left to do!**

