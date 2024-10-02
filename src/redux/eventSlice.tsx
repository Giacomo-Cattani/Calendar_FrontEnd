// src/redux/eventSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Event {
    title: string;
    start: Date;
    end: Date;
}

interface EventState {
    events: Event[];
}

const initialState: EventState = {
    events: [],
};

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents(state, action: PayloadAction<Event[]>) {
            state.events = action.payload;
        },
        addEvent(state, action: PayloadAction<Event>) {
            state.events.push(action.payload);
        },
        clearEvents(state) {
            state.events = [];
        },
    },
});

export const { setEvents, addEvent, clearEvents } = eventSlice.actions;

export default eventSlice.reducer;
