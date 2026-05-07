import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getMe,
} from "../../services/authService"; // Removed googleLogin import
import {
  getTokenFromStorage as getToken,
  setTokenToStorage as setToken,
  removeTokenFromStorage as removeToken,
} from "../../utils/tokenHelper";

// Initial user load logic
let storedUser = null;
try {
  const userData = localStorage.getItem("user");
  if (userData && userData !== "undefined") {
    storedUser = JSON.parse(userData);
  }
} catch (e) {
  console.error("Failed to parse user from localStorage", e);
  localStorage.removeItem("user");
}

const initialState = {
  user: storedUser,
  token: getToken(),
  status: "idle",
  loading: false,
  error: null,
};

// --- Async Thunks ---

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await loginUser(data); 
    setToken(res.token); 
    return { user: res.user, token: res.token }; 
  } catch (err) {
    const message =
      err.response?.data?.message || "Login failed. Please try again.";
    return thunkAPI.rejectWithValue(message);
  }
});

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await registerUser(data);
      setToken(res.token);
      return res.user;
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, thunkAPI) => {
  try {
    const res = await getMe();
    return res;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to fetch user data");
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  removeToken();
  localStorage.removeItem("user");
  return null;
});

// REMOVED: googleAuth AsyncThunk

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "succeeded";
        state.loading = false;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVED: googleAuth builders

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.loading = false;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ME
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.loading = false;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        removeToken();
        localStorage.removeItem("user");
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.loading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;