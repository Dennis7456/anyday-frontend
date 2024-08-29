import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FileValue } from 'src/types'

interface FileState extends FileValue {}

interface UploadState {
  files: FileState[]
}

const initialState: UploadState = {
  files: [],
}

const uploadSlice = createSlice({
  name: 'uploads',
  initialState: {
    files: [] as FileValue[],
  },
  reducers: {
    // addFile: (state, action: PayloadAction<{ id: number, file: File }>) => {
    //     const { id, file } = action.payload;
    //     const url = URL.createObjectURL(file);
    //     state.files.push({
    //         id,
    //         name: file.name,
    //         size: file.size,
    //         type: file.type,
    //         file: file,
    //         url
    //     });
    // },
    addFile: (state, action: PayloadAction<FileValue>) => {
      state.files.push(action.payload)
    },
    removeFile: (state, action: PayloadAction<number>) => {
      state.files = state.files.filter((file) => file.id !== action.payload)
    },
    clearFiles: (state) => {
      console.log('clearFiles reducer triggered')
      console.log(state.files)
      state.files = []
    },
  },
})

export const { addFile, removeFile, clearFiles } = uploadSlice.actions
export default uploadSlice.reducer
