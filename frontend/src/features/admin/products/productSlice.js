import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../../services/productService";

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}) => {
    return await productService.getAll(params);
  }
);

// Fetch a single product
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id) => {
    return await productService.getById(id);
  }
);

// Create a product
export const createProduct = createAsyncThunk(
  "products/create",
  async (data) => {
    return await productService.create(data);
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  await productService.remove(id);
  return id;
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch one
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload;
      })

      // Create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export default productSlice.reducer;
