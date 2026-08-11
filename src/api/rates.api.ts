import { mockBackendEngine } from './mockEngine';
import { ApiResponse, LiveRate } from '../types';

export const ratesApi = {
  getLiveRate: async (): Promise<ApiResponse<LiveRate>> => {
    return mockBackendEngine.getLiveRate();
  },

  subscribeToRateChanges: (callback: (rate: LiveRate) => void): (() => void) => {
    return mockBackendEngine.subscribeToRateChanges(callback);
  },

  triggerRateUpdate: (newRate: number) => {
    mockBackendEngine.triggerRateUpdate(newRate);
  },
};
