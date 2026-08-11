import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requirementsApi } from '../api/requirements.api';

export const useRequirements = () => {
  return useQuery({
    queryKey: ['requirements'],
    queryFn: async () => {
      const res = await requirementsApi.getRequirements();
      if (!res.success) throw new Error(res.error || 'Failed to fetch requirements');
      return res.data;
    },
  });
};

export const useCreateRequirementMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      shopId: number;
      chickenType: string;
      expectedKg: number;
      fromDate: string;
      toDate: string;
      notes?: string;
    }) => {
      const res = await requirementsApi.addRequirement(payload);
      if (!res.success) throw new Error(res.error || 'Failed to save expected requirement');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
    },
  });
};
