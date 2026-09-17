import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const { data } = await api.get(`/jobs?${params.toString()}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchFeaturedJobs = createAsyncThunk(
  'jobs/fetchFeaturedJobs',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/jobs/featured');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchPublicStats = createAsyncThunk(
  'jobs/fetchPublicStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/stats');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchJobBySlug = createAsyncThunk(
  'jobs/fetchJobBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/jobs/${slug}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchAdminJobs = createAsyncThunk(
  'jobs/fetchAdminJobs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const { data } = await api.get(`/admin/jobs?${params.toString()}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/jobs', jobData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, ...jobData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/jobs/${id}`, jobData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/jobs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchAdminJobById = createAsyncThunk(
  'jobs/fetchAdminJobById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/jobs/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],
    featuredItems: [],
    currentJob: null,
    stats: null,
    pagination: {},
    filters: {
      search: '',
      category: '',
      experience_level: '',
      employment_type: '',
      location: '',
      status: '',
      page: 1,
    },
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: action.payload.page || 1 };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '', category: '', experience_level: '',
        employment_type: '', location: '', status: '', page: 1,
      };
    },
    clearCurrentJob: (state) => { state.currentJob = null; },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch jobs';
      })
      .addCase(fetchFeaturedJobs.fulfilled, (state, action) => {
        state.featuredItems = action.payload.data;
      })
      .addCase(fetchPublicStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchJobBySlug.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        state.loading = false;
      })
      .addCase(fetchJobBySlug.pending, (state) => { state.loading = true; })
      .addCase(fetchJobBySlug.rejected, (state) => { state.loading = false; state.error = 'Job not found'; })
      .addCase(fetchAdminJobs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAdminJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchAdminJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch jobs';
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.items = state.items.filter((j) => j.id !== action.payload);
        state.successMessage = 'Job deleted successfully';
      })
      .addCase(fetchAdminJobById.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminJobById.pending, (state) => { state.loading = true; });
  },
});

export const { setFilters, clearFilters, clearCurrentJob, clearMessages } = jobSlice.actions;
export default jobSlice.reducer;