import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AssignmentHistory, AssignmentRequest, ReturnRequest } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface AssignmentState {
  assignments: AssignmentHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: AssignmentState = {
  assignments: [],
  loading: false,
  error: null,
};

export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAll',
  async () => {
    const response = await fetch('/api/assignments');
    if (!response.ok) throw new Error('Failed to fetch assignments');
    return response.json() as Promise<AssignmentHistory[]>;
  }
);

export const assignAsset = createAsyncThunk(
  'assignments/assign',
  async (request: AssignmentRequest) => {
    return await apiRequest<AssignmentHistory>('POST', '/api/assignments/assign', request);
  }
);

export const returnAsset = createAsyncThunk(
  'assignments/return',
  async ({ assignmentId, notes }: { assignmentId: number; notes?: string }) => {
    return await apiRequest<AssignmentHistory>('PUT', `/api/assignments/return/${assignmentId}`, { notes });
  }
);

export const fetchAssetHistory = createAsyncThunk(
  'assignments/fetchAssetHistory',
  async (assetId: number) => {
    const response = await fetch(`/api/assignments/asset/${assetId}`);
    if (!response.ok) throw new Error('Failed to fetch asset history');
    return response.json() as Promise<AssignmentHistory[]>;
  }
);

export const fetchEmployeeHistory = createAsyncThunk(
  'assignments/fetchEmployeeHistory',
  async (employeeId: number) => {
    const response = await fetch(`/api/assignments/employee/${employeeId}`);
    if (!response.ok) throw new Error('Failed to fetch employee history');
    return response.json() as Promise<AssignmentHistory[]>;
  }
);

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch assignments';
      })
      .addCase(assignAsset.fulfilled, (state, action) => {
        state.assignments.unshift(action.payload);
      })
      .addCase(returnAsset.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
      });
  },
});

export default assignmentSlice.reducer;
