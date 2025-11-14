# 🚀 How to Start the Backend Server

## Quick Start

1. **Open a new terminal/PowerShell window**

2. **Navigate to backend directory**:
   ```bash
   cd CropGuard-Backend
   ```

3. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **You should see**:
   ```
   Server is running on http://0.0.0.0:5000
   Access from mobile: http://10.10.1.195:5000 or http://192.168.1.7:5000
   ```

## Verify Backend is Running

1. **Check the console** - Should show "Server is running..."
2. **Test in browser**: Open `http://localhost:5000/` - Should show "CropGuard AI Backend is running..."
3. **Test from mobile**: The Login page should show "CropGuard AI Backend is running..." instead of "Connection failed"

## Troubleshooting

### Port Already in Use
If you see "Port 5000 is already in use":
- Another process is using port 5000
- Kill the process or change the port in `.env` file

### Database Connection Error
- Make sure MongoDB is running (if using MongoDB)
- Check `.env` file has correct database connection string

### Network Error in App
- Make sure backend is running (check console)
- Verify IP address matches in:
  - `src/lib/api.ts` (line 10, 12)
  - `src/pages/Login.tsx` (line 44)
- Make sure phone and computer are on same WiFi network
- Check Windows Firewall allows port 5000

## Current Configuration

- **Port**: 5000
- **IP**: 10.10.1.195 (update if your IP is different)
- **CORS**: Enabled for all origins
- **Access**: Available on all network interfaces (0.0.0.0)

