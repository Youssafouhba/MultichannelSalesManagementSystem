import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Select,
  Textarea,
} from "@windmill/react-ui";
import axios from "axios";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { AddIcon, HomeIcon, PublishIcon, StoreIcon } from "../icons";
import { useAuth } from "../security/Authentification";
import { ProductService } from "../service/ProductService"; // Ensure this path is correct

import { CLOUDINARY_URL, UPLOAD_PRESET } from "../constant/GlobalsVeriables";

const FormTitle = ({ children }) => {
  return (
    <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
      {children}
    </h2>
  );
};

const AddProduct = () => {
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    size: "",
    quantityInStock: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const Auth = useAuth();
  const token = Auth.getToken();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      alert("You can only upload a maximum of 3 images.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const uploadImagesToCloudinary = async () => {
    if (images.length === 0) {
      throw new Error('Please select at least one image.');
    }

    try {
      const uploadedUrls = await Promise.all(
        images.map(async (image) => {
          const formData = new FormData();
          formData.append('file', image);
          formData.append('upload_preset', UPLOAD_PRESET);

          const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          return response.data.secure_url;
        })
      );

      console.log('All images uploaded successfully');
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images to Cloudinary:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const imageUrls = await uploadImagesToCloudinary();
      const newProduct = { ...product, imageUrls };

      await ProductService.AddProduct(newProduct, token);

      console.log("Product saved:", newProduct);

      // Reset form
     /* setProduct({
        name: "",
        price: "",
        size: "",
        quantity: "",
        description: "",
        category: "",
      });
      setImages([]);*/
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageTitle>Add New Product</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Add new Product</p>
      </div>

      <div className="w-full mt-8 grid gap-4 grid-col md:grid-cols-3 ">
        <Card className="row-span-2 md:col-span-2">
          <CardBody>
            <form onSubmit={handleSubmit}>
              <FormTitle>Product Images (1 to 3)</FormTitle>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4 text-gray-800 dark:text-gray-300"
              />
              {images.length > 0 && (
                <div className="mb-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index}`}
                      className="w-20 h-20 mr-2 mb-2"
                    />
                  ))}
                </div>
              )}

              <FormTitle>Product Title</FormTitle>
              <Label>
                <Input
                  name="name"
                  className="mb-4"
                  placeholder="Type product title here"
                  value={product.title}
                  onChange={handleInputChange}
                  required
                />
              </Label>

              <FormTitle>Product Price</FormTitle>
              <Label>
                <Input
                  name="price"
                  className="mb-4"
                  placeholder="Enter product price here"
                  value={product.price}
                  onChange={handleInputChange}
                  required
                />
              </Label>

              <FormTitle>Product Size</FormTitle>
              <Label>
                <Input
                  name="size"
                  className="mb-4"
                  placeholder="Enter product size here"
                  value={product.size}
                  onChange={handleInputChange}
                  required
                />
              </Label>

              <FormTitle>Stock Quantity</FormTitle>
              <Label>
                <Input
                  name="quantity"
                  className="mb-4"
                  placeholder="Enter product stock quantity"
                  value={product.quantity}
                  onChange={handleInputChange}
                  required
                />
              </Label>

              <FormTitle>Description</FormTitle>
              <Label>
                <Textarea
                  name="description"
                  className="mb-4"
                  rows="5"
                  placeholder="Enter product full description here"
                  value={product.description}
                  onChange={handleInputChange}
                  required
                />
              </Label>

              <FormTitle>Select Product Category</FormTitle>
              <Label>
                <Select
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  className="mb-4"
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="Ceiling Light Fixtures">Ceiling Light Fixtures</option>
                  <option value="Lighting Fixtures">Lighting Fixtures</option>
                  <option value="Light Ropes & Strings">Light Ropes & Strings</option>
                </Select>
              </Label>

              <div className="w-full">
                <Button type="submit" size="large" iconLeft={AddIcon} disabled={loading}>
                  {loading ? "Adding..." : "Add Product"}
                </Button>
              </div>
              {error && <p className="mt-2 text-red-600">{error}</p>}
            </form>
          </CardBody>
        </Card>

        <Card className="h-48">
          <CardBody>
            <div className="flex mb-8">
              <Button layout="primary" className="mr-3" iconLeft={PublishIcon}>
                Publish
              </Button>
              <Button layout="link" iconLeft={StoreIcon}>
                Save as Draft
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
