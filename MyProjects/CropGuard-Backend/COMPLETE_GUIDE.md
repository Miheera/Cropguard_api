# 📚 Complete Guide: Database, API, and ML Model Integration

## 🗄️ 1. DATABASE STORAGE

### What Database Are You Using?
**MongoDB** - A NoSQL database that stores data in JSON-like documents.

### Where is the Database Stored?

#### Option 1: MongoDB Atlas (Cloud - Recommended)
- **Location**: Stored in the cloud at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Free Tier**: Available (512MB storage)
- **Connection**: Via connection string in `.env` file

#### Option 2: Local MongoDB (On Your Computer)
- **Location**: Installed on your computer
- **Default Location**: 
  - Windows: `C:\Program Files\MongoDB\Server\[version]\data\`
  - Mac: `/usr/local/var/mongodb/`
- **Connection**: `mongodb://localhost:27017/cropguard`

### How to Set Up Database Connection

**Step 1: Create `.env` file** in `CropGuard-Backend/` folder:
```env
MONGO_URI=mongodb://localhost:27017/cropguard
PORT=5000
JWT_SECRET=your_secret_key_here
```

**OR for MongoDB Atlas (Cloud)**:
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cropguard?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_secret_key_here
```

**Step 2: Install MongoDB** (if using local):
- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud) - no installation needed

### Where Can You View the Database?

#### Option 1: MongoDB Compass (Recommended - GUI Tool)
1. **Download**: https://www.mongodb.com/try/download/compass
2. **Connect**: 
   - Local: `mongodb://localhost:27017`
   - Atlas: Use connection string from Atlas dashboard
3. **View Data**: 
   - Database: `cropguard`
   - Collections: `users`, `detections`, `issuereports`, `helprequests`

#### Option 2: MongoDB Atlas Web Interface
1. Go to: https://cloud.mongodb.com
2. Login to your account
3. Click "Browse Collections"
4. View all your data in the browser

#### Option 3: Command Line (mongosh)
```bash
mongosh
use cropguard
db.users.find()
db.detections.find()
```

### What Data is Stored?

**Collections in your database**:

1. **`users`** - User accounts
   ```json
   {
     "_id": "...",
     "name": "Farmer1",
     "password": "hashed_password",
     "createdAt": "2024-01-01",
     "updatedAt": "2024-01-01"
   }
   ```

2. **`detections`** - Disease detection history
   ```json
   {
     "_id": "...",
     "user": "user_id",
     "image": "image_name.jpg",
     "cropType": "Tomato",
     "disease": "Leaf Blight",
     "confidence": 0.92,
     "recommendations": {
       "organic": "Apply neem oil...",
       "chemical": "Use fungicide...",
       "preventive": "Ensure good air..."
     },
     "createdAt": "2024-01-01"
   }
   ```

3. **`issuereports`** - Issue reports from users
4. **`helprequests`** - Help requests from users

---

## 🔌 2. API USAGE

### How Are You Using the API?

Your app uses **REST API** with these endpoints:

#### API Base URL
```
http://10.10.1.195:5000/api
```

#### Available Endpoints

**1. Authentication** (`/api/auth`)
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user

**2. Disease Detection** (`/api/detect`)
- `POST /api/detect` - Upload image and detect disease
- `GET /api/detect` - Get detection history

**3. Support** (`/api/support`)
- `POST /api/support/issue` - Submit issue report
- `POST /api/support/help` - Request expert help

### Do You Need Postman?

**Short Answer: No, but it's helpful for testing!**

#### You DON'T Need Postman Because:
- ✅ Your React Native app already calls the API
- ✅ API is integrated in `src/lib/api.ts`
- ✅ Frontend automatically handles API calls

#### Postman is Useful For:
- 🧪 **Testing API endpoints** before integrating
- 🐛 **Debugging** API issues
- 📝 **Documenting** your API
- 🔍 **Checking** if backend is working

### How to Test API with Postman (Optional)

**1. Install Postman**: https://www.postman.com/downloads/

**2. Test Login Endpoint**:
```
POST http://10.10.1.195:5000/api/auth/login
Headers:
  Content-Type: application/json
Body (JSON):
{
  "name": "testuser",
  "password": "testpass"
}
```

**3. Test Detection Endpoint**:
```
POST http://10.10.1.195:5000/api/detect
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: multipart/form-data
Body (form-data):
  image: [select file]
```

### How Your App Uses the API

**File**: `src/lib/api.ts`

```typescript
// API client automatically adds auth token
const apiClient = axios.create({
  baseURL: 'http://10.10.1.195:5000/api',
});

// Example: Login
export const loginUser = (name: string, password: string) => {
  return apiClient.post('/auth/login', { name, password });
};

// Example: Detect Disease
export const detectDisease = (formData: FormData) => {
  return apiClient.post('/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
```

**Usage in App**:
```typescript
// In authStore.ts
await loginUser(name, password);

// In Result.tsx
const response = await detectDisease(formData);
```

---

## 🤖 3. ML MODEL INTEGRATION

### Where to Integrate the ML Model?

**File**: `CropGuard-Backend/controllers/detectionController.js`

**Current Code** (Lines 3-25):
```javascript
// This is our "dummy" AI analysis function
const runDummyAIAnalysis = (imageBuffer) => {
  // In a real app, you would send 'imageBuffer' to a real AI/LLM API
  
  // For now, we'll just return a hard-coded "dummy" result
  const dummyResult = {
    cropType: 'Tomato',
    disease: 'Leaf Blight',
    confidence: 0.92,
    recommendations: {
      organic: 'Apply neem oil spray weekly.',
      chemical: 'Use a copper-based fungicide.',
      preventive: 'Ensure good air circulation...',
    },
  };
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyResult), 1000);
  });
};
```

### Integration Options

#### Option 1: Python ML Model (Recommended)

**Step 1: Create Python Service**

Create `CropGuard-Backend/ml_service/predict.py`:
```python
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# Load your trained model
model = tf.keras.models.load_model('path/to/your/model.h5')

def predict_disease(image_bytes):
    # Preprocess image
    image = Image.open(io.BytesIO(image_bytes))
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    
    # Make prediction
    prediction = model.predict(image_array)
    
    # Get class names (adjust based on your model)
    classes = ['Tomato_Leaf_Blight', 'Tomato_Healthy', 'Rice_Leaf_Blast', ...]
    predicted_class = classes[np.argmax(prediction)]
    confidence = float(np.max(prediction))
    
    return {
        'cropType': predicted_class.split('_')[0],
        'disease': predicted_class.split('_')[1],
        'confidence': confidence
    }
```

**Step 2: Create API Endpoint for Python Service**

Create `CropGuard-Backend/ml_service/server.py`:
```python
from flask import Flask, request, jsonify
from predict import predict_disease

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    image_file = request.files['image']
    image_bytes = image_file.read()
    
    result = predict_disease(image_bytes)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5001)
```

**Step 3: Update Node.js Controller**

In `detectionController.js`, replace `runDummyAIAnalysis`:
```javascript
const axios = require('axios');

const runDummyAIAnalysis = async (imageBuffer) => {
  // Send image to Python ML service
  const formData = new FormData();
  formData.append('image', imageBuffer, 'image.jpg');
  
  try {
    const response = await axios.post('http://localhost:5001/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return {
      cropType: response.data.cropType,
      disease: response.data.disease,
      confidence: response.data.confidence,
      recommendations: {
        organic: getOrganicTreatment(response.data.disease),
        chemical: getChemicalTreatment(response.data.disease),
        preventive: getPreventiveTreatment(response.data.disease),
      },
    };
  } catch (error) {
    console.error('ML Service Error:', error);
    // Fallback to dummy result
    return getDummyResult();
  }
};
```

#### Option 2: External ML API (TensorFlow Serving, AWS SageMaker, etc.)

```javascript
const runDummyAIAnalysis = async (imageBuffer) => {
  // Convert image buffer to base64
  const base64Image = imageBuffer.toString('base64');
  
  // Call external ML API
  const response = await axios.post('https://your-ml-api.com/predict', {
    image: base64Image,
  });
  
  return {
    cropType: response.data.crop,
    disease: response.data.disease,
    confidence: response.data.confidence,
    recommendations: response.data.treatments,
  };
};
```

#### Option 3: TensorFlow.js (Run in Node.js)

```javascript
const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');

let model = null;

// Load model once
const loadModel = async () => {
  if (!model) {
    model = await tf.loadLayersModel('file://./models/crop-disease-model.json');
  }
  return model;
};

const runDummyAIAnalysis = async (imageBuffer) => {
  // Load model
  const loadedModel = await loadModel();
  
  // Preprocess image
  const image = sharp(imageBuffer);
  const resized = await image.resize(224, 224).toBuffer();
  const tensor = tf.node.decodeImage(resized);
  const normalized = tensor.div(255.0);
  const batched = normalized.expandDims(0);
  
  // Predict
  const prediction = loadedModel.predict(batched);
  const values = await prediction.data();
  
  // Get results
  const classes = ['Tomato_Leaf_Blight', 'Tomato_Healthy', ...];
  const maxIndex = values.indexOf(Math.max(...values));
  
  return {
    cropType: classes[maxIndex].split('_')[0],
    disease: classes[maxIndex].split('_')[1],
    confidence: values[maxIndex],
    recommendations: getRecommendations(classes[maxIndex]),
  };
};
```

### Exact Location to Replace

**File**: `CropGuard-Backend/controllers/detectionController.js`

**Replace this function** (Lines 3-25):
```javascript
const runDummyAIAnalysis = (imageBuffer) => {
  // REPLACE THIS ENTIRE FUNCTION with your ML model integration
}
```

**Keep this part** (Lines 29-58):
```javascript
const detectDisease = async (req, res) => {
  // This function calls runDummyAIAnalysis
  const analysisResult = await runDummyAIAnalysis(req.file.buffer);
  // ... rest of the code stays the same
}
```

### Do You Need API Call or Direct Integration?

**It Depends on Your ML Model**:

1. **Python Model (Separate Service)**: 
   - ✅ Use API call to Python service
   - ✅ Better separation of concerns
   - ✅ Can scale independently

2. **TensorFlow.js Model**:
   - ✅ Direct integration in Node.js
   - ✅ No separate service needed
   - ✅ Faster (no network call)

3. **External ML Service**:
   - ✅ Use API call
   - ✅ No need to host model yourself

### Recommended Approach

**For Most Cases**: Use **Option 1 (Python Service)** because:
- Most ML models are in Python
- Easy to update model without restarting Node.js
- Can use GPU if available
- Better for complex models

---

## 📋 Quick Reference

### Database
- **Type**: MongoDB
- **View**: MongoDB Compass or Atlas Web UI
- **Location**: Cloud (Atlas) or Local
- **Collections**: users, detections, issuereports, helprequests

### API
- **Type**: REST API
- **Base URL**: `http://10.10.1.195:5000/api`
- **Postman**: Optional but helpful
- **Integration**: Already done in `src/lib/api.ts`

### ML Model
- **File to Edit**: `controllers/detectionController.js`
- **Function to Replace**: `runDummyAIAnalysis()` (lines 3-25)
- **Recommended**: Python service with API call
- **Input**: `imageBuffer` (from `req.file.buffer`)
- **Output**: Object with `cropType`, `disease`, `confidence`, `recommendations`

---

## 🚀 Next Steps

1. **Set up MongoDB**: Create `.env` file with `MONGO_URI`
2. **Install MongoDB Compass**: To view your database
3. **Test API**: Use Postman (optional) or your app
4. **Integrate ML Model**: Replace `runDummyAIAnalysis()` function
5. **Test**: Upload image and verify ML predictions work

