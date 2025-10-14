import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AssetStatistics, AssetsByType } from '@shared/schema';

interface DashboardState {
  statistics: AssetStatistics | null;
  assetsByType: AssetsByType | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  statistics: null,
  assetsByType: null,
  loading: false,
  error: null,
};

export const fetchStatistics = createAsyncThunk(
  'dashboard/fetchStatistics',
  async () => {
    const response = await fetch('/api/assets/statistics');
    if (!response.ok) throw new Error('Failed to fetch statistics');
    const data = await response.json() as Record<string, number>;
    
    return {
      total: data.total || 0,
      assigned: data.assigned || 0,
      available: data.available || 0,
      underRepair: data.underRepair || data.under_repair || 0,
      retired: data.retired || 0,
      spare: data.spare || 0,
    } as AssetStatistics;
  }
);

export const fetchAssetsByType = createAsyncThunk(
  'dashboard/fetchAssetsByType',
  async () => {
    const response = await fetch('/api/assets/statistics/by-type');
    if (!response.ok) throw new Error('Failed to fetch assets by type');
    return response.json() as Promise<AssetsByType>;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch statistics';
      })
      .addCase(fetchAssetsByType.fulfilled, (state, action) => {
        state.assetsByType = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
