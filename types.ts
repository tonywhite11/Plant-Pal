
export interface DiseaseInfo {
  diseaseName: string;
  description: string;
  remedies: string[];
  prevention: string[];
}

export interface DiagnosisReport {
  possibleDiseases: DiseaseInfo[];
  summary: string;
}
