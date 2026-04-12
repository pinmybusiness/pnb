'use client';

import { useState, useRef } from "react";
import { Play, Pause, Download } from "lucide-react";
import { toast } from "react-hot-toast";

const AudioPlayer = ({ recordingUrl, callId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (!recordingUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => toast.error("Failed to play recording"));
    }
  };

  const handleDownload = () => {
    if (!recordingUrl) return;

    const link = document.createElement("a");
    link.href = recordingUrl;
    link.download = `recording-${callId}.mp3`;
    link.click();
  };

  return (
    <div className="flex items-center gap-1 justify-between md:max-w-[100px]">
      {/* Hidden audio */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={recordingUrl} type="audio/mpeg" />
      </audio>

      {/* Play / Pause */}
      <button
        onClick={togglePlayPause}
        disabled={!recordingUrl}
        className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-all text-sm
          ${
            recordingUrl
              ? isPlaying
                ? "text-orange-600 border-orange-300 bg-orange-50"
                : "text-gray-700 border-gray-300 bg-white hover:bg-gray-100"
              : "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
          }`}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span>Play</span>
      </button>

      {/* Download */}
      <button
        onClick={handleDownload}
        disabled={!recordingUrl}
        className={`px-2 py-[6px] rounded-md border transition
          ${
            recordingUrl
              ? "border-gray-300 hover:bg-gray-100 text-gray-600"
              : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AudioPlayer;
