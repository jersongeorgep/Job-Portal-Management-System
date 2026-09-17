import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import jobReducer from '../features/jobs/jobSlice';
import categoryReducer from '../features/categories/categorySlice';
import applicationReducer from '../features/applications/applicationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    categories: categoryReducer,
    applications: applicationReducer,
  },
});

export default store;