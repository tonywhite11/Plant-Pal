
import React from 'react';
import { StethoscopeIcon } from './IconComponents';
import { ImageUploader } from './ImageUploader';
import { SearchableDropdown } from './SearchableDropdown';

interface SymptomInputProps {
  symptomValue: string;
  onSymptomChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  plantTypeValue: string;
  onPlantTypeChange: (value: string) => void;
  plantTypes: string[];
  onSubmit: () => void;
  isLoading: boolean;
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
}

export const SymptomInput: React.FC<SymptomInputProps> = ({ 
  symptomValue, 
  onSymptomChange,
  plantTypeValue,
  onPlantTypeChange,
  plantTypes,
  onSubmit, 
  isLoading,
  imagePreview,
  onImageChange
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <ImageUploader 
          imagePreview={imagePreview}
          onImageChange={onImageChange}
          isLoading={isLoading}
        />
        <div className="flex flex-col">
          <label htmlFor="plantType" className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Plant type (optional)
          </label>
          <div className="mb-4">
            <SearchableDropdown
                options={plantTypes}
                value={plantTypeValue}
                onChange={onPlantTypeChange}
                placeholder="Select or search for a plant type..."
                disabled={isLoading}
            />
          </div>
          <label htmlFor="symptoms" className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Describe symptoms
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Be as detailed as possible. Mention leaf color, spots, wilting, soil condition, etc.
          </p>
          <textarea
            id="symptoms"
            className="w-full flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 min-h-[150px] md:min-h-0"
            placeholder="e.g., My tomato plant's leaves are yellow with brown spots, and the lower leaves are wilting..."
            value={symptomValue}
            onChange={onSymptomChange}
            disabled={isLoading}
          />
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || !symptomValue.trim()}
        className="mt-4 w-full flex items-center justify-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
        aria-label="Diagnose Plant"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Diagnosing...
          </>
        ) : (
          <>
            <StethoscopeIcon className="h-5 w-5 mr-2" />
            Diagnose Plant
          </>
        )}
      </button>
    </div>
  );
};
