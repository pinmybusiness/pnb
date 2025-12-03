# FasterQ AI Calling - Implementation Notes

## 📋 Overview

This implementation provides a production-ready AI calling experience for FasterQ using OpenAI's Realtime API. The AI agent speaks in natural Hinglish and acts as a FasterQ customer support representative.

---

## 🏗️ Architecture & Flow

### Step-by-Step Call Flow

1. **User Initiates Call**
   - User clicks "Start Call" button
   - Status changes to "connecting"

2. **Microphone Permission**
   - Browser requests microphone access
   - If denied → Show error message
   - If granted → Proceed to next step

3. **WebRTC Setup**
   - Create `RTCPeerConnection` object
   - Add user's microphone track to the connection
   - Set up event handlers for incoming audio and data

4. **SDP Offer Creation**
   - Generate SDP (Session Description Protocol) offer
   - This describes the media capabilities and connection details

5. **Connect to OpenAI Realtime API**
   - Send SDP offer to OpenAI endpoint
   - Include API key in Authorization header
   - Receive SDP answer from OpenAI

6. **Establish Connection**
   - Set remote description with OpenAI's SDP answer
   - WebRTC connection is now established
   - OpenAI creates a data channel called "oai-events"

7. **Session Configuration**
   - When data channel opens, send session update
   - This includes the FasterQ system prompt and settings
   - AI now knows to speak in Hinglish and act as FasterQ agent

8. **Live Call**
   - Audio flows: User Mic → OpenAI → User Speaker
   - AI listens and responds in real-time
   - Transcripts appear via data channel events
   - Status changes to "live"

9. **End Call**
   - User clicks "End Call"
   - Close all connections and stop microphone
   - Clean up resources

---

## 📁 File Structure

```
frontend/src/app/ai-call/
├── page.jsx          # Main AI calling component (UI + logic)
├── config.js         # Configuration (prompts, settings, constants)
└── README.md         # This file (implementation notes)
```

---

## ⚙️ Configuration Guide

### Where to Change the System Prompt

**File:** `config.js`  
**Constant:** `FASTERQ_CALL_AGENT_PROMPT`

This is the core instruction set for the AI. To modify the AI's behavior:

1. Open `config.js`
2. Find `FASTERQ_CALL_AGENT_PROMPT` (starts around line 12)
3. Edit the prompt text
4. Save the file

**What you can change:**
- Language instructions (currently set to Hinglish)
- Tone and personality
- Product knowledge (FasterQ features, pricing, etc.)
- Conversation flow and examples
- Handling of specific scenarios

**Example modification:**
```javascript
// Make the AI more formal
export const FASTERQ_CALL_AGENT_PROMPT = `You are a professional FasterQ representative.
Speak in formal Hinglish with a business tone...`;
```

---

### Where to Change the AI Model

**File:** `config.js`  
**Constant:** `REALTIME_CONFIG.model`

To use a different OpenAI Realtime model:

1. Open `config.js`
2. Find `REALTIME_CONFIG` object (around line 180)
3. Change the `model` property
4. Save the file

**Current model:** `gpt-4o-realtime-preview-2024-12-17`

**Example:**
```javascript
export const REALTIME_CONFIG = {
  model: "gpt-4o-realtime-preview-2024-12-17", // Change this
  // ... rest of config
};
```

---

### Where to Change Voice Settings

**File:** `config.js`  
**Constant:** `REALTIME_CONFIG.session.voice`

Available voices:
- `alloy` (default - neutral, balanced)
- `echo` (male-sounding, clear)
- `shimmer` (female-sounding, warm)

**Example:**
```javascript
session: {
  voice: "echo", // Change from "alloy" to "echo"
  // ... rest of session config
}
```

---

### Where to Change Turn Detection Settings

**File:** `config.js`  
**Constant:** `REALTIME_CONFIG.session.turn_detection`

This controls when the AI starts speaking:

```javascript
turn_detection: {
  type: "server_vad",        // Voice Activity Detection
  threshold: 0.5,            // Sensitivity (0.0 - 1.0)
  prefix_padding_ms: 300,    // Audio before speech starts
  silence_duration_ms: 500   // How long to wait after user stops
}
```

**Adjustments:**
- **More responsive AI:** Decrease `silence_duration_ms` to 300-400ms
- **Less interruptions:** Increase `silence_duration_ms` to 700-1000ms
- **More sensitive:** Decrease `threshold` to 0.3-0.4
- **Less sensitive:** Increase `threshold` to 0.6-0.7

---

### Where to Change Temperature (Creativity)

**File:** `config.js`  
**Constant:** `REALTIME_CONFIG.session.temperature`

Controls how creative/random the AI responses are:

- `0.6` - More focused and consistent
- `0.8` - Balanced (current default)
- `1.0` - More creative and varied

**Example:**
```javascript
session: {
  temperature: 0.7, // Change from 0.8 to 0.7 for more consistency
  // ... rest of session config
}
```

---

## 🎨 UI Customization

### Where to Change Status Labels

**File:** `config.js`  
**Constant:** `UI_CONFIG.statusLabels`

```javascript
statusLabels: {
  ready: "Ready to Call",
  connecting: "Connecting...",
  live: "On Call",
  ended: "Call Ended",
  error: "Connection Error"
}
```

---

### Where to Change Avatar

**File:** `config.js`  
**Constant:** `UI_CONFIG.avatar`

```javascript
avatar: {
  initials: "FQ",  // Change to "AI" or any 2-3 letters
  bgColor: "bg-gradient-to-br from-purple-600 to-purple-800"
}
```

---

### Where to Change Colors/Theme

**File:** `page.jsx`

The UI uses Tailwind CSS classes. Main color elements:

- **Background gradient:** Line 384 - `bg-gradient-to-br from-gray-900 via-black to-purple-900`
- **Card background:** Line 389 - `bg-gradient-to-br from-gray-800/50 to-gray-900/50`
- **Avatar ring (live):** Line 398 - `ring-green-400`
- **Start button:** Line 514 - `from-purple-600 to-purple-700`
- **End button:** Line 527 - `from-red-600 to-red-700`

**Example - Change to blue theme:**
```jsx
// Change purple to blue
className="bg-gradient-to-br from-gray-900 via-black to-blue-900"
className="from-blue-600 to-blue-700"
```

---

## 🔐 Environment Variables

### Required Environment Variable

**Variable:** `NEXT_PUBLIC_OPENAI_KEY`  
**Location:** Create a `.env.local` file in the `frontend` directory

**Setup:**

1. Create `.env.local` in `frontend/` folder:
   ```bash
   cd frontend
   touch .env.local  # or create manually
   ```

2. Add your OpenAI API key:
   ```
   NEXT_PUBLIC_OPENAI_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
   ```

3. Restart the Next.js dev server:
   ```bash
   npm run dev
   ```

**⚠️ Security Note:**

The `NEXT_PUBLIC_` prefix exposes this key to the browser. This is **required** for OpenAI Realtime API's WebRTC flow, which runs client-side.

**For production:**
- Consider using a backend proxy to hide the key
- Implement rate limiting
- Add user authentication
- Monitor API usage

**For MVP/demo:** Current approach is acceptable.

---

## 🚀 How to Use

### Starting the Development Server

```bash
cd frontend
npm run dev
```

Then navigate to: `http://localhost:3000/ai-call`

---

### Making a Call

1. **Click "Start Call"**
   - Browser will request microphone permission
   - Click "Allow"

2. **Wait for Connection**
   - Status will show "Connecting..."
   - Then "Connected" → "On Call"
   - Avatar will have a green ring and "LIVE" badge

3. **Start Speaking**
   - Speak naturally in English, Hindi, or Hinglish
   - AI will respond in Hinglish
   - Transcript appears in real-time

4. **End Call**
   - Click "End Call" button
   - All connections will close
   - Microphone will stop

---

## 🐛 Troubleshooting

### Issue: "Microphone access denied"

**Solution:**
- Click the lock icon in browser address bar
- Allow microphone access
- Refresh the page and try again

---

### Issue: "Failed to connect to FasterQ AI"

**Possible causes:**
1. No internet connection
2. OpenAI API key missing or invalid
3. OpenAI API is down

**Solutions:**
- Check internet connection
- Verify `.env.local` has correct `NEXT_PUBLIC_OPENAI_KEY`
- Check OpenAI status: https://status.openai.com
- Check browser console for detailed error messages

---

### Issue: AI speaks in English only, not Hinglish

**Solution:**
1. Check that the system prompt in `config.js` has the Hinglish instructions
2. Verify the session update is being sent (check browser console logs)
3. Try speaking in Hinglish first to set the tone
4. Increase temperature to 0.9 for more varied responses

---

### Issue: AI interrupts too much

**Solution:**
Increase `silence_duration_ms` in `config.js`:

```javascript
turn_detection: {
  silence_duration_ms: 800  // Increase from 500 to 800
}
```

---

### Issue: AI takes too long to respond

**Solution:**
Decrease `silence_duration_ms` in `config.js`:

```javascript
turn_detection: {
  silence_duration_ms: 300  // Decrease from 500 to 300
}
```

---

### Issue: No transcript appearing

**Possible causes:**
1. Data channel not established
2. Wrong event type being listened to

**Solution:**
- Check browser console for "Data channel established" message
- Check for any error messages in console
- Verify `handleRealtimeEvent` function is receiving events

---

## 🔧 Advanced Customization

### Adding Function Calling (Tools)

To allow the AI to call functions (e.g., schedule demo, check pricing):

1. Open `config.js`
2. Add tools to `REALTIME_CONFIG.session.tools`:

```javascript
session: {
  tools: [
    {
      type: "function",
      name: "schedule_demo",
      description: "Schedule a demo for the customer",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          phone: { type: "string" },
          date: { type: "string" }
        },
        required: ["name", "phone"]
      }
    }
  ],
  // ... rest of config
}
```

3. Handle function calls in `page.jsx`:

```javascript
case "response.function_call_arguments.done":
  if (event.name === "schedule_demo") {
    const args = JSON.parse(event.arguments);
    // Call your backend API to schedule demo
    console.log("Scheduling demo for:", args);
  }
  break;
```

---

### Adding Call Recording

To save call audio:

1. Use `MediaRecorder` API to record the call
2. Store the recording in your backend
3. Example:

```javascript
const startRecording = () => {
  const recorder = new MediaRecorder(mediaStreamRef.current);
  const chunks = [];
  
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    // Upload blob to your backend
  };
  
  recorder.start();
};
```

---

### Adding Call Analytics

To track call metrics:

1. Log call start/end times
2. Track call duration (already implemented)
3. Send analytics to your backend:

```javascript
const endCall = async () => {
  const callData = {
    duration: callDuration,
    transcript: transcript,
    timestamp: new Date().toISOString()
  };
  
  // Send to your backend
  await fetch('/api/call-analytics', {
    method: 'POST',
    body: JSON.stringify(callData)
  });
  
  cleanup();
  setStatus("ended");
};
```

---

## 📊 Event Types Reference

### Session Events
- `session.created` - Session initialized
- `session.updated` - Session config updated

### Conversation Events
- `conversation.item.created` - New message created
- `conversation.item.input_audio_transcription.completed` - User speech transcribed

### Response Events
- `response.created` - AI started generating response
- `response.done` - AI finished response
- `response.audio_transcript.delta` - Incremental AI speech transcript
- `response.audio_transcript.done` - Complete AI speech transcript
- `response.text.delta` - Incremental text (alternative format)
- `response.text.done` - Complete text

### Error Events
- `error` - Any error from the API

---

## 🎯 Current Limitations & Future TODOs

### Current Limitations

1. **API Key Exposure**
   - OpenAI key is exposed in browser (required for Realtime API)
   - **TODO:** Implement backend proxy for production

2. **No Call Recording**
   - Calls are not saved
   - **TODO:** Add MediaRecorder integration

3. **No User Authentication**
   - Anyone can access the page
   - **TODO:** Add login requirement

4. **No Call History**
   - Previous calls are not saved
   - **TODO:** Store call logs in database

5. **No Analytics**
   - No tracking of call metrics
   - **TODO:** Implement call analytics dashboard

6. **Single Language Model**
   - Only supports one AI model at a time
   - **TODO:** Allow model switching in UI

7. **No Call Transfer**
   - Can't transfer to human agent
   - **TODO:** Add escalation flow

---

### Recommended Next Steps

1. **Backend Integration**
   - Create API proxy for OpenAI key
   - Store call transcripts in database
   - Add user authentication

2. **Enhanced Features**
   - Call recording and playback
   - Call history page
   - Analytics dashboard
   - Function calling (schedule demo, check pricing)

3. **Production Hardening**
   - Error tracking (Sentry, etc.)
   - Rate limiting
   - Usage monitoring
   - Fallback handling

4. **UX Improvements**
   - Add sound effects (call start, call end)
   - Better loading states
   - Mobile optimization
   - Keyboard shortcuts

---

## 📞 Support

For issues or questions:
- Check browser console for error messages
- Review this documentation
- Check OpenAI Realtime API docs: https://platform.openai.com/docs/guides/realtime

---

## 🎉 Success Checklist

Before deploying to production:

- [ ] OpenAI API key is set in `.env.local`
- [ ] System prompt is customized for FasterQ
- [ ] Voice and model are configured correctly
- [ ] UI colors match FasterQ branding
- [ ] Error messages are user-friendly
- [ ] Microphone permission flow is tested
- [ ] Call quality is good (no echo, clear audio)
- [ ] Transcript updates in real-time
- [ ] Call duration timer works
- [ ] End call button works properly
- [ ] All resources are cleaned up after call ends
- [ ] Mobile responsiveness is tested
- [ ] Backend proxy is implemented (for production)
- [ ] User authentication is added (for production)
- [ ] Call analytics are tracked (optional)

---

**Last Updated:** December 1, 2025  
**Version:** 1.0.0  
**Author:** FasterQ Development Team
