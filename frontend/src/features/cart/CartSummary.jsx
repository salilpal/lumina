// src/features/cart/CartSummary.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";

const CartSummary = () => {
  const cartItems = useSelector((state) => state.cart.items);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <div className="bg-white p-4 rounded shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Cart Summary</h2>
      <p>Total Items: {totalItems}</p>
      <p>Total Price: {formatCurrency(totalPrice)}</p>
      <Link
        to="/checkout"
        className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default CartSummary;
