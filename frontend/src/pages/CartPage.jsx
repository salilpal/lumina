import React from "react";
import { useCart } from "../context/CartContext";
import CartSummary from "../features/cart/CartSummary"; // ✅ Correct

const CartPage = () => {
  const { items } = useCart();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? <p>Your cart is empty.</p> : <CartSummary />}
    </div>
  );
};

export default CartPage;
