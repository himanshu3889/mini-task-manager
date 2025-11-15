import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/client';
import { User } from '../../types/task';
import { signup, login } from '../actions/authActions';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Load auth state from localStorage on initialization
const loadAuthFromStorage = (): AuthState => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('accessToken');
  
  if (storedUser && storedToken) {
    try {
      const user = JSON.parse(storedUser);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      return {
        user,
        token: storedToken,
        loading: false,
        error: null,
        isAuthenticated: true,
      };
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
  }
  
  return initialState;
};

// Initialize with stored auth if available
const initialAuthState = loadAuthFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    logout: (state: AuthState) => {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete apiClient.defaults.headers.common['Authorization'];
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state: AuthState) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state: AuthState, action: PayloadAction<{ user: User; tokens: { access: string; refresh: string } }>) => {
        state.loading = false;
        const { user, tokens } = action.payload;
        state.user = user;
        state.token = tokens.access;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
      })
      .addCase(signup.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Signup failed';
      })
      // Login
      .addCase(login.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state: AuthState, action: PayloadAction<{ user: User; tokens: { access: string; refresh: string } }>) => {
        state.loading = false;
        const { user, tokens } = action.payload;
        state.user = user;
        state.token = tokens.access;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
      })
      .addCase(login.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
