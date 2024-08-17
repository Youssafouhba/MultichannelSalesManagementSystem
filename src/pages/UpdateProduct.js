import {
    Button,
    Input,
    Label,
    Select,
    Textarea,
    Modal,
    ModalBody,
    ModalHeader
  } from "@windmill/react-ui";
  import React, { useEffect, useState } from "react";
  import { useParams, useHistory } from "react-router-dom";
  import { AppDataContext } from "../context/AppDataContext";
  import { ProductService } from "../service/ProductService";
  import { useAuth } from "../security/Authentification";
  import { ClipLoader } from "react-spinners";
  const FormTitle = ({ children }) => (
    <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
      {children}
    </h2>
  );
  
  const UpdateProduct = ({ isAddAdminModalOpen, product, onClose,onUpdate,isLoading }) => {
    const [images, setImages] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [editProductName, setEditProductName] = useState('');
    const [editProductPrice, setEditProductPrice] = useState('');
    const [editProductDescription, setEditProductDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [editProductCategory, setEditProductCategory] = useState('');
    const [error, setError] = useState(null);
    const Auth = useAuth();
    const token = Auth.getToken();
    const history = useHistory();
    const { id } = useParams();
  
    useEffect(() => {
      if (product) {
        setEditProductName(product.name);
        setEditProductPrice(product.price);
        setEditProductDescription(product.description);
        setSelectedOption(product.isNew ? "newDesign" : product.isBestSeller ? "bestSeller" : "");
        setImages(product.imageUrls || []);
      }
    }, [product]);
  
  
    const handleOptionChange = (e) => {
      const value = e.target.value;
      setSelectedOption(value);
    };
  
  
    const closeModal = () => {
      history.push("/app/all-products");
      setError(null)
      setLoading(false);
      onClose();
    };

    const handleUpdate = () => {
      onUpdate({
        id: product.id,
        name: editProductName,
        price: parseFloat(editProductPrice),
        description: editProductDescription,
        category: editProductCategory,
        isNew: selectedOption === "newDesign",
        isBestSeller: selectedOption === "bestSeller",
        imageUrls: product.imageUrls
      });
    };
  
    return (
      <Modal className='bg-gray-100 rounded-lg' style={{ width: "80%", top: 100 }} isOpen={isAddAdminModalOpen} onClose={closeModal}>
        <ModalHeader className="text-center">Edit Product Infos</ModalHeader>
        <ModalBody>
          <div className="flex">
            <div className="flex-1 p-4">
              <div className="flex flex-col gap-4">
                <Label>
                  <span className="text-gray-600 dark:text-gray-400">Product Name</span>
                  <Input
                    className="mt-1"
                    placeholder="Product Name"
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                  />
                </Label>
  
                <Label>
                  <span className="text-gray-600 dark:text-gray-400">Product Price</span>
                  <Input
                    className="mt-1"
                    placeholder="Product Price"
                    type="number"
                    value={editProductPrice}
                    onChange={(e) => setEditProductPrice(e.target.value)}
                  />
                </Label>
  
                <Label>
                  <span className="text-gray-600 dark:text-gray-400">Product Category</span>
                  <Select
                    className="mt-1"
                    value={product?.category || ''}
                    onChange={(e) => setEditProductCategory(e.target.value)}
                  >
                    <option value="LED Ceiling Panel">LED Ceiling Panel</option>
                    <option value="LED Strip Lighting">LED Strip Lighting</option>
                    <option value="Led Profiles">Led Profiles</option>
                    <option value="Suspended Ceiling & Metal Grid">Suspended Ceiling & Metal Grid</option>
                  </Select>
                </Label>
  
                <Label>
                  <span className="text-gray-600 dark:text-gray-400">Product Description</span>
                  <Textarea
                    className="mt-1"
                    placeholder="Product Description"
                    value={editProductDescription}
                    onChange={(e) => setEditProductDescription(e.target.value)}
                    rows="8"
                  />
                </Label>
              </div>
            </div>
            <div className="flex-none w-1/3 p-4 mt-6">
              <FormTitle>Product Type</FormTitle>
              <div className="flex mb-4">
                <Label radio className="flex items-center mr-4">
                  <Input
                    type="radio"
                    name="productType"
                    value="newDesign"
                    checked={selectedOption === "newDesign"}
                    onChange={handleOptionChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">New Design</span>
                </Label>
  
                <Label radio className="flex items-center">
                  <Input
                    type="radio"
                    name="productType"
                    value="bestSeller"
                    checked={selectedOption === "bestSeller"}
                    onChange={handleOptionChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Best Seller</span>
                </Label>
              </div>
              {images.length > 0 && (
                <img
                  src={images[0]?.url}
                  alt="Product"
                  className="object-cover w-full h-full rounded-lg shadow-md"
                  style={{ maxHeight: '300px', maxWidth: '100%' }}
                />
              )}
              <div className="flex justify-center gap-4 mt-5">
              <ClipLoader color="#36D7B7" loading={isLoading} size={35} />
                <Button layout="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  };
  
  export default UpdateProduct;