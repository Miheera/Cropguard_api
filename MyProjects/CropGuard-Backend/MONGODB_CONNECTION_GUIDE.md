# 🔌 MongoDB Connection Guide

## ❌ Common Connection Errors

### Error 1: "MONGO_URI is not defined in .env file"
**Cause**: `.env` file doesn't exist or `MONGO_URI` is missing

### Error 2: "Authentication failed"
**Cause**: Wrong username/password in connection string

### Error 3: "Network timeout" or "Connection refused"
**Cause**: IP address not whitelisted in MongoDB Atlas

### Error 4: "Invalid connection string"
**Cause**: Connection string format is incorrect

---

## ✅ Step-by-Step Connection Setup

### Step 1: Create `.env` File

**Location**: `CropGuard-Backend/.env`

**Create the file** (if it doesn't exist):
1. Open `CropGuard-Backend` folder
2. Create new file named `.env` (no extension, just `.env`)
3. Add your connection string

### Step 2: Format Your Connection String

**Your connection string**:
```
mongodb+srv://username:*****@cluster0.xxxxx.mongodb.net/cropguard?retryWrites=true&w=majority
```

**Important**: Replace these parts:
- `username` → Your MongoDB Atlas username
- `*****` → Your MongoDB Atlas password (actual password, not asterisks)
- `xxxxx` → Your actual cluster name (e.g., `abc123`)

**Example** (with real values):
```
mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/cropguard?retryWrites=true&w=majority
```

### Step 3: Create `.env` File Content

**File**: `CropGuard-Backend/.env`

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cropguard?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_secret_key_here_make_it_long_and_random
```

**⚠️ Important**:
- Replace `username` with your actual MongoDB Atlas username
- Replace `password` with your actual MongoDB Atlas password
- Replace `xxxxx` with your actual cluster identifier
- Keep the quotes if your password has special characters

### Step 4: Get Your Correct Connection String

**From MongoDB Atlas Dashboard**:

1. **Login** to MongoDB Atlas: https://cloud.mongodb.com
2. **Click** "Connect" button on your cluster
3. **Choose** "Connect your application"
4. **Copy** the connection string
5. **Replace** `<password>` with your actual password
6. **Replace** `<dbname>` with `cropguard` (or keep it if already there)

**Example from Atlas**:
```
mongodb+srv://myuser:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

**After replacing**:
```
mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/cropguard?retryWrites=true&w=majority
```

---

## 🔒 Step 5: Whitelist Your IP Address

**This is CRITICAL!** MongoDB Atlas blocks connections from unknown IPs.

### How to Whitelist IP:

1. **Go to MongoDB Atlas Dashboard**
2. **Click** "Network Access" (left sidebar)
3. **Click** "Add IP Address"
4. **Choose one**:
   - **Option A**: Click "Add Current IP Address" (for your computer)
   - **Option B**: Click "Allow Access from Anywhere" (for development only)
     - Enter: `0.0.0.0/0`
     - ⚠️ **Warning**: Less secure, only for development!

5. **Click** "Confirm"

**For Development** (Easier):
- Use `0.0.0.0/0` to allow from anywhere
- ⚠️ **Change this later** for production!

---

## 🧪 Step 6: Test the Connection

### Test 1: Check `.env` File Exists

**Location**: `CropGuard-Backend/.env`

**Should contain**:
```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/cropguard?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=some_long_random_string_here
```

### Test 2: Start Backend Server

```bash
cd CropGuard-Backend
npm start
```

**Success Message**:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server is running on http://0.0.0.0:5000
```

**Error Messages**:

**If you see**: `MONGO_URI is not defined in .env file`
- ✅ Solution: Create `.env` file with `MONGO_URI=...`

**If you see**: `Authentication failed`
- ✅ Solution: Check username/password in connection string

**If you see**: `Network timeout` or `Connection refused`
- ✅ Solution: Whitelist your IP address in MongoDB Atlas

**If you see**: `Invalid connection string`
- ✅ Solution: Check connection string format

---

## 🔍 Troubleshooting Specific Errors

### Error: "MONGO_URI is not defined"

**Check**:
1. File exists: `CropGuard-Backend/.env`
2. File name is exactly `.env` (not `.env.txt` or `env`)
3. Contains: `MONGO_URI=...`
4. No spaces: `MONGO_URI=` not `MONGO_URI =`

**Fix**:
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cropguard?retryWrites=true&w=majority
```

### Error: "Authentication failed"

**Check**:
1. Username is correct (case-sensitive)
2. Password is correct (no extra spaces)
3. Password doesn't have special characters that need encoding

**Fix**:
- If password has special characters, URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`
  - `&` → `%26`
  - `+` → `%2B`
  - `=` → `%3D`

**Example**:
```
Password: my@pass#123
Encoded: my%40pass%23123
```

### Error: "Network timeout" or "Connection refused"

**Check**:
1. IP address is whitelisted in MongoDB Atlas
2. Internet connection is working
3. Firewall isn't blocking MongoDB

**Fix**:
1. Go to MongoDB Atlas → Network Access
2. Add your IP address (or `0.0.0.0/0` for development)
3. Wait 1-2 minutes for changes to apply

### Error: "Invalid connection string"

**Check**:
1. Connection string starts with `mongodb+srv://`
2. Format: `mongodb+srv://username:password@cluster...`
3. No extra spaces or line breaks
4. Database name is included: `...mongodb.net/cropguard?...`

**Correct Format**:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?OPTIONS
```

---

## 📝 Complete `.env` File Example

**File**: `CropGuard-Backend/.env`

```env
# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/cropguard?retryWrites=true&w=majority

# Server Port
PORT=5000

# JWT Secret Key (for authentication tokens)
# Generate a random string: https://randomkeygen.com/
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_12345
```

**⚠️ Important**:
- Replace all placeholder values with your actual values
- Don't commit `.env` to Git (it should be in `.gitignore`)
- Keep your password secret!

---

## ✅ Verification Checklist

Before starting the server, verify:

- [ ] `.env` file exists in `CropGuard-Backend/` folder
- [ ] `.env` file contains `MONGO_URI=...`
- [ ] Connection string has correct username
- [ ] Connection string has correct password (URL encoded if needed)
- [ ] Connection string has correct cluster name
- [ ] Database name is `cropguard` (or your preferred name)
- [ ] IP address is whitelisted in MongoDB Atlas
- [ ] `JWT_SECRET` is set (can be any random string)

---

## 🚀 Quick Start Commands

### 1. Create `.env` File

**Windows (PowerShell)**:
```powershell
cd CropGuard-Backend
New-Item -Path .env -ItemType File
notepad .env
```

**Mac/Linux**:
```bash
cd CropGuard-Backend
touch .env
nano .env
```

### 2. Add Connection String

Copy this template and fill in your values:
```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/cropguard?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_random_secret_key_here
```

### 3. Test Connection

```bash
cd CropGuard-Backend
npm start
```

**Expected Output**:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server is running on http://0.0.0.0:5000
```

---

## 🔐 Security Notes

1. **Never commit `.env` to Git**
   - Check `.gitignore` includes `.env`
   - Keep passwords secret

2. **Use Strong Passwords**
   - MongoDB Atlas password should be strong
   - JWT_SECRET should be long and random

3. **IP Whitelisting**
   - For production: Only whitelist specific IPs
   - For development: `0.0.0.0/0` is okay temporarily

4. **Connection String**
   - Don't share your connection string
   - If compromised, change password immediately

---

## 📞 Still Having Issues?

### Common Mistakes:

1. **File name wrong**: Must be `.env` not `env` or `.env.txt`
2. **Wrong folder**: `.env` must be in `CropGuard-Backend/` folder
3. **Spaces in connection string**: No spaces around `=`
4. **Password not encoded**: Special characters need URL encoding
5. **IP not whitelisted**: Most common issue!
6. **Wrong database name**: Should be `cropguard` or match your Atlas database

### Get Help:

1. **Check MongoDB Atlas Logs**: Dashboard → Monitoring
2. **Check Backend Console**: Look for specific error messages
3. **Test Connection**: Use MongoDB Compass to test connection string
4. **Verify Credentials**: Double-check username/password in Atlas

---

## 🎯 Next Steps After Connection Works

1. ✅ **Verify Connection**: See "MongoDB Connected" message
2. ✅ **Test API**: Try login/signup from app
3. ✅ **View Database**: Open MongoDB Compass and connect
4. ✅ **Check Collections**: Should see `users`, `detections`, etc.

Once connected, you're ready to integrate your ML model! 🚀

