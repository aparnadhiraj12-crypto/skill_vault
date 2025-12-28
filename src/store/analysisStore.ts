import { create } from 'zustand';
import { AIAnalysisResult } from '@/services/aiService';

interface AnalysisState {
  // Current analysis data
  analysis: AIAnalysisResult | null;
  isLoading: boolean;
  error: string | null;

  // Upload context
  uploadedFile: File | null;
  selectedRetailer: string;
  selectedPlacement: string;
  retailerName: string;
  placementName: string;

  // Actions
  setAnalysis: (analysis: AIAnalysisResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUploadContext: (context: {
    file: File;
    retailerId: string;
    placementId: string;
    retailerName: string;
    placementName: string;
  }) => void;
  clearAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analysis: null,
  isLoading: false,
  error: null,
  uploadedFile: null,
  selectedRetailer: '',
  selectedPlacement: '',
  retailerName: '',
  placementName: '',

  setAnalysis: (analysis) => set({ analysis, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setUploadContext: (context) =>
    set({
      uploadedFile: context.file,
      selectedRetailer: context.retailerId,
      selectedPlacement: context.placementId,
      retailerName: context.retailerName,
      placementName: context.placementName,
    }),
  clearAnalysis: () =>
    set({
      analysis: null,
      uploadedFile: null,
      selectedRetailer: '',
      selectedPlacement: '',
      retailerName: '',
      placementName: '',
      error: null,
    }),
}));
