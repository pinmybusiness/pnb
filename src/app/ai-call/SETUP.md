# FasterQ AI Calling - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-...`)

### Step 2: Set Environment Variable

**Option A: Create `.env.local` file manually**

1. Open your terminal
2. Navigate to the frontend directory:
   ```bash
   cd d:\2025\FasterQ\frontend
   ```
3. Create `.env.local` file:
   ```bash
   # Windows PowerShell
   New-Item -Path ".env.local" -ItemType File
   
   # Or use any text editor to create the file
   ```
4. Add this line to `.env.local`:
   ```
   NEXT_PUBLIC_OPENAI_KEY=sk-proj-your-actual-key-here
   ```
   (Replace `sk-proj-your-actual-key-here` with your real key)

**Option B: Use echo command**

```bash
# Windows PowerShell
cd d:\2025\FasterQ\frontend
echo "NEXT_PUBLIC_OPENAI_KEY=sk-proj-your-actual-key-here" > .env.local
```

### Step 3: Start the Development Server

```bash
cd d:\2025\FasterQ\frontend
npm run dev
```

### Step 4: Test the AI Calling

1. Open your browser
2. Go to: http://localhost:3000/ai-call
3. Click "Start Call"
4. Allow microphone access
5. Start speaking!

---

## ✅ Verification Checklist

- [ ] OpenAI API key is copied
- [ ] `.env.local` file is created in `frontend/` directory
- [ ] API key is pasted in `.env.local`
- [ ] Dev server is restarted
- [ ] Browser shows the AI calling page
- [ ] "Start Call" button is visible
- [ ] Microphone permission is granted
- [ ] AI responds when you speak

---

## 🐛 Common Issues

### Issue: "OpenAI API key is not configured"

**Solution:** 
- Make sure `.env.local` exists in `frontend/` directory (not root)
- Check that the key starts with `NEXT_PUBLIC_OPENAI_KEY=`
- Restart the dev server after creating `.env.local`

### Issue: Can't create `.env.local` file

**Solution:**
- Use a text editor (VS Code, Notepad, etc.)
- Save the file as `.env.local` (with the dot at the start)
- Make sure it's in the `frontend/` folder

### Issue: Changes not reflecting

**Solution:**
- Stop the dev server (Ctrl+C)
- Restart it: `npm run dev`
- Hard refresh browser (Ctrl+Shift+R)

---

## 📁 File Location

Your `.env.local` file should be here:

```
FasterQ/
└── frontend/
    ├── .env.local          ← Create this file here
    ├── package.json
    ├── src/
    │   └── app/
    │       └── ai-call/
    │           ├── page.jsx
    │           ├── config.js
    │           └── README.md
    └── ...
```

---

## 🎉 You're Done!

Once you see the AI calling page and can make a call, you're all set!

The AI will:
- Speak in natural Hinglish
- Act as a FasterQ representative
- Answer questions about FasterQ features
- Handle demo requests, pricing queries, etc.

---

## 📚 Next Steps

- Read `src/app/ai-call/README.md` for detailed documentation
- Customize the AI prompt in `src/app/ai-call/config.js`
- Adjust voice, model, and other settings in `config.js`

---

**Need help?** Check the full documentation in `src/app/ai-call/README.md`
