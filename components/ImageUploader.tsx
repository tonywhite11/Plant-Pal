import React, { useRef, useState } from 'react';
import { ImageIcon, XCircleIcon, CameraIcon } from './IconComponents';
import { CameraView } from './CameraView';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreview, onImageChange, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleFileSelect = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onImageChange(file || null);
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const handleCapture = (blob: Blob) => {
    const file = new File([blob], `capture-${Date.now()}.jpeg`, { type: 'image/jpeg' });
    onImageChange(file);
    setIsCameraOpen(false);
  }

  return (
    <div className="w-full">
      <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Upload a photo (optional)
      </label>
      <div 
        className={`w-full h-full min-h-[192px] border-2 border-dashed rounded-lg flex items-center justify-center text-center transition-colors duration-200 relative ${imagePreview ? 'border-transparent' : 'border-gray-300 dark:border-gray-600'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          disabled={isLoading}
        />
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Plant preview" className="w-full h-full object-cover rounded-lg" />
            {!isLoading && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleRemoveImage();
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Remove image"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-center w-full h-full p-4 gap-4">
             <button
                onClick={handleFileSelect}
                disabled={isLoading}
                className="flex-1 w-full md:w-auto flex flex-col items-center justify-center p-4 rounded-lg bg-white dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <ImageIcon className="h-10 w-10 mb-2 text-gray-500 dark:text-gray-400" />
                <span className="font-semibold text-gray-600 dark:text-gray-300">Upload from file</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, WEBP</span>
            </button>
            <div className="text-sm font-semibold text-gray-400 dark:text-gray-500">OR</div>
             <button
                onClick={() => setIsCameraOpen(true)}
                disabled={isLoading}
                className="flex-1 w-full md:w-auto flex flex-col items-center justify-center p-4 rounded-lg bg-white dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <CameraIcon className="h-10 w-10 mb-2 text-gray-500 dark:text-gray-400" />
                <span className="font-semibold text-gray-600 dark:text-gray-300">Take a photo</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Use your camera</span>
            </button>
          </div>
        )}
      </div>

      {isCameraOpen && (
        <CameraView 
            onCapture={handleCapture}
            onClose={() => setIsCameraOpen(false)}
        />
      )}
    </div>
  );
};