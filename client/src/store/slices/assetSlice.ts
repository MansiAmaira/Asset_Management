import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Asset, InsertAsset, PaginatedResponse } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface AssetState {
  assets: Asset[];
  paginatedAssets: PaginatedResponse<Asset> | null;
  loading: boolean;
  error: string | null;
  filters: {
    assetType: string;
    status: string;
    serialNumber: string;
    assignedEmployee: string;
  };
}

const initialState: AssetState = {
  assets: [],
  paginatedAssets: null,
  loading: false,
  error: null,
  filters: {
    assetType: '',
    status: '',
    serialNumber: '',
    assignedEmployee: '',
  },
};

export const fetchAssets = createAsyncThunk(
  'assets/fetchAll',
  async () => {
    const response = await fetch('/api/assets');
    if (!response.ok) throw new Error('Failed to fetch assets');
    return response.json() as Promise<Asset[]>;
  }
);

export const fetchAssetsPaginated = createAsyncThunk(
  'assets/fetchPaginated',
  async ({ page = 0, size = 10, sortBy = 'id', sortDir = 'ASC' }: { 
    page?: number; 
    size?: number; 
    sortBy?: string; 
    sortDir?: string;
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });
    const response = await fetch(`/api/assets/paginated?${params}`);
    if (!response.ok) throw new Error('Failed to fetch paginated assets');
    return response.json() as Promise<PaginatedResponse<Asset>>;
  }
);

export const createAsset = createAsyncThunk(
  'assets/create',
  async (asset: InsertAsset) => {
    return await apiRequest<Asset>('POST', '/api/assets', asset);
  }
);

export const updateAsset = createAsyncThunk(
  'assets/update',
  async ({ id, data }: { id: number; data: InsertAsset }) => {
    return await apiRequest<Asset>('PUT', `/api/assets/${id}`, data);
  }
);

export const deleteAsset = createAsyncThunk(
  'assets/delete',
  async (id: number) => {
    await apiRequest('DELETE', `/api/assets/${id}`);
    return id;
  }
);

const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        assetType: '',
        status: '',
        serialNumber: '',
        assignedEmployee: '',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = action.payload;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch assets';
      })
      .addCase(fetchAssetsPaginated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetsPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.paginatedAssets = action.payload;
      })
      .addCase(fetchAssetsPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch paginated assets';
      })
      .addCase(createAsset.fulfilled, (state, action) => {
        state.assets.push(action.payload);
      })
      .addCase(updateAsset.fulfilled, (state, action) => {
        const index = state.assets.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.assets[index] = action.payload;
        }
      })
      .addCase(deleteAsset.fulfilled, (state, action) => {
        state.assets = state.assets.filter(a => a.id !== action.payload);
      });
  },
});

export const { setFilters, clearFilters } = assetSlice.actions;
export default assetSlice.reducer;
