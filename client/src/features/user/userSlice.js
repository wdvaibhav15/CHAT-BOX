// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import api from "../../api/axios.js";
// import toast from "react-hot-toast";

// const initialState = {
//     value: null
// }

// // get user data
// export const fetchUser = createAsyncThunk("user/fetchuser", async () => {
//     const { data } = await api.get("/api/user/data", {
//         headers:{Authorization: `Bearer ${token}`}
//     })
//     return data.success ? data.user : null
// })

// // update user data
// export const updateuser = createAsyncThunk("user/update", async ({userData, token}) => {
//     const { data } = await api.post("/api/user/update", userData, {
//         headers:{Authorization: `Bearer ${token}`}
//     })
//      if(data.success){
//         toast.success(data.message);
//         return data.user;
//      }else{
//         toast.error(data.message);
//         return null
//      }
// })

// const userSlice = createSlice({
//     name: "user",
//     initialState,
//     reducers:{

//     },
//     extraReducers: (builder) => {
//         builder.addCase(fetchUser.fulfilled, (state, action) => {
//             state.value = action.payload
//         })
//         builder.addCase(updateuser.fulfilled, (state, action) => {
//             state.value = action.payload
//         })
//     }
// })

// export default userSlice.reducer

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";
import toast from "react-hot-toast";

const initialState = {
  value: null,
};

// Get user data
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.success ? data.user : null;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update user data
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userData, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/user/update", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        toast.success(data.message);
        return data.user;
      }

      toast.error(data.message);
      return rejectWithValue(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.value = action.payload;
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.value = action.payload;
    });
  },
});

export default userSlice.reducer;