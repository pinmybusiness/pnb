/**
 * ============================================================================
 * FasterQ AI Call Agent - Production-Ready Implementation
 * ============================================================================
 * 
 * This component implements a real-time AI calling experience using OpenAI's
 * Realtime API with WebRTC. The AI agent speaks in natural Hinglish and acts
 * as a FasterQ customer support representative.
 * 
 * FLOW:
 * 1. User clicks "Start Call"
 * 2. Request microphone permission
 * 3. Create WebRTC PeerConnection
 * 4. Add microphone track to connection
 * 5. Create SDP offer and send to OpenAI Realtime API
 * 6. Receive SDP answer and establish connection
 * 7. OpenAI creates data channel for events (session updates, transcripts)
 * 8. Audio flows: User Mic → OpenAI → User Speaker
 * 9. Transcripts update in real-time via data channel events
 * 10. User clicks "End Call" to terminate
 * 
 * KEY COMPONENTS:
 * - RTCPeerConnection: WebRTC connection for audio streaming
 * - Data Channel: For sending/receiving text events and session config
 * - Audio Element: Plays AI voice responses
 * - Transcript Display: Shows real-time conversation
 * 
 * SECURITY NOTE:
 * - Uses NEXT_PUBLIC_OPENAI_KEY for browser-based Realtime API
 * - This is required for OpenAI Realtime WebRTC flow
 * - For production, consider using a backend proxy to hide the key
 * - Current approach is acceptable for MVP/demo purposes
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { 
  FASTERQ_CALL_AGENT_PROMPT, 
  REALTIME_CONFIG, 
  UI_CONFIG, 
  ERROR_MESSAGES 
} from "./config";

export default function FasterQAiCall() {
  // ============================================================================
  // STATE & REFS
  // ============================================================================
  
  // Audio element ref for playing AI voice
  const audioRef = useRef(null);
  
  // WebRTC PeerConnection ref
  const pcRef = useRef(null);
  
  // Data channel ref for events
  const dataChannelRef = useRef(null);
  
  // MediaStream ref for microphone
  const mediaStreamRef = useRef(null);
  
  // Call status: ready | connecting | connected | live | ended | error
  const [status, setStatus] = useState("ready");
  
  // Transcript of the conversation (AI responses)
  const [transcript, setTranscript] = useState("");
  
  // User's speech (optional, for display)
  const [userTranscript, setUserTranscript] = useState("");
  
  // Error message (if any)
  const [errorMessage, setErrorMessage] = useState("");
  
  // Call duration timer
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef(null);

  // ============================================================================
  // CALL DURATION TIMER
  // ============================================================================
  
  useEffect(() => {
    if (status === "live") {
      // Start timer
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      // Stop and reset timer
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      if (status === "ready") {
        setCallDuration(0);
      }
    }
    
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [status]);

  // ============================================================================
  // FORMAT CALL DURATION
  // ============================================================================
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================================================
  // START CALL FUNCTION
  // ============================================================================
  
  const startCall = async () => {
    try {
      setStatus("connecting");
      setErrorMessage("");
      setTranscript("");
      setUserTranscript("");

      // -----------------------------------------------------------------------
      // STEP 1: Request Microphone Permission
      // -----------------------------------------------------------------------
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        mediaStreamRef.current = mediaStream;
      } catch (micError) {
        console.error("Microphone access denied:", micError);
        setErrorMessage(ERROR_MESSAGES.micPermissionDenied);
        setStatus("error");
        return;
      }

      // -----------------------------------------------------------------------
      // STEP 2: Create WebRTC PeerConnection
      // -----------------------------------------------------------------------
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // -----------------------------------------------------------------------
      // STEP 3: Add Microphone Track to PeerConnection
      // -----------------------------------------------------------------------
      // This sends user's audio to OpenAI
      mediaStream.getTracks().forEach((track) => {
        pc.addTrack(track, mediaStream);
      });

      // -----------------------------------------------------------------------
      // STEP 4: Handle Incoming Audio Track (AI Voice)
      // -----------------------------------------------------------------------
      // When OpenAI sends audio back, play it through the audio element
      pc.ontrack = (event) => {
        console.log("📢 Received audio track from OpenAI");
        if (audioRef.current && event.streams[0]) {
          audioRef.current.srcObject = event.streams[0];
        }
      };

      // -----------------------------------------------------------------------
      // STEP 5: Handle Data Channel (for events and transcripts)
      // -----------------------------------------------------------------------
      // OpenAI creates a data channel called "oai-events" for text communication
      pc.ondatachannel = (event) => {
        const dataChannel = event.channel;
        
        if (dataChannel.label === "oai-events") {
          console.log("📡 Data channel established:", dataChannel.label);
          dataChannelRef.current = dataChannel;

          // When data channel opens, send session configuration
          dataChannel.onopen = () => {
            console.log("✅ Data channel opened, sending session config...");
            
            // Send session update with FasterQ agent instructions
            const sessionUpdate = {
              type: "session.update",
              session: {
                modalities: REALTIME_CONFIG.session.modalities,
                instructions: REALTIME_CONFIG.session.instructions,
                voice: REALTIME_CONFIG.session.voice,
                input_audio_format: REALTIME_CONFIG.session.input_audio_format,
                output_audio_format: REALTIME_CONFIG.session.output_audio_format,
                input_audio_transcription: REALTIME_CONFIG.session.input_audio_transcription,
                turn_detection: REALTIME_CONFIG.session.turn_detection,
                temperature: REALTIME_CONFIG.session.temperature,
                max_response_output_tokens: REALTIME_CONFIG.session.max_response_output_tokens
              }
            };
            
            dataChannel.send(JSON.stringify(sessionUpdate));
            console.log("📤 Session config sent");
            
            setStatus("live");
          };

          // Handle incoming messages (transcripts, events)
          dataChannel.onmessage = (messageEvent) => {
            try {
              const data = JSON.parse(messageEvent.data);
              handleRealtimeEvent(data);
            } catch (parseError) {
              console.error("❌ Failed to parse data channel message:", parseError);
            }
          };

          // Handle data channel errors
          dataChannel.onerror = (error) => {
            console.error("❌ Data channel error:", error);
          };

          // Handle data channel close
          dataChannel.onclose = () => {
            console.log("📡 Data channel closed");
          };
        }
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log("🔌 Connection state:", pc.connectionState);
        
        if (pc.connectionState === "connected") {
          setStatus("connected");
        } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
          setErrorMessage(ERROR_MESSAGES.connectionFailed);
          setStatus("error");
        }
      };

      // -----------------------------------------------------------------------
      // STEP 6: Create SDP Offer
      // -----------------------------------------------------------------------
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // -----------------------------------------------------------------------
      // STEP 7: Send Offer to OpenAI Realtime API
      // -----------------------------------------------------------------------
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_KEY;
      
      if (!apiKey) {
        console.error("❌ OpenAI API key not found");
        setErrorMessage(ERROR_MESSAGES.apiKeyMissing);
        setStatus("error");
        return;
      }

      const response = await fetch(
        `${REALTIME_CONFIG.endpoint}?model=${REALTIME_CONFIG.model}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/sdp"
          },
          body: offer.sdp
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      // -----------------------------------------------------------------------
      // STEP 8: Receive SDP Answer and Set Remote Description
      // -----------------------------------------------------------------------
      const answerSdp = await response.text();
      await pc.setRemoteDescription({
        type: "answer",
        sdp: answerSdp
      });

      console.log("✅ WebRTC connection established successfully");

    } catch (error) {
      console.error("❌ Failed to start call:", error);
      setErrorMessage(ERROR_MESSAGES.connectionFailed);
      setStatus("error");
      
      // Cleanup on error
      cleanup();
    }
  };

  // ============================================================================
  // HANDLE REALTIME EVENTS
  // ============================================================================
  // Process events received from OpenAI via the data channel
  
  const handleRealtimeEvent = (event) => {
    // Log all events for debugging (remove in production)
    // console.log("📨 Realtime event:", event.type);

    switch (event.type) {
      // Session events
      case "session.created":
        console.log("✅ Session created:", event.session);
        break;
      
      case "session.updated":
        console.log("✅ Session updated");
        break;

      // Conversation events
      case "conversation.item.created":
        // New conversation item (user or assistant message)
        break;

      // Response events (AI is generating response)
      case "response.created":
        console.log("🤖 AI started responding");
        break;

      case "response.done":
        console.log("✅ AI finished responding");
        break;

      // Audio transcript events (AI's speech as text)
      case "response.audio_transcript.delta":
        // Incremental transcript of AI's speech
        if (event.delta) {
          setTranscript(prev => prev + event.delta);
        }
        break;

      case "response.audio_transcript.done":
        // Complete transcript of AI's speech
        if (event.transcript) {
          setTranscript(prev => prev + "\n\n");
        }
        break;

      // Text delta events (alternative transcript format)
      case "response.text.delta":
        if (event.delta) {
          setTranscript(prev => prev + event.delta);
        }
        break;

      case "response.text.done":
        if (event.text) {
          setTranscript(prev => prev + "\n\n");
        }
        break;

      // User input transcript (optional)
      case "conversation.item.input_audio_transcription.completed":
        if (event.transcript) {
          setUserTranscript(prev => prev + "You: " + event.transcript + "\n\n");
        }
        break;

      // Error events
      case "error":
        console.error("❌ Realtime API error:", event.error);
        setErrorMessage(event.error.message || ERROR_MESSAGES.unknownError);
        break;

      default:
        // Ignore other events
        break;
    }
  };

  // ============================================================================
  // END CALL FUNCTION
  // ============================================================================
  
  const endCall = () => {
    console.log("📞 Ending call...");
    cleanup();
    setStatus("ended");
  };

  // ============================================================================
  // CLEANUP FUNCTION
  // ============================================================================
  // Clean up all resources (PeerConnection, MediaStream, etc.)
  
  const cleanup = () => {
    // Close data channel
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    // Close peer connection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    // Stop all media tracks (microphone)
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Clear audio
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
  };

  // ============================================================================
  // CLEANUP ON UNMOUNT
  // ============================================================================
  
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // ============================================================================
  // RENDER UI
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white flex items-center justify-center p-4 sm:p-10">
      <div className="w-full max-w-2xl">
        
        {/* Main Call Card */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-purple-500/30 p-6 sm:p-10 rounded-3xl shadow-2xl">
          
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8">
            
            {/* Avatar with Pulse Animation */}
            <div className="relative">
              <div className={`w-28 h-28 sm:w-32 sm:h-32 ${UI_CONFIG.avatar.bgColor} rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold shadow-lg transition-all duration-300 ${
                status === "live" ? "ring-4 ring-green-400 ring-offset-4 ring-offset-gray-900" : ""
              }`}>
                {UI_CONFIG.avatar.initials}
              </div>
              
              {/* Live Indicator */}
              {status === "live" && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 bg-green-500 px-4 py-1 rounded-full text-xs font-semibold">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-6 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FasterQ AI Agent
            </h1>
            
            {/* Status */}
            <p className={`mt-2 text-sm sm:text-base font-medium ${UI_CONFIG.statusColors[status]}`}>
              {UI_CONFIG.statusLabels[status]}
            </p>

            {/* Call Duration */}
            {status === "live" && (
              <p className="mt-1 text-sm text-gray-400 font-mono">
                {formatDuration(callDuration)}
              </p>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400 text-sm text-center">{errorMessage}</p>
            </div>
          )}

          {/* Transcript Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Conversation
              </h2>
              {transcript && (
                <button
                  onClick={() => {
                    setTranscript("");
                    setUserTranscript("");
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="h-64 sm:h-80 bg-gray-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-700/50 overflow-y-auto custom-scrollbar">
              {status === "ready" && (
                <p className="text-gray-500 text-sm text-center mt-20">
                  Click "Start Call" to begin conversation with FasterQ AI Agent
                </p>
              )}
              
              {status === "connecting" && (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                  <p className="text-gray-400 text-sm">Connecting to AI agent...</p>
                </div>
              )}
              
              {(status === "connected" || status === "live" || status === "ended") && (
                <div className="space-y-4">
                  {/* User Transcript (if available) */}
                  {userTranscript && (
                    <div className="text-gray-300 text-sm whitespace-pre-wrap">
                      {userTranscript}
                    </div>
                  )}
                  
                  {/* AI Transcript */}
                  {transcript ? (
                    <div className="text-white text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      <span className="text-purple-400 font-semibold">AI: </span>
                      {transcript}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center mt-20">
                      {status === "live" ? "Listening... Start speaking!" : "Waiting for AI response..."}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {status === "ready" || status === "ended" || status === "error" ? (
              <button
                onClick={startCall}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {status === "ended" ? "Start New Call" : "Start Call"}
              </button>
            ) : status === "connecting" || status === "connected" ? (
              <button
                disabled
                className="flex-1 px-6 py-4 bg-gray-700 rounded-xl font-semibold text-base sm:text-lg cursor-not-allowed opacity-50"
              >
                Connecting...
              </button>
            ) : (
              <button
                onClick={endCall}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-red-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                End Call
              </button>
            )}
          </div>

          {/* Info Text */}
          <p className="mt-6 text-xs sm:text-sm text-gray-500 text-center">
            {status === "ready" && "The AI agent will speak in natural Hinglish and help with FasterQ queries"}
            {status === "live" && "Speak naturally - the AI will respond in Hinglish"}
            {status === "ended" && "Call ended. You can start a new call anytime."}
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Powered by OpenAI Realtime API • FasterQ.in
          </p>
        </div>
      </div>

      {/* Hidden Audio Element for AI Voice Playback */}
      <audio 
        ref={audioRef} 
        autoPlay 
        className="hidden"
      />

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.6);
        }
      `}</style>
    </div>
  );
}
