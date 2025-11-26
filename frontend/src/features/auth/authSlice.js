// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getMe,
  googleLogin,
} from "../../services/authService";
import {
  getTokenFromStorage as getToken,
  setTokenToStorage as setToken,
  removeTokenFromStorage as removeToken,
} from "../../utils/tokenHelper";

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
  loading: false, // ✅ added
  error: null,
};

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await loginUser(data); // res should have user and token
    setToken(res.token); // store token in localStorage
    return { user: res.user, token: res.token }; // return both
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
  return null;
});

export const googleAuth = createAsyncThunk(
  "auth/googleAuth",
  async (token, thunkAPI) => {
    try {
      const res = await googleLogin(token);
      setToken(res.token);
      return { user: res.user, token: res.token };
    } catch (err) {
      return thunkAPI.rejectWithValue("Google login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // LOGIN
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "succeeded";
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        setToken(action.payload.token); // keep token in localStorage and in state
      })

      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // GOOGLE LOGIN
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // REGISTER
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // FETCH ME
      .addCase(fetchMe.pending, (state) => {
        state.loading = true; // ✅ added
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.loading = false; // ✅ added
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false; // ✅ added
        state.error = action.payload;
        state.user = null;
        removeToken();
        localStorage.removeItem("user");
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
        state.loading = false;
        state.error = null;
        removeToken();
        localStorage.removeItem("user");
      });
  },
});

export default authSlice.reducer;
