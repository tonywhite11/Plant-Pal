import React, { useRef, useEffect, useState } from 'react';
import { CameraIcon } from './IconComponents';

interface CameraViewProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewState, setViewState] = useState<'requesting' | 'streaming'>('requesting');

  useEffect(() => {
    // Cleanup effect: stop the stream when component unmounts or stream object changes
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleRequestAndStartCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setViewState('streaming');
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access the camera. Please check permissions and try again. You may need to grant permission in your browser settings.");
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !stream) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob((blob) => {
            if (blob) {
                onCapture(blob);
            }
        }, 'image/jpeg', 0.95);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
      {viewState === 'requesting' ? (
        <div className="flex flex-col items-center text-center text-white bg-gray-900 p-8 rounded-2xl shadow-xl">
            <CameraIcon className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Enable Camera Access</h2>
            <p className="max-w-xs text-gray-300 mb-6">
                To take a photo of your plant, please grant permission to use your device's camera.
            </p>
            {error && (
                <div className="bg-red-900/50 border border-red-600 text-red-300 p-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}
            <button 
                onClick={handleRequestAndStartCamera}
                className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900"
            >
                Use Camera
            </button>
            <button 
                onClick={onClose}
                className="mt-4 text-gray-400 hover:text-white transition-colors"
            >
                Cancel
            </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
            aria-label="Live camera feed"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-center items-center gap-8">
            <button 
              onClick={onClose}
              className="text-white text-sm font-semibold py-2 px-4 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
              aria-label="Close camera view"
            >
                Cancel
            </button>
            <button
              onClick={handleCapture}
              disabled={!stream}
              className="w-20 h-20 bg-white rounded-full border-4 border-gray-400 hover:border-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-black disabled:bg-gray-500 disabled:border-gray-600"
              aria-label="Capture photo"
            />
            {/* Spacer to balance the layout */}
            <div className="w-[88px] sm:w-28"></div> 
          </div>
        </>
      )}
    </div>
  );
};