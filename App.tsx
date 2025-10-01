
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SymptomInput } from './components/SymptomInput';
import { DiagnosisResult } from './components/DiagnosisResult';
import { LoadingSpinner } from './components/LoadingSpinner';
import { diagnosePlant } from './services/geminiService';
import type { DiagnosisReport } from './types';
import { LeafIcon } from './components/IconComponents';

type Theme = 'light' | 'dark';

const plantTypes = [
  "Aloe Vera",
  "Apple Tree",
  "Calathea",
  "Cannabis",
  "Citrus Tree",
  "Corn",
  "Cucumber",
  "Dracaena",
  "Fern",
  "Fiddle Leaf Fig",
  "Grape Vine",
  "Monstera",
  "Orchid",
  "Peace Lily",
  "Pepper Plant",
  "Philodendron",
  "Pothos",
  "Rose",
  "Rubber Plant",
  "Snake Plant",
  "Soybean",
  "Spider Plant",
  "Succulent",
  "Tomato",
  "Wheat",
  "Zucchini",
  "ZZ Plant",
  "Fruit Tree (General)",
  "Houseplant (General)",
  "Vegetable (General)",
  "Other / Unknown"
];


const App: React.FC = () => {
  const [symptomDescription, setSymptomDescription] = useState<string>('');
  const [plantType, setPlantType] = useState<string>('');
  const [plantImage, setPlantImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleImageChange = useCallback((file: File | null) => {
    setPlantImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, []);
  
  const toBase64 = (file: File): Promise<string> => 
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
  });

  const handleDiagnose = useCallback(async () => {
    if (!symptomDescription.trim()) {
      setError("Please describe your plant's symptoms. A description is required.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setDiagnosis(null);

    try {
      let imageBase64: string | null = null;
      if (plantImage) {
        imageBase64 = await toBase64(plantImage);
      }
      const result = await diagnosePlant(symptomDescription, plantType, imageBase64, plantImage?.type || null);
      setDiagnosis(result);
      handleImageChange(null); // Clear image on success
    } catch (err) {
      console.error('Diagnosis Error:', err);
      setError('Sorry, we couldn\'t get a diagnosis. The AI may be busy, or an error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [symptomDescription, plantType, plantImage, handleImageChange]);

  return (
    <div className="bg-green-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <SymptomInput
            symptomValue={symptomDescription}
            onSymptomChange={(e) => setSymptomDescription(e.target.value)}
            plantTypeValue={plantType}
            onPlantTypeChange={setPlantType}
            plantTypes={plantTypes}
            onSubmit={handleDiagnose}
            isLoading={isLoading}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
          />
          {error && (
            <div className="mt-6 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <LoadingSpinner />
              <p className="mt-4 text-green-700 dark:text-green-300 font-semibold text-lg">Analyzing symptoms and image...</p>
            </div>
          ) : diagnosis ? (
            <DiagnosisResult report={diagnosis} />
          ) : (
            <div className="text-center p-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-green-200 dark:border-gray-700">
               <LeafIcon className="mx-auto h-16 w-16 text-green-300 dark:text-green-600" />
               <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Ready for Diagnosis</h2>
               <p className="mt-2 text-gray-500 dark:text-gray-400">
                Upload a photo and describe the symptoms of your plant, and our AI assistant will help you find a solution.
               </p>
             </div>
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Powered by Plant Pal AI</p>
      </footer>
    </div>
  );
};

export default App;
