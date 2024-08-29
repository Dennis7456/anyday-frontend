import { configureStore } from '@reduxjs/toolkit'
import uploadReducer from '../slices/uploadSlice'

const store = configureStore({
  reducer: {
    uploads: uploadReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
