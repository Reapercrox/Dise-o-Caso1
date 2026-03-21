import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../domain/user/authSlice';
import duaReducer from '../domain/dua/duaSlice';
import workflowReducer from '../application/workflow/workflowSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dua: duaReducer,
    workflow: workflowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
