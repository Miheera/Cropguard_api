# 🟢 CropGuard API – Crop & Disease Detection (MobileViT)

This repository contains a FastAPI-based inference API that uses a pipeline of **15 disease models + 1 crop classifier** based on **MobileViT-XXS**.

---

## 📌 Features

- Predict crop type using a trained MobileViT model  
- Automatically select the correct disease model based on the crop  
- Batch prediction endpoint  
- GPU & CPU compatible  
- Clean, simple FastAPI backend

---

## 🚀 How to Run Locally

### 1. Install Dependencies
pip install -r requirements.txt


### 2. Start FastAPI Server
uvicorn app:app --reload


Your API will run at:
http://127.0.0.1:8000


---

## 📌 API Endpoints

### **POST `/predict/`**
Upload a single image:

{
"crop": "Tomato",
"disease": "Tomato___Late_blight"
}


### **POST `/predict_batch/`**
Upload multiple images:


[
{"file": "img1.jpg", "crop": "Apple", "disease": "Apple___Black_rot"},
{"file": "img2.jpg", "crop": "Corn", "disease": "Corn_(maize)__Common_rust"}
]


---

## 📁 Model Files

Place `.pth` model weights in the project root:

mobilevit_Apple_epoch10.pth
mobilevit_Corn_epoch10.pth
mobilevit_crop_identifier_epoch10.pth
mobilevit_Grape_epoch10.pth
mobilevit_Guava_epoch10.pth
mobilevit_Lemon_epoch10.pth
mobilevit_Mango_epoch10.pth
mobilevit_Peach_epoch10.pth
mobilevit_Pepper_epoch10.pth
mobilevit_Pomegranate_epoch10.pth
mobilevit_Potato_epoch10.pth
mobilevit_Rice_epoch10.pth
mobilevit_Strawberry_epoch10.pth
mobilevit_Sugarcane_epoch10.pth
mobilevit_Tomato_epoch10.pth


---

## 🧠 NOTE: Model File Sizes

If any `.pth` files exceed **100MB**, you must use Git LFS:

git lfs install
git lfs track "*.pth"