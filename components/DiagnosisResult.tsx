
import React from 'react';
import type { DiagnosisReport, DiseaseInfo } from '../types';
import { PillIcon, SparklesIcon, ShieldCheckIcon } from './IconComponents';

const DiseaseCard: React.FC<{ disease: DiseaseInfo }> = ({ disease }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-xl">
      <div className="bg-green-600 dark:bg-green-700 p-4">
        <h3 className="text-xl font-bold text-white">{disease.diseaseName}</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-6">{disease.description}</p>
        
        <div className="space-y-6">
          <div>
            <h4 className="flex items-center text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
              <PillIcon className="h-5 w-5 mr-2" />
              Remedies
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {disease.remedies.map((remedy, index) => <li key={index}>{remedy}</li>)}
            </ul>
          </div>
          
          <div>
            <h4 className="flex items-center text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Prevention
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {disease.prevention.map((tip, index) => <li key={index}>{tip}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DiagnosisResultProps {
  report: DiagnosisReport;
}

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ report }) => {
  return (
    <div className="space-y-8">
      <div className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-800 dark:text-green-200 p-6 rounded-r-lg">
        <h2 className="flex items-center text-2xl font-bold mb-2">
            <SparklesIcon className="h-6 w-6 mr-2" />
            Diagnosis Summary
        </h2>
        <p>{report.summary}</p>
      </div>

      <div className="space-y-6">
        {report.possibleDiseases.map((disease, index) => (
          <DiseaseCard key={index} disease={disease} />
        ))}
      </div>
    </div>
  );
};
