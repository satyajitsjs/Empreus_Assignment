import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    getCartData();
  }, []);

  const getCartData = () => {
    axios
      .get("http://localhost:8000/api/cart")
      .then((response) => setCartData(response.data.data))
      .catch((error) => console.error("Error fetching cart data:", error));
  };

  const addToCartPlus = (productId) => {
    axios
      .post("http://localhost:8000/api/cart", {
        product_id: productId,
        quantity: 1,
      })
      .then(() => getCartData())
      .catch((error) => console.error("Error adding item to cart:", error));
  };

  const addToCartMinus = (productId) => {
    axios
      .post(`http://localhost:8000/api/adjust_cart/${productId}`, {
        action: "remove",
        quantity: 1,
      })
      .then(() => {
        getCartData();
      })
      .catch((error) => console.error("Error removing item from cart:", error));
  };

  const removeProduct = (id) => {
    axios
      .delete(`http://localhost:8000/api/cart/${id}`)
      .then((response) => {
        toast(response.data.message,{
          autoClose: 2000,
          theme: "light",
        })
        getCartData();
      })
      .catch((error) =>
        console.error("Error removing product from cart:", error)
      );
  };

  const handleQuantityChange = (productId, newQuantity) => {
    axios
      .post(`http://localhost:8000/api/cart/${productId}`, {
        action: "adjust",
        quantity: newQuantity,
      })
      .then(() => {
        toast.success("Quantity updated");
        getCartData();
      })
      .catch((error) => console.error("Error adjusting quantity:", error));
  };

  return (
    <>
      <ToastContainer />
      <Header />
      <div className="container mx-auto mt-10">
      <h1 className="font-semibold text-2xl text-gray-50">Shopping Cart</h1>
        <div className="w-full shadow-md my-10 flex-wrap rounded-lg">
          <div className="bg-white px-10 py-1 rounded-lg">
            <div className="flex justify-between border-b pb-8">
            </div>
            <div className="flex flex-wrap mt-10 mb-5">
              <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">
                Product Details
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">
                Quantity
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">
                Price
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">
                Total
              </h3>
            </div>
            {cartData.map((cartItem) => (
              <div
                className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5"
                key={cartItem.id}
              >
                <div className="flex w-2/5">
                  <div className="w-48">
                    <img
                      className="h-24"
                      
                      src={`http://localhost:8000/${cartItem?.product.image}`}
                      alt={cartItem?.product.name}
                    />
                  </div>
                  <div className="flex flex-col justify-between ml-4 flex-grow">
                    <span className="font-bold text-sm">
                      {cartItem?.product.name}
                    </span>
                    <span className="text-red-500 text-xs capitalize">
                      {cartItem?.product.description}
                    </span>
                    <div
                      className="font-semibold hover:text-red-500 text-gray-500 text-xs cursor-pointer"
                      onClick={() => removeProduct(cartItem?.id)}
                    >
                      Remove
                    </div>
                  </div>
                </div>
                <div className="flex justify-center w-1/5">
                  <svg
                    className="fill-current text-gray-600 w-3 cursor-pointer"
                    viewBox="0 0 448 512"
                    onClick={() => addToCartMinus(cartItem?.product.id)}
                  >
                    <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                  </svg>

                  <input
                    className="mx-2 border text-center w-8"
                    type="text"
                    value={cartItem?.quantity}
                    onChange={(e) =>
                      handleQuantityChange(cartItem?.product.id, e.target.value)
                    }
                  />
                  <svg
                    className="fill-current text-gray-600 w-3 cursor-pointer"
                    viewBox="0 0 448 512"
                    onClick={() => addToCartPlus(cartItem?.product.id)}
                  >
                    <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                  </svg>
                </div>
                <span className="text-center w-1/5 font-semibold text-sm">
                  ${cartItem?.product.price}
                </span>
                <span className="text-center w-1/5 font-semibold text-sm">
                  ${(cartItem?.product.price * cartItem?.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
