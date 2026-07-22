// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import api from "../../api/axios";

// const initialState = {
//     messages: []
// }

// export const fetchMessages = createAsyncThunk("messages/fetchMessages", 
//     async ({token, userId}) => {
//         const { data } = await api.get("/api/message/get", {to_user_id: userId },{
//            headers: {
//             Authorization: `Bearer ${token}`
//            } 
//         })
//        // return data.success ? data.connections : null
//        return data.success ? data : null
//     })

// const messagesSlice = createSlice({
//     name: "messages",
//     initialState,
//     reducers:{
//         setMessages: (state, action) => {
//             state.messages = action.payload;
//         },
//         addMessage: (state, action) => {
//             state.messages = [...state.messages, action.payload];
//         },
//         resetMessages: (state) => {
//             state.messages = [];
//         }
//     },
//     extraReducers: (builder) => {
//         builder.addCase(fetchMessages.fulfilled, (state, action) => {
//             if(action.payload){
//                 state.messages = action.payload.messages;
//             }
//         })
//     }
// })

// export const { setMessages, addMessage, resetMessages } = messagesSlice.actions 

// export default messagesSlice.reducer

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  messages: []
};

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages", 
  async ({ token, userId }) => {
    // Correct Axios GET syntax with route parameter & Auth header
    const { data } = await api.get(`/api/message/get/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      } 
    });
    return data.success ? data : null;
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      // Prevent duplicate messages if already present
      const exists = state.messages.some((msg) => msg._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    resetMessages: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      if (action.payload && action.payload.messages) {
        state.messages = action.payload.messages;
      }
    });
  }
});

export const { setMessages, addMessage, resetMessages } = messagesSlice.actions;

export default messagesSlice.reducer;