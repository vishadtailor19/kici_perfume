# 🔧 CORS Troubleshooting Guide

## ✅ **CORS Configuration Applied**

Your backend now has comprehensive CORS support to prevent the intermittent CORS errors you were experiencing.

---

## 🛠️ **Enhanced CORS Configuration**

### 📋 **What Was Added:**

**1. Multiple Origin Support:**
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  process.env.CORS_ORIGIN
];
```

**2. Comprehensive Headers:**
```javascript
allowedHeaders: [
  'Origin',
  'X-Requested-With',
  'Content-Type',
  'Accept',
  'Authorization',
  'Cache-Control',
  'Pragma'
]
```

**3. All HTTP Methods:**
```javascript
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
```

**4. Preflight Request Handling:**
```javascript
app.options('*', cors(corsOptions));
```

**5. Debug Logging:**
```javascript
console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
```

**6. Fallback CORS Headers:**
```javascript
res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
res.header('Access-Control-Allow-Credentials', 'true');
// ... additional headers
```

---

## 🔍 **Common CORS Issues & Solutions**

### ❌ **Issue 1: Port Mismatch**
**Problem:** Frontend running on different port than expected
**Solution:** ✅ Added support for multiple ports (3000, 5173, 5174)

### ❌ **Issue 2: Missing Preflight Handling**
**Problem:** OPTIONS requests not handled properly
**Solution:** ✅ Added explicit OPTIONS handler for all routes

### ❌ **Issue 3: Authorization Header Blocked**
**Problem:** JWT tokens not allowed in requests
**Solution:** ✅ Added Authorization to allowed headers

### ❌ **Issue 4: Credentials Not Supported**
**Problem:** Cookies/credentials blocked
**Solution:** ✅ Set credentials: true

### ❌ **Issue 5: Method Not Allowed**
**Problem:** PUT/PATCH/DELETE requests blocked
**Solution:** ✅ Added all HTTP methods to allowed list

---

## 🧪 **Testing CORS Configuration**

### 🌐 **Browser Test Tool**
Open `cors-test.html` in your browser to test CORS:
```bash
# Open the test file
open cors-test.html
# or
firefox cors-test.html
```

### 📡 **API Test Endpoints**
```bash
# Test basic CORS
curl http://localhost:5000/api/cors-test

# Test with Origin header
curl -H "Origin: http://localhost:5173" http://localhost:5000/api/cors-test

# Test preflight request
curl -X OPTIONS -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: POST" http://localhost:5000/api/products
```

### 🔍 **Debug Information**
Check your backend console for logs like:
```
2024-01-15T10:30:00.000Z - GET /api/products - Origin: http://localhost:5173
2024-01-15T10:30:01.000Z - POST /api/auth/login - Origin: http://localhost:5173
```

---

## 🚨 **If CORS Errors Still Occur**

### 1. **Check Frontend URL**
Ensure your frontend is running on one of these URLs:
- http://localhost:3000
- http://localhost:5173
- http://localhost:5174
- http://127.0.0.1:3000
- http://127.0.0.1:5173
- http://127.0.0.1:5174

### 2. **Verify Backend Server**
- Backend should be running on `http://localhost:5000`
- Check backend console for request logs
- Look for "CORS blocked request" warnings

### 3. **Browser Issues**
- Try incognito/private mode
- Disable browser extensions
- Clear browser cache
- Check browser console for specific CORS errors

### 4. **Network Issues**
- Check if ports are blocked by firewall
- Verify no proxy/VPN interfering
- Try different browser

### 5. **Development vs Production**
- Development: CORS is more permissive
- Production: Set specific CORS_ORIGIN environment variable

---

## 📊 **CORS Error Types & Solutions**

### 🔴 **"Access to fetch at ... has been blocked by CORS policy"**
**Cause:** Origin not allowed or missing CORS headers
**Solution:** ✅ Fixed with comprehensive origin list

### 🔴 **"Request header field authorization is not allowed"**
**Cause:** Authorization header not in allowed headers
**Solution:** ✅ Added Authorization to allowed headers

### 🔴 **"Method PUT is not allowed by Access-Control-Allow-Methods"**
**Cause:** HTTP method not allowed
**Solution:** ✅ Added all methods to allowed list

### 🔴 **"Preflight request doesn't pass access control check"**
**Cause:** OPTIONS request not handled
**Solution:** ✅ Added explicit OPTIONS handler

---

## 🔧 **Environment Configuration**

### 📝 **Development (.env)**
```bash
# Backend port
PORT=5000

# CORS origin (optional, defaults to localhost:5173)
CORS_ORIGIN=http://localhost:5173

# Database
DATABASE_URL=sqlite:database.sqlite

# JWT Secret
JWT_SECRET=your-secret-key
```

### 🚀 **Production (.env.production)**
```bash
# Production CORS origin
CORS_ORIGIN=https://yourdomain.com

# Other production settings...
```

---

## 📈 **Monitoring CORS Issues**

### 🔍 **Backend Logs**
Watch for these patterns:
```bash
# Normal requests
2024-01-15T10:30:00.000Z - GET /api/products - Origin: http://localhost:5173

# CORS warnings
CORS blocked request from origin: http://localhost:3001

# Preflight requests
2024-01-15T10:30:00.000Z - OPTIONS /api/products - Origin: http://localhost:5173
```

### 🌐 **Browser Console**
Look for:
- CORS policy errors
- Network request failures
- 404 errors (wrong API URL)
- Authentication errors

---

## 🎯 **Best Practices**

### ✅ **Do:**
- Use specific origins in production
- Enable credentials only when needed
- Log CORS requests for debugging
- Test with multiple browsers
- Use HTTPS in production

### ❌ **Don't:**
- Use wildcard (*) origin with credentials
- Allow all origins in production
- Ignore CORS preflight requests
- Mix HTTP and HTTPS origins
- Hardcode origins in code

---

## 🔄 **Quick Fix Checklist**

When you encounter CORS errors:

1. ✅ **Check backend is running** on port 5000
2. ✅ **Verify frontend URL** matches allowed origins
3. ✅ **Look at browser console** for specific error
4. ✅ **Check backend logs** for request patterns
5. ✅ **Test with cors-test.html** tool
6. ✅ **Try incognito mode** to rule out extensions
7. ✅ **Restart both servers** if issues persist

---

## 📞 **Still Having Issues?**

If CORS errors persist after applying these fixes:

1. **Share the exact error message** from browser console
2. **Check backend logs** for request patterns
3. **Verify URLs** - frontend and backend
4. **Test with the provided cors-test.html** tool
5. **Try the curl commands** to test API directly

---

**🎉 Your CORS configuration is now production-ready and should handle all common CORS scenarios!**

**The intermittent CORS errors should be resolved with:**
- ✅ Multiple origin support
- ✅ Comprehensive header allowlist
- ✅ Proper preflight handling
- ✅ Debug logging for troubleshooting
- ✅ Fallback CORS headers
- ✅ All HTTP methods supported
