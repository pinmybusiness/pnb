/**
 * FasterQ AI Calling - Troubleshooting & Debugging Guide
 * 
 * This file contains solutions to common issues and debugging tips.
 * Use this when something isn't working as expected.
 */

// ============================================================================
// DEBUGGING UTILITIES
// ============================================================================

/**
 * Enable verbose logging for debugging
 * Add this to your page.jsx if you need detailed logs
 */
export const DEBUG_CONFIG = {
    // Set to true to enable detailed console logging
    enableVerboseLogging: false,

    // Set to true to log all Realtime events
    logAllEvents: false,

    // Set to true to log WebRTC connection details
    logWebRTC: false,
};

/**
 * Test your OpenAI API key
 * Run this in browser console to verify your key works
 */
export async function testOpenAIKey() {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_KEY;

    if (!apiKey) {
        console.error("❌ No API key found in environment variables");
        console.log("💡 Create .env.local file with: NEXT_PUBLIC_OPENAI_KEY=your-key");
        return false;
    }

    console.log("🔑 API key found:", apiKey.substring(0, 20) + "...");

    try {
        const response = await fetch("https://api.openai.com/v1/models", {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });

        if (response.ok) {
            console.log("✅ API key is valid!");
            return true;
        } else {
            console.error("❌ API key is invalid or expired");
            console.log("Response:", response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error("❌ Network error:", error);
        return false;
    }
}

/**
 * Test microphone access
 * Run this in browser console to verify mic permissions
 */
export async function testMicrophone() {
    try {
        console.log("🎤 Requesting microphone access...");

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        console.log("✅ Microphone access granted!");
        console.log("Audio tracks:", stream.getAudioTracks());

        // Stop the stream
        stream.getTracks().forEach(track => track.stop());

        return true;
    } catch (error) {
        console.error("❌ Microphone access denied or not available");
        console.error("Error:", error.name, error.message);

        if (error.name === "NotAllowedError") {
            console.log("💡 User denied permission. Click the lock icon in address bar to allow.");
        } else if (error.name === "NotFoundError") {
            console.log("💡 No microphone found. Check your device settings.");
        }

        return false;
    }
}

/**
 * Check browser compatibility
 * Run this to verify your browser supports all required features
 */
export function checkBrowserCompatibility() {
    const checks = {
        webrtc: typeof RTCPeerConnection !== "undefined",
        mediaDevices: typeof navigator.mediaDevices !== "undefined",
        getUserMedia: typeof navigator.mediaDevices?.getUserMedia !== "undefined",
        fetch: typeof fetch !== "undefined",
        audioElement: typeof Audio !== "undefined",
    };

    console.log("🌐 Browser Compatibility Check:");
    console.table(checks);

    const allSupported = Object.values(checks).every(v => v);

    if (allSupported) {
        console.log("✅ Your browser supports all required features!");
    } else {
        console.error("❌ Your browser is missing some required features");
        console.log("💡 Try using Chrome, Edge, or Firefox (latest version)");
    }

    return allSupported;
}

// ============================================================================
// COMMON ISSUES & SOLUTIONS
// ============================================================================

export const TROUBLESHOOTING_GUIDE = {

    // Issue 1: Microphone Permission Denied
    "microphone_denied": {
        problem: "User denied microphone permission or browser blocked it",
        symptoms: [
            "Error message: 'Microphone access denied'",
            "Call doesn't start",
            "Browser shows red 'X' on mic icon"
        ],
        solutions: [
            "1. Click the lock/info icon in browser address bar",
            "2. Find 'Microphone' permission",
            "3. Change to 'Allow'",
            "4. Refresh the page",
            "5. Try starting call again"
        ],
        prevention: "Always click 'Allow' when browser asks for mic permission"
    },

    // Issue 2: Connection Failed
    "connection_failed": {
        problem: "Failed to connect to OpenAI Realtime API",
        symptoms: [
            "Error message: 'Failed to connect to FasterQ AI'",
            "Status stuck on 'Connecting...'",
            "Console shows network errors"
        ],
        solutions: [
            "1. Check your internet connection",
            "2. Verify OpenAI API key is correct in .env.local",
            "3. Check OpenAI status: https://status.openai.com",
            "4. Try refreshing the page",
            "5. Check browser console for detailed error",
            "6. Verify you have credits in your OpenAI account"
        ],
        prevention: "Ensure stable internet and valid API key before starting call"
    },

    // Issue 3: API Key Missing
    "api_key_missing": {
        problem: "OpenAI API key not configured",
        symptoms: [
            "Error message: 'OpenAI API key is not configured'",
            "Console shows: 'process.env.NEXT_PUBLIC_OPENAI_KEY is undefined'"
        ],
        solutions: [
            "1. Create .env.local file in frontend/ directory",
            "2. Add line: NEXT_PUBLIC_OPENAI_KEY=your-key-here",
            "3. Replace 'your-key-here' with actual OpenAI key",
            "4. Restart dev server (stop and run 'npm run dev' again)",
            "5. Refresh browser"
        ],
        prevention: "Set up .env.local before first use (see SETUP.md)"
    },

    // Issue 4: AI Speaks English Only
    "no_hinglish": {
        problem: "AI speaks pure English instead of Hinglish",
        symptoms: [
            "AI responds in English only",
            "No Hindi words in responses",
            "Doesn't sound like Indian call center agent"
        ],
        solutions: [
            "1. Check config.js - verify FASTERQ_CALL_AGENT_PROMPT has Hinglish rules",
            "2. Check browser console for 'Session config sent' message",
            "3. Try speaking in Hinglish first to set the tone",
            "4. Increase temperature to 0.9 in config.js",
            "5. Restart call and try again"
        ],
        prevention: "Don't modify the language rules in the system prompt"
    },

    // Issue 5: No Transcript
    "no_transcript": {
        problem: "Transcript area stays empty during call",
        symptoms: [
            "Can hear AI speaking but no text appears",
            "Transcript shows 'Listening...' forever",
            "Console shows events but UI doesn't update"
        ],
        solutions: [
            "1. Check browser console for errors",
            "2. Verify data channel is established (look for '📡 Data channel established')",
            "3. Check if events are being received (look for '📨 Realtime event')",
            "4. Try ending call and starting new one",
            "5. Clear browser cache and reload"
        ],
        prevention: "Ensure stable connection before speaking"
    },

    // Issue 6: AI Interrupts Too Much
    "too_many_interruptions": {
        problem: "AI starts speaking before user finishes",
        symptoms: [
            "AI cuts off user mid-sentence",
            "Conversation feels rushed",
            "Hard to complete thoughts"
        ],
        solutions: [
            "1. Open config.js",
            "2. Find turn_detection.silence_duration_ms",
            "3. Increase from 500 to 800 or 1000",
            "4. Save and restart call",
            "5. Speak more clearly with distinct pauses"
        ],
        prevention: "Tune silence_duration_ms based on speaking style"
    },

    // Issue 7: AI Takes Too Long to Respond
    "slow_response": {
        problem: "Long delay between user stopping and AI starting",
        symptoms: [
            "Awkward silences",
            "AI seems slow to react",
            "Conversation feels laggy"
        ],
        solutions: [
            "1. Open config.js",
            "2. Find turn_detection.silence_duration_ms",
            "3. Decrease from 500 to 300 or 400",
            "4. Save and restart call",
            "5. Check internet connection speed"
        ],
        prevention: "Tune silence_duration_ms for your network latency"
    },

    // Issue 8: Echo or Feedback
    "audio_echo": {
        problem: "Hearing echo or feedback during call",
        symptoms: [
            "AI's voice echoes back",
            "Feedback loop/screeching sound",
            "Audio quality is poor"
        ],
        solutions: [
            "1. Use headphones instead of speakers",
            "2. Lower speaker volume",
            "3. Check that echoCancellation is enabled in code",
            "4. Move away from speakers",
            "5. Restart call"
        ],
        prevention: "Always use headphones for best audio quality"
    },

    // Issue 9: Call Doesn't End
    "call_wont_end": {
        problem: "End Call button doesn't work",
        symptoms: [
            "Button click has no effect",
            "Status stays on 'On Call'",
            "Microphone stays active"
        ],
        solutions: [
            "1. Refresh the page (this will force cleanup)",
            "2. Check browser console for errors",
            "3. Close and reopen the tab",
            "4. Check if cleanup() function is being called"
        ],
        prevention: "Report this as a bug if it happens consistently"
    },

    // Issue 10: High API Costs
    "high_costs": {
        problem: "OpenAI API costs are higher than expected",
        symptoms: [
            "Unexpected charges on OpenAI account",
            "Usage dashboard shows high token count",
            "Multiple concurrent sessions"
        ],
        solutions: [
            "1. Set up usage limits in OpenAI dashboard",
            "2. Implement rate limiting",
            "3. Add user authentication",
            "4. Monitor usage per user",
            "5. Set up billing alerts",
            "6. Consider backend proxy with quotas"
        ],
        prevention: "Implement authentication and rate limiting before public release"
    }
};

// ============================================================================
// DEBUGGING COMMANDS
// ============================================================================

/**
 * Run these commands in browser console for debugging
 */
export const DEBUG_COMMANDS = `
// Test your setup:
testOpenAIKey()        // Check if API key is valid
testMicrophone()       // Check if mic access works
checkBrowserCompatibility()  // Check if browser is supported

// Enable verbose logging:
localStorage.setItem('fasterq_debug', 'true')
// Then refresh the page

// Disable verbose logging:
localStorage.removeItem('fasterq_debug')

// View current environment variables:
console.log('API Key:', process.env.NEXT_PUBLIC_OPENAI_KEY?.substring(0, 20) + '...')

// Check WebRTC connection state:
// (Run this during an active call)
console.log('Connection state:', pcRef.current?.connectionState)
console.log('ICE state:', pcRef.current?.iceConnectionState)

// View current transcript:
// (Run this during an active call)
console.log('Transcript:', transcript)
`;

// ============================================================================
// PERFORMANCE OPTIMIZATION TIPS
// ============================================================================

export const PERFORMANCE_TIPS = {

    "reduce_latency": {
        tip: "Reduce response latency",
        actions: [
            "Use wired internet instead of WiFi",
            "Close other bandwidth-heavy applications",
            "Decrease silence_duration_ms to 300-400ms",
            "Use a server closer to your location (OpenAI auto-routes)"
        ]
    },

    "improve_audio_quality": {
        tip: "Improve audio quality",
        actions: [
            "Use a good quality microphone",
            "Reduce background noise",
            "Speak clearly and at normal volume",
            "Use headphones to prevent echo",
            "Enable noise suppression in code (already enabled)"
        ]
    },

    "reduce_costs": {
        tip: "Reduce API costs",
        actions: [
            "Implement session timeouts (auto-end after X minutes)",
            "Add rate limiting (max calls per user per day)",
            "Use lower temperature (0.6-0.7) for more focused responses",
            "Implement backend proxy with usage tracking",
            "Set max_response_output_tokens to lower value"
        ]
    },

    "improve_reliability": {
        tip: "Improve connection reliability",
        actions: [
            "Add retry logic for failed connections",
            "Implement connection health checks",
            "Add automatic reconnection on disconnect",
            "Monitor connection state and show warnings",
            "Implement fallback to text chat if voice fails"
        ]
    }
};

// ============================================================================
// EXPORT FOR USE IN CONSOLE
// ============================================================================

if (typeof window !== "undefined") {
    // Make debugging functions available in browser console
    window.fasterqDebug = {
        testOpenAIKey,
        testMicrophone,
        checkBrowserCompatibility,
        troubleshooting: TROUBLESHOOTING_GUIDE,
        commands: DEBUG_COMMANDS,
        performanceTips: PERFORMANCE_TIPS
    };

    console.log("🔧 FasterQ Debug Tools loaded!");
    console.log("💡 Type 'fasterqDebug' in console to access debugging utilities");
}

export default {
    DEBUG_CONFIG,
    testOpenAIKey,
    testMicrophone,
    checkBrowserCompatibility,
    TROUBLESHOOTING_GUIDE,
    DEBUG_COMMANDS,
    PERFORMANCE_TIPS
};
