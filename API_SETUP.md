# API Configuration Guide for AgriSarthi AI

This guide will help you configure the necessary API services to enable full functionality in AgriSarthi AI.

## Overview

AgriSarthi AI can run in **Demo Mode** without any API configuration. However, to enable real-time features like authentication, weather data, and AI chat, you'll need to set up the following services:

- ✅ **Firebase** - User authentication with email verification
- ✅ **OpenWeather API** - Real-time weather data and forecasts
- ✅ **HuggingFace** - AI-powered agricultural assistant

---

## 🔥 Firebase Setup (Authentication)

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Enable Authentication

1. In the Firebase Console, navigate to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Save changes

### 3. Get Your Firebase Configuration

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to **Your apps** section
3. Click the web icon (`</>`) to create a web app
4. Register your app with a name (e.g., "AgriSarthi AI")
5. Copy the configuration values:
   ```javascript
   apiKey: "AIza..."
   authDomain: "your-project.firebaseapp.com"
   projectId: "your-project-id"
   storageBucket: "your-project.appspot.com"
   messagingSenderId: "123456789"
   appId: "1:123456789:web:abc123"
   ```

### 4. Add to Environment Variables

Add these values to your `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Configure Email Verification

1. In Firebase Console, go to **Authentication** > **Templates**
2. Customize the email verification template if desired
3. Make sure email verification is enabled

---

## 🌤️ OpenWeather API Setup

### 1. Create an Account

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Click "Sign Up" and create a free account
3. Verify your email address

### 2. Get Your API Key

1. After logging in, go to [API keys](https://home.openweathermap.org/api_keys)
2. Your default API key will be shown (or create a new one)
3. Copy the API key (it looks like: `abc123def456...`)
4. **Note:** New API keys may take 10-15 minutes to activate

### 3. Add to Environment Variables

Add to your `.env` file:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

### 4. API Features Used

- Current weather data for any city
- 7-day weather forecast
- Weather alerts and recommendations for farming

---

## 🤖 HuggingFace API Setup (AI Chat)

### 1. Create an Account

1. Go to [HuggingFace](https://huggingface.co/)
2. Click "Sign Up" in the top right
3. Complete the registration process

### 2. Generate an Access Token

1. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Give it a name (e.g., "AgriSarthi AI")
4. Select "Read" permissions (free tier)
5. Click "Generate"
6. Copy the token (starts with `hf_...`)

### 3. Add to Environment Variables

Add to your `.env` file:

```env
VITE_HUGGINGFACE_API_TOKEN=hf_your_token_here
```

### 4. Model Information

- We use the `google/flan-t5-large` model for agricultural queries
- The model provides context-aware responses in both English and Hindi
- Free tier includes reasonable API limits for personal projects

---

## 📝 Complete Setup Instructions

### Step 1: Create .env File

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in your text editor

### Step 2: Add All API Keys

Your `.env` file should look like this:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=agrisarthi-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=agrisarthi-ai
VITE_FIREBASE_STORAGE_BUCKET=agrisarthi-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# OpenWeather API
VITE_OPENWEATHER_API_KEY=abc123def456...

# HuggingFace API
VITE_HUGGINGFACE_API_TOKEN=hf_abc123...
```

### Step 3: Restart Development Server

After adding your API keys:

1. Stop the current development server (Ctrl+C)
2. Restart it:
   ```bash
   npm run dev
   ```

### Step 4: Verify Configuration

1. Open the application in your browser
2. Check the console for confirmation messages:
   - ✅ `Firebase initialized successfully`
   - ⚠️ Any demo mode warnings will show which APIs need configuration

---

## 🎯 Demo Mode vs. Production Mode

### Demo Mode (No API Keys)
- ✅ All features accessible with simulated data
- ✅ Perfect for testing and development
- ⚠️ Authentication uses localStorage (no real verification)
- ⚠️ Weather data is randomly generated
- ⚠️ AI responses use pre-defined answers

### Production Mode (With API Keys)
- ✅ Real Firebase authentication with email verification
- ✅ Live weather data from OpenWeather API
- ✅ AI-powered responses from HuggingFace
- ✅ Data persistence across sessions
- ✅ Production-ready security

---

## 🔒 Security Best Practices

1. **Never commit your `.env` file** to version control
2. The `.env` file is already in `.gitignore`
3. Keep your API keys private and secure
4. For production deployment, use environment variables provided by your hosting platform
5. Firebase security rules should be configured in the Firebase Console

---

## 💡 Free Tier Limits

### Firebase (Spark Plan - Free)
- 10,000 email verifications/month
- 50,000 document reads/day
- 1 GB storage

### OpenWeather (Free Plan)
- 1,000 API calls/day
- 60 calls/minute
- Current weather + 5-day forecast

### HuggingFace (Free Tier)
- ~30,000 characters/month
- Rate limits apply
- Sufficient for personal projects

---

## 🐛 Troubleshooting

### Firebase Error: "Invalid API Key"
- Double-check your API key has no extra spaces
- Make sure you copied the entire key
- Verify the key is from the correct Firebase project

### OpenWeather Error: "Invalid API Key"
- Wait 10-15 minutes after creating the key
- Verify your account is activated
- Check the API key on the OpenWeather dashboard

### HuggingFace Error: "Model Loading"
- Wait a moment and try again (first request wakes up the model)
- Check your token has "Read" permissions
- Verify the token is active in your HuggingFace settings

### Application Still in Demo Mode
- Restart the development server after adding API keys
- Check browser console for specific error messages
- Verify `.env` file is in the root directory (not in `/src`)

---

## 📞 Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Click the "Demo Mode" badge in the app header to see which APIs need configuration
3. Refer to the official documentation:
   - [Firebase Docs](https://firebase.google.com/docs)
   - [OpenWeather API Docs](https://openweathermap.org/api)
   - [HuggingFace Docs](https://huggingface.co/docs)

---

## ✅ Quick Checklist

- [ ] Created Firebase project and enabled email authentication
- [ ] Added Firebase credentials to `.env`
- [ ] Created OpenWeather account and got API key
- [ ] Added OpenWeather API key to `.env`
- [ ] Created HuggingFace account and generated token
- [ ] Added HuggingFace token to `.env`
- [ ] Restarted development server
- [ ] Verified all services are working (check "Demo Mode" badge)

---

**Note:** All APIs listed above offer free tiers that are sufficient for development and personal use. Upgrade to paid plans only if you need higher limits for production deployment.
