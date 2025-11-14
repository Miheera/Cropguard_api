# 🤖 PyTorch MobileViT Model Integration Guide

## 📋 Your Tech Stack
- **Framework**: PyTorch
- **Model**: MobileViT
- **Integration**: Python service → Node.js backend

---

## 🔄 How Data Gets Updated - Complete Flow

### Step-by-Step Data Flow

```
1. User uploads image in app
   ↓
2. Frontend sends image to backend API
   ↓
3. Backend receives image (req.file.buffer)
   ↓
4. Backend calls ML model (your PyTorch MobileViT)
   ↓
5. ML model returns prediction
   ↓
6. Backend saves to MongoDB database
   ↓
7. Backend sends result back to frontend
   ↓
8. Frontend displays result to user
```

### Detailed Flow with Code Locations

#### 1. **User Uploads Image** (Frontend)
**File**: `CropGuardAI-Project-main/src/pages/Home.tsx`
- User clicks "Capture Photo" or "Upload from Gallery"
- Image is selected/captured
- Navigation to Result page with `imageUri`

#### 2. **Frontend Sends to Backend** (API Call)
**File**: `CropGuardAI-Project-main/src/pages/Result.tsx` (Lines 33-45)
```typescript
// Creates FormData with image
const formData = new FormData();
formData.append('image', { uri: imageUri, name: filename, type } as any);

// Calls backend API
const response = await detectDisease(formData);
```

**File**: `CropGuardAI-Project-main/src/lib/api.ts` (Line 61-68)
```typescript
export const detectDisease = (formData: FormData) => {
  return apiClient.post('/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
```

#### 3. **Backend Receives Request** (Route)
**File**: `CropGuard-Backend/routes/detectionRoutes.js` (Line 15)
```javascript
router.post('/', protect, upload, detectDisease);
```
- `protect` - Checks if user is logged in
- `upload` - Handles file upload (saves to `req.file.buffer`)
- `detectDisease` - Main controller function

#### 4. **Backend Processes Image** (Controller)
**File**: `CropGuard-Backend/controllers/detectionController.js` (Lines 29-58)

**Current Flow**:
```javascript
const detectDisease = async (req, res) => {
  // 1. Get uploaded image
  const imageBuffer = req.file.buffer;  // ← Image data here
  
  // 2. Run ML analysis (CURRENTLY DUMMY)
  const analysisResult = await runDummyAIAnalysis(imageBuffer);
  
  // 3. Save to database
  const detectionEntry = await Detection.create({
    user: req.user._id,
    image: req.file.originalname,
    cropType: analysisResult.cropType,
    disease: analysisResult.disease,
    confidence: analysisResult.confidence,
    recommendations: analysisResult.recommendations,
  });
  
  // 4. Send response back
  res.status(200).json(detectionEntry);
};
```

#### 5. **Data Saved to MongoDB** (Database)
**File**: `CropGuard-Backend/models/Detection.js`

**What Gets Saved**:
```javascript
{
  _id: ObjectId("..."),
  user: ObjectId("user_id"),           // Links to User collection
  image: "image_name.jpg",
  cropType: "Tomato",                  // From ML model
  disease: "Leaf Blight",               // From ML model
  confidence: 0.92,                    // From ML model
  recommendations: {
    organic: "Apply neem oil...",      // From ML model or lookup
    chemical: "Use fungicide...",       // From ML model or lookup
    preventive: "Ensure good air..."    // From ML model or lookup
  },
  createdAt: "2024-01-15T10:30:00Z",   // Auto-added
  updatedAt: "2024-01-15T10:30:00Z"    // Auto-added
}
```

#### 6. **Response Sent to Frontend**
**File**: `CropGuardAI-Project-main/src/pages/Result.tsx` (Lines 45-69)
```typescript
// Backend response
const backendResult = response.data;

// Transform to frontend format
const frontendResult = {
  crop: backendResult.cropType,
  disease: backendResult.disease,
  confidence: Math.round(backendResult.confidence * 100),
  treatments: {
    organic: [backendResult.recommendations.organic],
    chemical: [backendResult.recommendations.chemical],
    preventive: [backendResult.recommendations.preventive],
  },
};

// Save to local history store
addDetection({
  ...frontendResult,
  imageUrl: imageUri,
});
```

---

## 🔍 How to View Data Updates

### Method 1: MongoDB Compass (Real-time View)

1. **Download**: https://www.mongodb.com/try/download/compass
2. **Connect**: Use your `MONGO_URI` from `.env`
3. **View Collections**:
   - Click on `cropguard` database
   - Click on `detections` collection
   - See all detection records in real-time

**What You'll See**:
```
detections Collection
├── Document 1
│   ├── _id: ObjectId("...")
│   ├── user: ObjectId("...")
│   ├── cropType: "Tomato"
│   ├── disease: "Leaf Blight"
│   ├── confidence: 0.92
│   └── createdAt: 2024-01-15 10:30:00
├── Document 2
│   └── ...
```

### Method 2: Backend Console Logs

**Add logging** (when you're ready):
```javascript
// In detectionController.js
console.log('New detection saved:', detectionEntry);
console.log('Database ID:', detectionEntry._id);
```

### Method 3: Frontend History Tab

**File**: `CropGuardAI-Project-main/src/pages/History.tsx`
- Shows all detections from local store
- Gets data from `useHistoryStore()`
- Updates when new detection is added

### Method 4: API Endpoint (Get History)

**Endpoint**: `GET /api/detect`
**File**: `CropGuard-Backend/controllers/detectionController.js` (Lines 62-75)

Returns all detections for logged-in user:
```javascript
const getDetectionHistory = async (req, res) => {
  const detections = await Detection.find({ user: req.user._id })
    .sort({ createdAt: -1 }); // Newest first
  res.status(200).json(detections);
};
```

---

## 🤖 PyTorch MobileViT Integration Plan

### Where Your Model Will Go

**File**: `CropGuard-Backend/controllers/detectionController.js`

**Function to Replace**: `runDummyAIAnalysis()` (Lines 3-25)

### Integration Architecture

```
Node.js Backend (detectionController.js)
    ↓
    Calls Python Service (via HTTP)
    ↓
Python Service (Flask/FastAPI)
    ↓
Loads PyTorch MobileViT Model
    ↓
Processes Image
    ↓
Returns Prediction
    ↓
Back to Node.js
    ↓
Saves to MongoDB
```

### Step 1: Create Python Service

**Create**: `CropGuard-Backend/ml_service/app.py`

```python
from flask import Flask, request, jsonify
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import numpy as np

app = Flask(__name__)

# Load your MobileViT model
model = torch.load('path/to/your/mobilevit_model.pth')
model.eval()

# Image preprocessing (adjust based on your model)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                        std=[0.229, 0.224, 0.225])
])

# Class names (adjust based on your model)
CLASS_NAMES = [
    'Tomato_Leaf_Blight',
    'Tomato_Healthy',
    'Rice_Leaf_Blast',
    'Rice_Healthy',
    # ... add all your classes
]

def get_recommendations(crop_type, disease):
    """Get treatment recommendations based on crop and disease"""
    # You can create a lookup dictionary or use a database
    recommendations = {
        'Tomato_Leaf_Blight': {
            'organic': 'Apply neem oil spray weekly.',
            'chemical': 'Use a copper-based fungicide.',
            'preventive': 'Ensure good air circulation and water at the base.'
        },
        # ... add more
    }
    return recommendations.get(f'{crop_type}_{disease}', {
        'organic': 'Consult agricultural expert.',
        'chemical': 'Consult agricultural expert.',
        'preventive': 'Maintain proper crop hygiene.'
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image from request
        image_file = request.files['image']
        image_bytes = image_file.read()
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Preprocess
        image_tensor = transform(image).unsqueeze(0)
        
        # Predict
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted_idx = torch.max(probabilities, 0)
            
        # Get class name
        predicted_class = CLASS_NAMES[predicted_idx.item()]
        crop_type, disease = predicted_class.split('_', 1)
        
        # Get recommendations
        recommendations = get_recommendations(crop_type, disease)
        
        # Return result
        return jsonify({
            'cropType': crop_type,
            'disease': disease,
            'confidence': confidence.item(),
            'recommendations': recommendations
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
```

### Step 2: Update Node.js Controller

**File**: `CropGuard-Backend/controllers/detectionController.js`

**Replace** `runDummyAIAnalysis()` function:

```javascript
const axios = require('axios');
const FormData = require('form-data');

const runDummyAIAnalysis = async (imageBuffer) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
    });
    
    // Call Python ML service
    const response = await axios.post('http://localhost:5001/predict', formData, {
      headers: formData.getHeaders(),
      timeout: 30000 // 30 seconds
    });
    
    // Return result in expected format
    return {
      cropType: response.data.cropType,
      disease: response.data.disease,
      confidence: response.data.confidence,
      recommendations: response.data.recommendations
    };
    
  } catch (error) {
    console.error('ML Service Error:', error.message);
    
    // Fallback to dummy result if ML service fails
    return {
      cropType: 'Unknown',
      disease: 'Unable to detect',
      confidence: 0.0,
      recommendations: {
        organic: 'Please try again or consult an expert.',
        chemical: 'Please try again or consult an expert.',
        preventive: 'Please try again or consult an expert.'
      }
    };
  }
};
```

### Step 3: Install Python Dependencies

**Create**: `CropGuard-Backend/ml_service/requirements.txt`

```txt
flask==2.3.0
torch==2.0.0
torchvision==0.15.0
Pillow==10.0.0
numpy==1.24.0
```

**Install**:
```bash
cd CropGuard-Backend/ml_service
pip install -r requirements.txt
```

### Step 4: Run Python Service

```bash
cd CropGuard-Backend/ml_service
python app.py
```

**Should see**:
```
 * Running on http://0.0.0.0:5001
```

---

## 📊 Data Update Flow Diagram

```
┌─────────────────┐
│  Mobile App     │
│  (React Native) │
└────────┬────────┘
         │ 1. User uploads image
         │    POST /api/detect
         │    FormData: { image: file }
         ↓
┌─────────────────┐
│  Node.js API    │
│  (Express)      │
│  Port: 5000     │
└────────┬────────┘
         │ 2. Receives image
         │    req.file.buffer
         │
         │ 3. Calls Python service
         │    POST http://localhost:5001/predict
         ↓
┌─────────────────┐
│  Python Service │
│  (Flask)        │
│  Port: 5001     │
└────────┬────────┘
         │ 4. Loads MobileViT model
         │ 5. Processes image
         │ 6. Returns prediction
         │    { cropType, disease, confidence }
         ↓
┌─────────────────┐
│  Node.js API    │
│  (Express)      │
└────────┬────────┘
         │ 7. Saves to MongoDB
         │    Detection.create({ ... })
         ↓
┌─────────────────┐
│  MongoDB        │
│  Database       │
│  Collection:    │
│  detections     │
└─────────────────┘
         │ 8. Returns saved data
         ↓
┌─────────────────┐
│  Mobile App     │
│  (React Native) │
│  Shows result   │
└─────────────────┘
```

---

## 🔍 How to Monitor Data Updates

### Real-time Monitoring

1. **MongoDB Compass**:
   - Open Compass
   - Connect to database
   - Click "Refresh" to see new documents
   - Documents appear immediately after save

2. **Backend Console**:
   - Watch for: `MongoDB Connected: ...`
   - Watch for: `New detection saved: ...`

3. **Frontend Console**:
   - Open React Native debugger
   - See API calls and responses
   - Check network tab

### Testing Data Flow

1. **Upload image** from app
2. **Check backend console** - Should see processing
3. **Check MongoDB Compass** - New document should appear
4. **Check frontend** - Result should display
5. **Check History tab** - New entry should appear

---

## 📝 Summary

### Data Update Locations

1. **Input**: User uploads image → `Home.tsx`
2. **API Call**: Frontend → Backend → `api.ts` → `detectionController.js`
3. **ML Processing**: `detectionController.js` → Python service → MobileViT model
4. **Database Save**: `detectionController.js` → MongoDB → `detections` collection
5. **Response**: Backend → Frontend → `Result.tsx` → Display to user

### Where to View Data

- **MongoDB Compass**: See all saved detections
- **History Tab**: See detections in app
- **Backend Console**: See processing logs
- **API Response**: See data structure

### Integration Points

- **ML Model**: Replace `runDummyAIAnalysis()` in `detectionController.js`
- **Python Service**: Create `ml_service/app.py`
- **Model File**: Place your `.pth` file in `ml_service/` folder
- **No other changes needed** - Everything else is already set up!

---

## ⚠️ Important Notes

- **No code changes made** - This is just a guide
- **Your model format**: Make sure your MobileViT model is saved as `.pth` or `.pt`
- **Class names**: Update `CLASS_NAMES` array to match your model's output
- **Image preprocessing**: Adjust `transform` to match your training preprocessing
- **Port**: Python service runs on port 5001 (Node.js on 5000)

When you're ready to integrate, I can help you with the actual code changes!

