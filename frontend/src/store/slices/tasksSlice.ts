import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types/task';
import { fetchTasks, createTask, updateTask, deleteTask } from '../actions/tasksActions';

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state: TasksState) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state: TasksState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state: TasksState, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state: TasksState, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch tasks';
      })
      // Create task
      .addCase(createTask.pending, (state: TasksState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state: TasksState, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state: TasksState, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to create task';
      })
      // Update task
      .addCase(updateTask.pending, (state: TasksState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state: TasksState, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state: TasksState, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to update task';
      })
      // Delete task
      .addCase(deleteTask.pending, (state: TasksState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state: TasksState, action: PayloadAction<number>) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state: TasksState, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to delete task';
      });
  },
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
