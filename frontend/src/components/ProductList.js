import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Header from "./Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const addToCart = (productId) => {
    axios
      .post("http://localhost:8000/api/cart", { product_id: productId , quantity : 1 })
      .then((response) => {
        toast.success(response.data.message,{
          autoClose: 2000,
          theme: "light",
        });
      })
      .catch((error) => console.error("Error adding item to cart:", error));
  };

  return (
    <>
      <ToastContainer />
      <Header />
      <br />
      <div className="grid grid-cols-3 gap-5 ml-4 mr-4">
        {products.map((product) => (
          <Card key={product.id} className="w-full h-auto">
            <CardHeader shadow={false} floated={false} className="h-64">
              <img
                src={`http://localhost:8000/${product.image}`}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </CardHeader>
            <CardBody>
              <div className="mb-2 flex items-center justify-between">
                <Typography color="blue-gray" className="font-medium">
                  {product.name}
                </Typography>
                <Typography color="blue-gray" className="font-medium">
                  ${product.price}
                </Typography>
              </div>
              <Typography
                variant="small"
                color="gray"
                className="font-normal opacity-75"
              >
                {product.description}
              </Typography>
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                ripple={false}
                fullWidth={true}
                onClick={() => addToCart(product.id)}
                className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
