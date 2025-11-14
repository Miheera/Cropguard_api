# 🔌 Backend Connection Guide

## ❌ Error: "Network request failed"

This error means the **backend server is not running** or **not accessible**.

## ✅ Solution Steps

### Step 1: Start the Backend Server

**Open a NEW terminal/PowerShell window** (keep the Expo server running in the other window):

```bash
cd CropGuard-Backend
npm start
```

**Expected Output**:
```
Server is running on http://0.0.0.0:5000
Access from mobile: http://10.10.1.195:5000 or http://192.168.1.7:5000
```

### Step 2: Verify Backend is Running

1. **Check the backend console** - Should show "Server is running..."
2. **Test in browser**: Open `http://localhost:5000/`
   - Should show: "CropGuard AI Backend is running..."
3. **Check Login page** - Should show "CropGuard AI Backend is running..." instead of "Connection failed"

### Step 3: Verify IP Address

**Your computer's IP addresses**:
- ✅ `10.10.1.195` (Ethernet) - **Currently configured**
- `10.10.3.239` (Wi-Fi)

**Current Configuration**:
- ✅ `src/lib/api.ts` - Uses `10.10.1.195`
- ✅ `src/pages/Login.tsx` - Uses `10.10.1.195` (just fixed)

**If you need to change IP**:
1. Update `src/lib/api.ts` (lines 10, 12)
2. Update `src/pages/Login.tsx` (line 45)
3. Restart both frontend and backend

### Step 4: Check Network Connection

**Requirements**:
- ✅ Backend server must be running
- ✅ Phone and computer must be on **same WiFi network**
- ✅ Windows Firewall must allow port 5000
- ✅ IP address must match in frontend and backend

## 🔍 Troubleshooting

### Backend Not Starting

**Error: "Cannot find module"**
```bash
cd CropGuard-Backend
npm install
npm start
```

**Error: "Port 5000 already in use"**
- Another process is using port 5000
- Kill the process or change port in `.env` file

**Error: "Database connection failed"**
- Check MongoDB is running (if using MongoDB)
- Check `.env` file has correct database URL

### Network Error Persists

1. **Check Windows Firewall**:
   - Allow Node.js through firewall
   - Or temporarily disable firewall for testing

2. **Verify IP Address**:
   ```powershell
   Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "10.*" -or $_.IPAddress -like "192.168.*"}
   ```

3. **Test Backend Directly**:
   - Open browser: `http://localhost:5000/`
   - Should show: "CropGuard AI Backend is running..."

4. **Check Phone Network**:
   - Make sure phone is on same WiFi as computer
   - Try disconnecting and reconnecting WiFi

### Still Not Working?

1. **Restart Everything**:
   - Stop backend (Ctrl+C)
   - Stop Expo (Ctrl+C)
   - Start backend: `cd CropGuard-Backend && npm start`
   - Start Expo: `cd CropGuardAI-Project-main && npm start`

2. **Check Console Logs**:
   - Backend console should show incoming requests
   - Frontend console should show error details

3. **Try Different IP**:
   - If `10.10.1.195` doesn't work, try `10.10.3.239` (Wi-Fi IP)
   - Update in `src/lib/api.ts` and `src/pages/Login.tsx`

## ✅ Success Indicators

When backend is connected:
- ✅ Backend console shows: "Server is running..."
- ✅ Login page shows: "CropGuard AI Backend is running..."
- ✅ No "Network request failed" errors
- ✅ Login/Signup works
- ✅ Image upload works

## 📝 Quick Checklist

- [ ] Backend server is running (`npm start` in CropGuard-Backend)
- [ ] Backend console shows "Server is running..."
- [ ] IP address is `10.10.1.195` in both `api.ts` and `Login.tsx`
- [ ] Phone and computer are on same WiFi
- [ ] Windows Firewall allows port 5000
- [ ] Test `http://localhost:5000/` in browser works

## 🚀 Start Commands

**Terminal 1 (Backend)**:
```bash
cd CropGuard-Backend
npm start
```

**Terminal 2 (Frontend)**:
```bash
cd CropGuardAI-Project-main
npm start
```

**Both must be running simultaneously!**

