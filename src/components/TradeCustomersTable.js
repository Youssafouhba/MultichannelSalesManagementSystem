import {
    Badge,
    Button,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHeader,
    TableRow
} from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { EyeIcon } from "../icons";

const TradeCustomersTable = ({ resultsPerPage, filter , tradeCustomers}) => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [totalResults, setTotalResults] = useState(10);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const navigation = useHistory();

    const fetchTradeCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            
            let filteredTradeCustomers = tradeCustomers;
            if (filter === "Pending") {
                filteredTradeCustomers = filteredTradeCustomers.filter((trade) => trade.status === "PENDING");
              } else if (filter === "Rejected") {
                filteredTradeCustomers = filteredTradeCustomers.filter((trade) => trade.status === "Rejected");
              } else if (filter === "Approved") {
                filteredTradeCustomers = filteredTradeCustomers.filter((trade) => trade.status === "Approved");
              }

            setTotalResults(filteredTradeCustomers.length);
            setData(
                filteredTradeCustomers.slice((page - 1) * resultsPerPage, page * resultsPerPage)
            );
        } catch (err) {
            setError("Failed to fetch trade customers");
        } finally {
            setLoading(false);
        }
    };

    const openModal = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetchTradeCustomers();
    }, [page, resultsPerPage, filter,tradeCustomers]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }


    return (
        <div>
            {/* Table */}
            <TableContainer className="mb-8">
                <Table>
                    <TableHeader>
                        <tr>
                            <TableCell>Company Name</TableCell>
                            <TableCell>Contact Person</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {data.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell>
                                    <div className="flex items-center text-sm">
                                        <div>
                                            <p className="font-semibold">
                                                {customer.companyName}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{customer.contactPerson}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{customer.emailAddress}</span>
                                </TableCell>
                                <TableCell>
                                <Badge
                      type={
                        customer.status === "Rejected"
                          ? "danger"
                          : customer.status === "Approved"
                          ? "success"
                          : customer.status === "PENDING"
                          ? "warning"
                          : "neutral"
                      }
                    >
                     {customer.status}
                    </Badge>
                                    
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">
                                        {new Date(customer.date).toLocaleDateString()}
                                    </span>
                                </TableCell>
                                <TableCell className="flex items-center justify-around alignspace-x-2">
                                    <Label>
                                        <Button
                                            iconLeft={EyeIcon}
                                            aria-label="View Details"
                                            onClick={() => openModal(customer)}
                                        />
                                    </Label>
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
                        onChange={setPage}
                    />
                </TableFooter>
            </TableContainer>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalHeader className="flex items-center">
                    Trade Customer Details
                </ModalHeader>
                <ModalBody>
                    {selectedCustomer && (
                        <div>
                            <p><strong>Company Name:</strong> {selectedCustomer.companyName}</p>
                            <p><strong>Contact Person:</strong> {selectedCustomer.contactPerson}</p>
                            <p><strong>Phone Number:</strong> {selectedCustomer.phoneNumber}</p>
                            <p><strong>Email Address:</strong> {selectedCustomer.emailAddress}</p>
                            <p><strong>Website:</strong> {selectedCustomer.website}</p>
                            <p><strong>Type of Business:</strong> {selectedCustomer.typeOfBusiness}</p>
                            <p><strong>Business Address:</strong> {selectedCustomer.businessAddress}</p>
                            <p><strong>City:</strong> {selectedCustomer.city}</p>
                            <p><strong>Postal Code:</strong> {selectedCustomer.postalCode}</p>
                            <p><strong>Country:</strong> {selectedCustomer.country}</p>
                            <p><strong>Status:</strong> {selectedCustomer.status}</p>
                            <p><strong>Date:</strong> {new Date(selectedCustomer.date).toLocaleDateString()}</p>
                            <p><strong>Products of Interest:</strong> {selectedCustomer.productsOfInterest}</p>
                            <p><strong>How Did You Hear About Us:</strong> {selectedCustomer.howDidYouHearAboutUs}</p>
                            {selectedCustomer.additionalInformation && (
                                <p><strong>Additional Information:</strong> {selectedCustomer.additionalInformation}</p>
                            )}
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                {selectedCustomer?.status==="PENDING"? 
                (<div className="flex space-x-4" >
                    <div className="hidden sm:block">
                        <Button onClick={closeModal}>
                            Approve
                        </Button>
                    </div>
                    <div className="hidden sm:block">
                    <Button onClick={closeModal}>
                            Reject
                        </Button>
                    </div>
                    </div>
                    ):null}
                    <div className="hidden sm:block">
                        <Button layout="outline" onClick={closeModal}>
                            Close
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default TradeCustomersTable;
