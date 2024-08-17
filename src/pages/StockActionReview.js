import {
    Avatar,
    Badge,
    Button,
    Card,
    CardBody,
    Label,
    Pagination,
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
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { AppDataContext } from "../context/AppDataContext";
import { HomeIcon } from "../icons";
import { useAuth } from "../security/Authentification";
import { StockTransactionService } from "../service/StockTransactionService";

const StockActionReview = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [resultsPerPage, setResultsPerPage] = useState(10);
    const [totalResults, setTotalResults] = useState(0);
    const Auth = useAuth();
    const token = Auth.getToken();
    const { stockActions, loading, error } = useContext(AppDataContext);

    function onPageChange(p) {
        setPage(p);
    }


    useEffect(() => {
        console.log(stockActions)
        if (!loading && !error && stockActions) {
            setData(
                stockActions.filter((action)=> action.status === "PENDING").slice((page - 1) * resultsPerPage, page * resultsPerPage)
            );
            setTotalResults(data.length);

        }
    }, [page, resultsPerPage, stockActions, loading, error]);
    
    
    const handleApproveAction = async (actionId) => {
        try {
            // Call the appropriate service method to approve the action
            console.log(`Approving action with ID: ${actionId}`);
            // Optionally refresh the data after approval
            const response= await StockTransactionService.reviewAction(actionId,"Approved",token)
            console.log(response.data)
        } catch (err) {
         //   setError("Failed to approve the action");
        }
    };

    const handleRejectAction = async (actionId) => {
        try {
            // Call the appropriate service method to reject the action
            console.log(`Rejecting action with ID: ${actionId}`);
            const response= await StockTransactionService.reviewAction(actionId,"Rejected",token)
            console.log(response.data)
            // Optionally refresh the data after rejection
        } catch (err) {
       //     setError("Failed to reject the action");
        }
    };

    return (
        <div>
            <PageTitle>Stock Action Review</PageTitle>

            <div className="flex text-gray-800 dark:text-gray-300">
                <div className="flex items-center text-purple-600">
                    <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
                    <NavLink exact to="/app/dashboard" className="mx-2">
                        Dashboard
                    </NavLink>
                </div>
                {">"}
                <p className="mx-2">Stock Action Review</p>
            </div>



            <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Filter Stock Action
            </p>



            <Label className="mx-3">
              {/* <!-- focus-within sets the color for the icon when input is focused --> */}
              <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                <input
                  className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  value={resultsPerPage}
                  onChange={(e) => setResultsPerPage(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                  {/* <SearchIcon className="w-5 h-5" aria-hidden="true" /> */}
                  Results on Table
                </div>
              </div>
            </Label>
          </div>
        </CardBody>
      </Card>

            <div className="mt-5 mb-5 shadow-md">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <TableContainer className="mb-8">
                            <Table>
                                <TableHeader>
                                    <tr>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell>Quantity Before Action</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Last Updated</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </tr>
                                </TableHeader>
                                <TableBody>
                                    {data.map((action) => (
                                        <TableRow key={action.id}>
                                            <TableCell className="text-sm">{action.id}</TableCell>
                                            <TableCell className="text-sl">
                                            <div className="flex items-center text-sm">
                                        <Avatar
                                            className="hidden mr-4 md:block"
                                            src={action.product?.imageUrls[0].url}
                                            alt="Product image"
                                        />
                                        <div>
                                            <p className="font-semibold">{action.product.name}</p>
                                        </div>
                                        </div></TableCell>
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
                                                <Badge type={action.status === "PENDING" ? "warning" : "success"}>
                                                    {action.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <div className="flex">
                                                    <Button
                                                        className="mr-2"
                                                        size="small"
                                                        onClick={() => handleApproveAction(action.id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        layout="outline"
                                                        onClick={() => handleRejectAction(action.id)}
                                                    >
                                                        Reject
                                                    </Button>
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
                    )}
        </div>
        </div>
    );
};

export default StockActionReview;
