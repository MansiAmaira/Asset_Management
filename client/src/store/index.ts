import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './slices/employeeSlice';
import assetReducer from './slices/assetSlice';
import assignmentReducer from './slices/assignmentSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    assets: assetReducer,
    assignments: assignmentReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
