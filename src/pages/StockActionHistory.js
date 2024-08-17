import {
    Avatar,
    Badge,
    Button,
    Card,
    CardBody,
    Label,
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
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { AppDataContext } from "../context/AppDataContext";
import { HomeIcon } from "../icons";
import { useAuth } from "../security/Authentification";

const StockActionHistory = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [resultsPerPage, setResultsPerPage] = useState(10);
    const [totalResults, setTotalResults] = useState(0);
    const Auth = useAuth();
    const history = useHistory();
    const { stockActions, loading, error, admins } = useContext(AppDataContext);
    const [filterByType, setFilter] = useState("all");
    const [filterByStatus, setFilterByStatus] = useState("all");

    function findbyemail(email) {
        return admins.find((admin) => admin.email === email)?.fullName || email;
    }

    function onPageChange(p) {
        setPage(p);
    }
    function viewProduct(product) {
        history.push(`/app/product/${product.id}/Stock Transaction`);
      }
    const handleFilterByType = (filter_name) => {
        setFilter(filter_name === "All" ? "all" : filter_name);
    };

    const handleFilterByStatus = (filter_name) => {
        setFilterByStatus(filter_name === "All" ? "all" : filter_name);
    };

    useEffect(() => {
        stockActions.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
        let filteredStockAction = stockActions

        if (filterByType !== "all") {
            filteredStockAction = filteredStockAction.filter((stock) => stock.type === filterByType);
        }

        if (filterByStatus !== "all") {
            filteredStockAction = filteredStockAction.filter((stock) => stock.status === filterByStatus);
        }

        setTotalResults(filteredStockAction.length);
        setData(
            filteredStockAction.slice((page - 1) * resultsPerPage, page * resultsPerPage)
        );
    }, [page, resultsPerPage, stockActions, filterByType, filterByStatus]);

    return (
        <div>
            <PageTitle>Stock Action History</PageTitle>

            <div className="flex text-gray-800 dark:text-gray-300">
                <div className="flex items-center text-purple-600">
                    <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
                    <NavLink exact to="/app/dashboard" className="mx-2">
                        Dashboard
                    </NavLink>
                </div>
                {">"}
                <p className="mx-2">Stock Action History</p>
            </div>

            <Card className="mt-5 mb-5 shadow-md">
                <CardBody>
                    <div className="flex items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Filter Stock Action
                        </p>

                        <Label className="mx-3">
                            <Select
                                className="py-3"
                                onChange={(e) => handleFilterByType(e.target.value)}
                            >
                                <option value={"All"}>All (By Type)</option>
                                <option value={"in-New container"}>in-New container</option>
                                <option value={"in-Returned"}>in-Returned</option>
                                <option value={"out"}>Out</option>
                            </Select>
                        </Label>

                        <Label className="mx-3">
                            <Select
                                className="py-3"
                                onChange={(e) => handleFilterByStatus(e.target.value)}
                            >
                                <option value={"All"}>All (By Status)</option>
                                <option value={"PENDING"}>Pending</option>
                                <option value={"Approved"}>Approved</option>
                                <option value={"Rejected"}>Rejected</option>
                            </Select>
                        </Label>

                        <Label className="">
                            <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                                <input
                                    className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                                    value={resultsPerPage}
                                    onChange={(e) => setResultsPerPage(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                                    Results on Table
                                </div>
                            </div>
                        </Label>
                    </div>
                </CardBody>
            </Card>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <TableContainer className="mb-8">
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity Before Action</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Last Updated</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Requested By</TableCell>
                                <TableCell>Reviewed By</TableCell>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            {data.map((action) => (
                                <TableRow key={action.id}>
                                    <TableCell className="text-sm">
                                    <Button
                                    layout="link"
                                    aria-label="Preview"
                                 onClick={() => viewProduct(action.product)}
                                    >

                                    <div className="flex items-center text-sm">
                                        <Avatar
                                            className="hidden mr-4 md:block"
                                            src={action.product?.imageUrls[0].url}
                                            alt="Product image"
                                        />
                                        <div>
                                            <p className="font-semibold">{action.product.name}</p>
                                        </div>
                                        </div>
                                        </Button>

                                    </TableCell>
                                    <TableCell className="text-sm">{action.quantityBeforeAction}</TableCell>
                                    <TableCell className="text-sm">{action.quantity}</TableCell>
                                    <TableCell className="text-sm">
                                        <Badge type={action.type === "out" ? "danger" : "success"}>
                                            {action.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(action.lastUpdated).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <Badge type={action.status === "PENDING" ? "warning" :
                                            action.status === "Rejected" ? "danger" : "success"}>
                                            {action.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{findbyemail(action.requestedBy)}</TableCell>
                                    <TableCell className="text-sm">{findbyemail(action.approvedBy)}</TableCell>
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
            )}
        </div>
    );
};

export default StockActionHistory;
