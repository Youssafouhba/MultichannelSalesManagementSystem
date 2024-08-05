import {
  Avatar,
  Badge,
  Button,
  Card,
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
  TableRow,
} from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import {
  EditIcon,
  EyeIcon,
  GridViewIcon,
  HomeIcon,
  ListViewIcon,
  TrashIcon,
} from "../icons";
import { useAuth } from "../security/Authentification";
import { ProductService } from "../service/ProductService";

const ProductsAll = () => {
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Auth = useAuth();
  const token = Auth.getToken();
  const history = useHistory();

  function onPageChange(p) {
    setPage(p);
  }

  function modify(product) {
    history.push(`/app/product/${product.id}`);
  }

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const response = await ProductService.getAllProducts(token);
        let products = response.data;
        setTotalResults(products.length);
        setData(
          products.slice((page - 1) * resultsPerPage, page * resultsPerPage)
        );
      } catch (err) {
        setError("Failed to fetch Products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [page, resultsPerPage, token]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState(null);
  async function openModal(productId) {
    let product = await data.filter((product) => product.id === productId)[0];
    setSelectedDeleteProduct(product);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function DeleteHandler() {
    console.log("delete")
    try {
      closeModal();
      await ProductService.DeleteProduct(selectedDeleteProduct.id, token);
      // Refresh product list after deletion
      const response = await ProductService.getAllProducts(token);
      let products = response.data;
      setTotalResults(products.length);
      setData(
        products.slice((page - 1) * resultsPerPage, page * resultsPerPage)
      );
      
    } catch (error) {
      setError("Failed to delete product");
    }
  }

  const handleChangeView = () => {
    setView(view === "list" ? "grid" : "list");
  };

  return (
    <div>
      <PageTitle>All Products</PageTitle>

      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">All Products</p>
      </div>

      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All Products
              </p>

              <Label className="mx-3">
                <Select className="py-3">
                  <option>Sort by</option>
                  <option>Asc</option>
                  <option>Desc</option>
                </Select>
              </Label>

              <Label className="mx-3">
                <Select className="py-3">
                  <option>Filter by Category</option>
                  <option>Electronics</option>
                  <option>Cloths</option>
                  <option>Mobile Accessories</option>
                </Select>
              </Label>

              <Label className="mr-8">
                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                  <input
                    className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                    placeholder="Number of Results"
                    value={resultsPerPage}
                    onChange={(e) => setResultsPerPage(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                    Results on {`${view}`}
                  </div>
                </div>
              </Label>
            </div>
            <div className="">
              <Button
                icon={view === "list" ? ListViewIcon : GridViewIcon}
                className="p-2"
                aria-label="Edit"
                onClick={handleChangeView}
              />
            </div>
          </div>
        </CardBody>
      </Card>

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
                  <TableCell className="text-sm">
                    {/* Insert rating component or function */}
                  </TableCell>
                  <TableCell className="text-sm">{product.quantityInStock}</TableCell>
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
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
          {data.map((product) => (
            <div key={product.id}>
              <Card>
                <img
                  className="object-cover w-full"
                  src={product.imageUrls[0] ? product.imageUrls[0].url : null}
                  alt="product"
                />
                <CardBody>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-semibold truncate text-gray-600 dark:text-gray-300">
                      {product.name}
                    </p>
                    <Badge
                      type={product.quantityInStock > 10 ? "success" : "danger"}
                      className="whitespace-nowrap"
                    >
                      <p className="break-normal">
                        {product.quantityInStock > 10 ? `In Stock` : "Out of Stock"}
                      </p>
                    </Badge>
                  </div>

                  <p className="mb-2 text-purple-500 font-bold text-lg">
                    £{product.price}
                  </p>

                  <p className="mb-8 text-gray-600 dark:text-gray-400">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Link to={`/app/product/${product.id}`}>
                      <Button
                        icon={EyeIcon}
                        className="mr-3"
                        aria-label="Preview"
                        size="small"
                      />
                    </Link>
                    <Button
                      icon={EditIcon}
                      className="mr-3"
                      layout="outline"
                      aria-label="Edit"
                      size="small"
                    />
                    <Button
                      icon={TrashIcon}
                      layout="outline"
                      aria-label="Delete"
                      onClick={() => openModal(product.id)}
                      size="small"
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
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