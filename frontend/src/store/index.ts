import { configureStore } from '@reduxjs/toolkit';
import authReducer, { AuthState } from './slices/authSlice';
import tasksReducer, { TasksState } from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
});

// Define RootState type explicitly
export interface RootState {
  auth: AuthState;
  tasks: TasksState;
}

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = typeof store.dispatch;

