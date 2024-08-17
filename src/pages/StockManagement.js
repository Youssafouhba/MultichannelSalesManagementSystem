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
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import {
    EditIcon,
    HomeIcon,
    TrashIcon
} from "../icons";

import { AppDataContext } from "../context/AppDataContext";
import { useAuth } from "../security/Authentification";
import { StockTransactionService } from "../service/StockTransactionService";

const StockManagement = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [resultsPerPage, setResultsPerPage] = useState(10);
    const [totalResults, setTotalResults] = useState(0);
  
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



    useEffect(() => {
            console.log(products)

            setTotalResults(products.length);
            setData(
                products.slice((page - 1) * resultsPerPage, page * resultsPerPage)
            );
    }, [page, resultsPerPage, products]);

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

    const handleActionChange = async (productId, transactionQty, action) => {
        if (action && transactionQty && transactionQty> 0 ) {
            const payload= {
                productId: productId,
                quantity: transactionQty,
                type: action
            }
            if (action ==="New container" || action ==="Returned") {
         //   setError(null);
            try {
                const response = await StockTransactionService.inStockAction(payload,token)
                console.log(response.data);
               
            } catch (err) {
             //   setError(err);
            } finally {
            }
            }
            else if (action === "out") {
                try {
                    const response = await StockTransactionService.outStockAction(payload,token)
                    console.log(response.data);
                   
                } catch (err) {
               //     setError(err);
                } finally {
                }
                
            }
        }
       
        
    };

    return (
        <div>
            <PageTitle>Stock Management</PageTitle>

            <div className="flex text-gray-800 dark:text-gray-300">
                <div className="flex items-center text-purple-600">
                    <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
                    <NavLink exact to="/app/dashboard" className="mx-2">
                        Dashboard
                    </NavLink>
                </div>
                {">"}
                <p className="mx-2">Stock Management</p>
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
                                        onChange={(e) =>setResultsPerPage(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                                    </div>
                                </div>
                            </Label>
                        </div>
                        <div className="">
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
                        <Button >Delete</Button>
                    </div>
                    <div className="block w-full sm:hidden">
                        <Button block size="large" layout="outline" onClick={closeModal}>
                            Cancel
                        </Button>
                    </div>
                    <div className="block w-full sm:hidden">
                        <Button block size="large" >
                            Delete
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>

            <TableContainer className="mb-8">
                <Table>
                    <TableHeader>
                        <tr>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>QTY</TableCell>
                            <TableCell>QTY of Transaction</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell></TableCell>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {data.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="text-sm">{product.id}</TableCell>
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
                                    <Badge type={product.quantityInStock > 0 ? "success" : "danger"}>
                                        {product.quantityInStock > 0 ? "In Stock" : "Out of Stock"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{product.quantityInStock}</TableCell>
                                <TableCell className="text-sm">
                                    <input
                                        type="number"
                                        className="form-input"
                                        onChange={(e) => e.target.value<0?null:product.transactionQty = e.target.value}
                                    />
                                </TableCell>
                                <TableCell className="text-sm">
                                    <Select
                                        onChange={(e) => product.actionType = e.target.value}
                                    >
                                    <option></option>
                                        <option value="out">Out</option>
                                        <option value="New container">New Container</option>
                                        <option value="Returned">Returned</option>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-sm">
                                    <Button
                                                        icon={EditIcon}

                                        onClick={() => handleActionChange(product.id, product.transactionQty, product.actionType)}
                                    >
                                    </Button>
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
        </div>
    );
};

export default StockManagement;
