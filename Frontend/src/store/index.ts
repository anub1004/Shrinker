import { configureStore } from '@reduxjs/toolkit';
import shortenReducer from './slices/shortenSlice';

export const store = configureStore({
  reducer: {
    shorten: shortenReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
