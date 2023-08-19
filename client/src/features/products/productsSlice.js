import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialProducts = [
  {
    name: "laptop",
    price: 20000,
    id: "1",
    description:
      "dell g3 3500, Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab vel, amet, earum rerum eum suscipit sequi omnis laudantium tenetur beatae quaerat cumque accusamus debitis vero culpa odio ducimus nam autem?",
    date: new Date().toISOString(),
    count: 0,
    onhand: 3,
    type: "PC",
  },
  {
    name: "Iphone",
    price: 25000,
    id: "2",
    description:
      "Iphone 10 pro X max Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab vel, amet, earum rerum eum suscipit sequi omnis laudantium tenetur beatae quaerat cu",
    date: new Date().toISOString(),
    count: 0,
    onhand: 2,
    type: "phone",
  },
  {
    name: "camera",
    price: 7000,
    id: "3",
    description:
      "good camera, Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab vel, amet, earum rerum eum suscipit sequi omnis laudantium tenetur beatae ",
    date: new Date().toISOString(),
    count: 0,
    onhand: 4,
    type: "camera",
  },
  {
    name: "t-shirt",
    price: 100,
    id: "4",
    description:
      "good shirt, Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab vel, amet, earum rerum eum suscipit sequi omnis laudantium tenetur beatae ",
    date: new Date().toISOString(),
    count: 0,
    onhand: 12,
    type: "t-shirt",
  },
  {
    name: "vaccum cleaner",
    price: 100,
    id: "5",
    description:
      "nice vaccum cleaner, Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab vel, amet, earum rerum eum suscipit sequi omnis laudantium tenetur beatae ",
    date: new Date().toISOString(),
    count: 0,
    onhand: 12,
    type: "vaccum cleaner",
  },
];

const initialState = {
  products: initialProducts,
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await fetch("/api/all-products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data;
  }
);

const productsSlice = createSlice({
  initialState,
  name: "products",
  reducers: {
    productSelected(state, action) {
      const { productId } = action.payload;
      const product = state.products.find(
        (product) => product.id === productId
      );
      if (product) {
        product.selected = true;
      }
    },
    removeProduct(state, action) {
      const { id } = action.payload;
      state = state.products.filter((product) => product.id !== id);
      return state;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "success";
        state.products = [...state.products, ...action.payload.result];
        return state;
      });
  },
});

export const { productAdded, deleteProduct, productSelected, removeProduct } =
  productsSlice.actions;

export default productsSlice.reducer;

export const selectAllProducts = (state) => state.products.products;
export const selectProductById = (state, id) =>
  state.products.products.find((product) => product.id === id);
export const selectProductsByUser = (state, user) =>
  state.products.products.filter((product) => product.seller === user.name);

export const generateId = (state) => {
  const products = state.products.products;
  let max = 0;
  products.forEach((element) => {
    max = max > Number(element.id) ? max : Number(element.id);
  });
  return `${1 + max}`;
};
