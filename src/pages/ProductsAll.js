import {
  Avatar,
  Textarea,
  Badge,
  Button,
  Card,
  Input,
  CardBody,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow
} from "@windmill/react-ui";
import React, { useContext,useMemo, useEffect, useState } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { AppDataContext } from '../context/AppDataContext';
import { EditIcon, EyeIcon, GridViewIcon, HomeIcon, ListViewIcon, TrashIcon } from "../icons";
import { useAuth } from "../security/Authentification";
import { ProductService } from "../service/ProductService";
import UpdateProduct from "./UpdateProduct";
import StarRating from "../components/StarRating"
import ProductCard from "../components/ProductCard";
const ProductsAll = () => {
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [filter, setFilter] = useState("all");
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState(null);
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);
  const Auth = useAuth();
  const token = Auth.getToken();
  const history = useHistory();
  const { products, loading, error } = useContext(AppDataContext);
  function onPageChange(p) {
    setPage(p);
  }

  function modify(product) {
    history.push(`/app/product/${product.id}`);
  }
  const filteredProducts = useMemo(() => {
    if (loading || error) return [];

    return products.filter(product => {
      const categoryMatch = filter === "all" || product.category === filter;
      const optionMatch = !selectedOption || 
        (selectedOption === "newDesign" && product.isNew) ||
        (selectedOption === "bestSeller" && product.isBestSeller);
      
      return categoryMatch && optionMatch;
    });
  }, [products, loading, error, filter, selectedOption]);

  useEffect(() => {
    if (!loading && !error) {
      const total = filteredProducts.length;
      setTotalResults(total);

      const startIndex = (page - 1) * resultsPerPage;
      const pageData = filteredProducts.slice(startIndex, startIndex + resultsPerPage);
      setData(pageData);
    }
  }, [filteredProducts, page, resultsPerPage, loading, error]);


  async function openModal(productId) {
    let product = await data.find((product) => product.id === productId);
    setSelectedDeleteProduct(product);
    setIsModalOpen(true);
  }

  const handleEdit = (product) => {
    setSelectedEditProduct(product);
    setIsAddAdminModalOpen(true);
  };

  
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (product) => {
    setIsLoading(true);
    try {
      await ProductService.UpdateProduct(product, token);
      closeModal();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

const handleDelete = (product) => {
    setSelectedDeleteProduct(product);
    setIsModalOpen(true);
};



  function closeModal() {
    setIsModalOpen(false);
    setIsAddAdminModalOpen(false);
    setSelectedEditProduct(null);
  }

  async function DeleteHandler() {
    try {
      closeModal();
      await ProductService.DeleteProduct(selectedDeleteProduct.id, token);
    } catch (error) {
      // Handle error
    }
  }

  const handleChangeView = () => {
    setView(view === "list" ? "grid" : "list");
  };

  const handleFilter = (filter_name) => {
    setFilter(filter_name === "All" ? "all" : filter_name);
  }

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
  };

  

  return (
    <div className="space-y-5">
      <PageTitle>All Products</PageTitle>
      {/* Breadcrumb */}
          <nav className="flex text-gray-800 dark:text-gray-300">
            <NavLink exact to="/app/dashboard" className="flex items-center text-blue-600">
              <Icon className="w-5 h-5 mr-2" aria-hidden="true" icon={HomeIcon} />
              Dashboard
            </NavLink>
            <span className="mx-2">{'>'}</span>
            <span>All Products</span>
          </nav>
      {/* Filter Card */}
      <Card className="shadow-md">
      <CardBody>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">All Products</span>
            
            {/* Radio Buttons */}
            <div className="flex space-x-4">
              {['newDesign', 'bestSeller'].map((option) => (
                <Label key={option} radio className="flex items-center">
                  <Input
                    type="radio"
                    name="productType"
                    value={option}
                    checked={selectedOption === option}
                    onChange={handleOptionChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
                    {option === 'newDesign' ? 'New Design' : 'Best Seller'}
                  </span>
                </Label>
              ))}
            </div>
            
            {/* Category Filter */}
            <Select className="py-3" onChange={(e) => handleFilter(e.target.value)}>
              <option>All</option>
              {['LED Ceiling Panel', 'LED Strip Lighting', 'Led Profiles', 'Suspended Ceiling & Metal Grid'].map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
            
            {/* Results Per Page Input */}
            <Label className="relative text-gray-500 focus-within:text-blue-600 dark:focus-within:text-blue-400">
              <input
                className="py-3 pr-20 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:shadow-outline-blue dark:focus:shadow-outline-gray form-input"
                placeholder="Number of Results"
                value={resultsPerPage}
                onChange={(e) => setResultsPerPage(e.target.value)}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                Results on {view}
              </span>
            </Label>
          </div>
          
          {/* View Toggle Button */}
          <Button
            icon={view === "list" ? ListViewIcon : GridViewIcon}
            className="p-2"
            aria-label="Toggle View"
            onClick={handleChangeView}
          />
        </div>
      </CardBody>
      </Card>


      {/* Edit Product Modal */}
      <UpdateProduct
        isAddAdminModalOpen={isAddAdminModalOpen}
        product={selectedEditProduct}
        onClose={closeModal}
        onUpdate={handleUpdate}
        isLoading={isLoading}
      />
      {/* Delete Product Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="flex items-center">
          <Icon icon={TrashIcon} className="w-6 h-6 mr-3" />
          Delete Product
        </ModalHeader>
        <ModalBody>
          Make sure you want to delete product{" "}
          {selectedDeleteProduct && `"${selectedDeleteProduct.name}"`}
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={DeleteHandler}>Delete</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={DeleteHandler}>
              Delete
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {view === "list" ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Name</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>QTY</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Action</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {data.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Avatar
                        className="hidden mr-4 md:block"
                        src={product.imageUrls[0] ? product.imageUrls[0].url : null}
                        alt="Product image"
                      />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge type={product.quantityInStock > 10 ? "success" : "danger"}>
                      {product.quantityInStock > 10 ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{product.quantityInStock}</TableCell>
                  <TableCell className="text-sm">{product.price}</TableCell>
                  <TableCell className="text-sm">{product.price}</TableCell>
                  <TableCell>
                    <div className="flex">
                      <Button
                        icon={EyeIcon}
                        className="mr-3"
                        aria-label="Preview"
                        onClick={() => modify(product)}
                      />
                      <Button
                        icon={EditIcon}
                        className="mr-3"
                        layout="outline"
                        aria-label="Edit"
                        onClick={() => {
                          setSelectedEditProduct(product);
                          setIsAddAdminModalOpen(true);
                        }}
                      />
                      <Button
                        icon={TrashIcon}
                        layout="outline"
                        onClick={() => openModal(product.id)}
                        aria-label="Delete"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              label="Table navigation"
              onChange={onPageChange}
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
          {data.map((product) => (
             <ProductCard 
                    key={product.id} 
                    product={product} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                />
          ))}
        </div>
      )}
      <Pagination
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        label="Table navigation"
        onChange={onPageChange}
      />
    </div>
  );
};

export default ProductsAll;
