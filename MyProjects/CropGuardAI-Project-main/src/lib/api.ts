import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// =================================================================
// 1. --- !! IMPORTANT !! ---
//    Replace with your computer's IP address from Step 7.1
//
//const YOUR_COMPUTER_IP = 'localhost'; // <-- USE THIS FOR WEB ON COMPUTER
const YOUR_COMPUTER_IP = '10.10.1.195'; // <-- USE THIS FOR MOBILE
// =================================================================
const API_BASE_URL = `http://${'10.10.1.195'}:5000/api`;




// 1. Create a central API client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});


// 2. Use an "interceptor" to automatically add the auth token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    // Get the token from storage
    const token = await AsyncStorage.getItem('userToken'); // We will save this in authStore
   
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - Backend may be slow or unreachable');
    } else if (error.message === 'Network Error') {
      console.error('Network error - Check if backend is running and IP address is correct');
    } else if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);


// 4. Define all our NEW API functions (WITH TYPES)
export const registerUser = (name: string, password: string) => {
  return apiClient.post('/auth/register', { name, password });
};


export const loginUser = (name: string, password: string) => {
  return apiClient.post('/auth/login', { name, password });
};


export const getDetectionHistory = () => {
  return apiClient.get('/detect');
};


export const detectDisease = (formData: FormData) => {
  return apiClient.post('/detect', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 60 seconds for image upload
  });
};


export const submitIssue = (title: string, description: string) => {
  return apiClient.post('/support/issue', { title, description });
};


export const submitHelpRequest = (title: string, description: string) => {
  return apiClient.post('/support/help', { title, description });
};




// =================================================================
// --- YOUR ORIGINAL MOCK FUNCTIONS ---
// We keep these so your app doesn't break
// =================================================================


const mockDiseases = [
  {
    crop: 'Rice',
    disease: 'Leaf Blast',
    confidence: 92,
    treatments: {
      organic: ['Use neem oil spray', 'Apply Trichoderma viride', 'Improve drainage'],
      chemical: ['Apply Tricyclazole fungicide', 'Use Carbendazim', 'Spray Mancozeb'],
      preventive: ['Use resistant varieties', 'Maintain proper spacing', 'Avoid excess nitrogen'],
    },
  },
  {
    crop: 'Wheat',
    disease: 'Rust',
    confidence: 87,
    treatments: {
      organic: ['Use sulfur dust', 'Apply garlic extract', 'Improve air circulation'],
      chemical: ['Apply Propiconazole', 'Use Tebuconazole', 'Spray Azoxystrobin'],
      preventive: ['Plant resistant varieties', 'Remove infected plants', 'Crop rotation'],
    },
  },
  {
    crop: 'Tomato',
    disease: 'Late Blight',
    confidence: 95,
    treatments: {
      organic: ['Use copper spray', 'Apply Bacillus subtilis', 'Neem oil treatment'],
      chemical: ['Apply Chlorothalonil', 'Use Metalaxyl', 'Spray Mancozeb'],
      preventive: ['Avoid overhead watering', 'Improve ventilation', 'Remove infected leaves'],
    },
  },
  {
    crop: 'Cotton',
    disease: 'Bacterial Blight',
    confidence: 89,
    treatments: {
      organic: ['Use copper-based sprays', 'Apply compost tea', 'Neem cake application'],
      chemical: ['Apply Streptocycline', 'Use Copper oxychloride', 'Spray Validamycin'],
      preventive: ['Use disease-free seeds', 'Crop rotation', 'Maintain field hygiene'],
    },
  },
];


export const predictDisease = async (imageUri: string): Promise<{
  crop: string;
  disease: string;
  confidence: number;
  treatments: {
    organic: string[];
    chemical: string[];
    preventive: string[];
  };
}> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));


  // Return random mock disease
  const result = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
 
  return result;
};


export const sendSMSAlert = async (phoneNumber: string, message: string): Promise<boolean> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`SMS sent to ${phoneNumber}: ${message}`);
  return true;
};

