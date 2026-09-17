import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const applyForJob = createAsyncThunk(
  'applications/applyForJob',
  async ({ jobId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/jobs/${jobId}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUserApplications = createAsyncThunk(
  'applications/fetchUserApplications',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/user/applications', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUserApplication = createAsyncThunk(
  'applications/fetchUserApplication',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/user/applications/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchAdminApplications = createAsyncThunk(
  'applications/fetchAdminApplications',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/applications', { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchAdminApplication = createAsyncThunk(
  'applications/fetchAdminApplication',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/applications/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/admin/applications/${id}/status`, { status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    items: [],
    currentApplication: null,
    pagination: {},
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyForJob.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to apply';
      })
      .addCase(fetchUserApplications.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchUserApplication.fulfilled, (state, action) => {
        state.currentApplication = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserApplication.pending, (state) => { state.loading = true; })
      .addCase(fetchAdminApplications.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdminApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchAdminApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchAdminApplication.fulfilled, (state, action) => {
        state.currentApplication = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminApplication.pending, (state) => { state.loading = true; })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
        state.loading = false;
        const updated = action.payload.data;
        if (updated) {
          state.items = state.items.map((a) => (a.id === updated.id ? updated : a));
          if (state.currentApplication?.id === updated.id) {
            state.currentApplication = updated;
          }
        }
      })
      .addCase(updateApplicationStatus.pending, (state) => { state.loading = true; })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.error = action.payload?.message;
        state.loading = false;
      });
  },
});

export const { clearMessages, clearCurrentApplication } = applicationSlice.actions;
export default applicationSlice.reducer;