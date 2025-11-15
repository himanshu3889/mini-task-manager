import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import { TaskFormData } from '../../types/task';

// Helper to get auth token and set header
const setAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      setAuthHeader();
      const response = await apiClient.get('/tasks/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: TaskFormData, { rejectWithValue }) => {
    try {
      setAuthHeader();
      const response = await apiClient.post('/tasks/', taskData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }: { id: number; taskData: TaskFormData }, { rejectWithValue }) => {
    try {
      setAuthHeader();
      const response = await apiClient.put(`/tasks/${id}/`, taskData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: number, { rejectWithValue }) => {
    try {
      setAuthHeader();
      await apiClient.delete(`/tasks/${id}/`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
    }
  }
);

