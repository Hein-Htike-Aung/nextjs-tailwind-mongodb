import { createContext, useReducer } from "react";
import Cookies from "js-cookie";

export const Store = createContext();

const initialState = {
  /* 
    cartItems: [
      {
        name: "Free Shirt",
        slug: "free-shirt",
        category: "Shirts",
        image: "/images/shirt1.jpg",
        price: 70,
        brand: "Nike",
        rating: 4.5,
        numReviews: 8,
        countInStock: 20,
        description: "A popular shirt",
        isFeatured: true,
        banner: "/images/banner1.jpg",

        quantity: 1
      }
    ],
    shippingAddress: {
      fullName, 
      address, 
      city, 
      postalCode, 
      country
    }    
    paymentMethod: '' || "PayPal", "Stripe", "CashOnDelivery"
  */
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart"))
    : { cartItems: [], shippingAddress: {}, paymentMethod: "" },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.slug === existItem.slug ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));

      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );

      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));

      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_RESET":
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: "",
        },
      };

    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    case "CART_CLEAR_ITEMS":
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
};
