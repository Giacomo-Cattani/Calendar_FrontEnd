import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Marks } from '../type'

interface MarkState {
    marks: Marks[];
}

const initialState: MarkState = {
    marks: [], // Initialize marks as an empty array
};

const markSlice = createSlice({
    name: 'marks',
    initialState,
    reducers: {
        setMarks(state, action: PayloadAction<Marks[]>) {
            state.marks = action.payload;
        },
        addMarks(state, action: PayloadAction<Marks>) {
            state.marks.push(action.payload);
        },
        clearMarks(state) {
            state.marks = [];
        },
    },
});

export const { setMarks, addMarks, clearMarks } = markSlice.actions; // Export setMarks

export default markSlice.reducer;
