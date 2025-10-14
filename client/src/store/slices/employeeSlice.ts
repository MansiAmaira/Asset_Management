import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Employee, InsertEmployee } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async () => {
    const response = await fetch('/api/employees');
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json() as Promise<Employee[]>;
  }
);

export const createEmployee = createAsyncThunk(
  'employees/create',
  async (employee: InsertEmployee) => {
    return await apiRequest<Employee>('POST', '/api/employees', employee);
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }: { id: number; data: InsertEmployee }) => {
    return await apiRequest<Employee>('PUT', `/api/employees/${id}`, data);
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id: number) => {
    await apiRequest('DELETE', `/api/employees/${id}`);
    return id;
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(e => e.id !== action.payload);
      });
  },
});

export default employeeSlice.reducer;
