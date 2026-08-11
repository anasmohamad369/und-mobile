import { mockBackendEngine } from './mockEngine';
import { ApiResponse, Requirement } from '../types';

export const requirementsApi = {
  getRequirements: async (): Promise<ApiResponse<Requirement[]>> => {
    return mockBackendEngine.getRequirements();
  },

  addRequirement: async (payload: {
    shopId: number;
    chickenType: string;
    expectedKg: number;
    fromDate: string;
    toDate: string;
    notes?: string;
  }): Promise<ApiResponse<Requirement>> => {
    return mockBackendEngine.addRequirement(payload);
  },
};
