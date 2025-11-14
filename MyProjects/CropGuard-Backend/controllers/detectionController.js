const Detection = require('../models/Detection');

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
      preventive: 'Ensure good air circulation and water at the base of the plant.',
    },
  };

  // We simulate a 1-second delay to make it feel real
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyResult);
    }, 1000); // 1-second delay
  });
};


// --- Main Controller Function ---
const detectDisease = async (req, res) => {
  try {
    // 1. Check if an image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // 'req.user' is available because of our 'protect' middleware
    const user = req.user;

    // 2. Run the "dummy" AI analysis
    const analysisResult = await runDummyAIAnalysis(req.file.buffer);

    // 3. Save the result to the database to create a "History" entry
    const detectionEntry = await Detection.create({
      user: user._id,
      image: req.file.originalname, // Just save the name for now
      cropType: analysisResult.cropType,
      disease: analysisResult.disease,
      confidence: analysisResult.confidence,
      recommendations: analysisResult.recommendations,
    });

    // 4. Send the result back to the mobile app
    res.status(200).json(detectionEntry);

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- NEW FUNCTION ---
// --- Get Detection History ---
const getDetectionHistory = async (req, res) => {
  try {
    // 'req.user' is available because of our 'protect' middleware
    // We find all detections that match the logged-in user's ID
    const detections = await Detection.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    // Send the list of detections back to the app
    res.status(200).json(detections);

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Export both functions
module.exports = { detectDisease, getDetectionHistory };