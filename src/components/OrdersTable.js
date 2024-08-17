import {
  Badge,
  Button,
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
import { EyeIcon } from "../icons";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../security/Authentification";

import React, { useContext, useEffect, useState } from "react";
















import { AppDataContext } from "../context/AppDataContext";
import { OrderService } from "../service/OrderService"; // Import OrderService
const OrdersTable = ({ resultsPerPage, filter }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Auth = useAuth();
  const token = Auth.getToken();
  const [actionStatuses, setActionStatuses] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setselectedOrder] = useState(null);
  const navigation = useHistory();
  const { orders } = useContext(AppDataContext);

  const handleActionStatus = (order, status) => {
    if (status != "") {
      setselectedOrder(order);   
      setIsModalOpen(true);
      }
    setActionStatuses((prevStatuses) => ({
      ...prevStatuses,
      [order.id]: status,
    }));
    
  };
  const goToOrderDetails= (order)=>{
    navigation.push(`/app/orderDetails/${order.id}`);

  }


  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      
      orders.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
      let filteredOrders =orders
      // Filter and paginate orders based on filter and page
      if (filter === "Pending") {
        filteredOrders = filteredOrders.filter((order) => order.status === "Pending");
      } else if (filter === "delivered") {
        filteredOrders = filteredOrders.filter((order) => order.status === "delivered");
      } else if (filter === "picked up") {
        filteredOrders = filteredOrders.filter((order) => order.status === "picked up");
      } else if (filter === "cancelled") {
        filteredOrders = filteredOrders.filter((order) => order.status === "cancelled");
      }
      setTotalResults(filteredOrders.length);
      setData(
        filteredOrders.slice((page - 1) * resultsPerPage, page * resultsPerPage)
      );
      // Initialize action statuses
      const initialStatuses = orders.reduce((acc, order) => {
        acc[order.id] = null;
        return acc;
      }, {});
      setActionStatuses(initialStatuses);
    } catch (err) {
      setError(" to fetch orders");
    } finally {
      setLoading(false);
    }
  }


  const handleAction = async () => {
    const actionStatus = actionStatuses[selectedOrder.id];
    if (actionStatus != null) {

    setLoading(true);
    setError(null);
    try {

          
        
        const response = await OrderService.setreview(token,actionStatus,selectedOrder.id)
        console.log(response.data)
        if(response.data){
          closeModal();

        }
      
     
    }catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
    }

    // set error
  

  };

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }




  async function openModal(order) {
    if (actionStatuses[order.id] != null) {
    setselectedOrder(order);
    
    setIsModalOpen(true);
    }
    else{
      alert("Select a action")
    }
  }

  function closeModal() {
    setIsModalOpen(false);
  }



  useEffect(() => {
    
    fetchOrders();
  }, [page, resultsPerPage, filter, token,orders]);

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
              <TableCell>Client</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{order.userFullName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">#{order.id}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">£ {order.totalAmount}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    type={
                      order.status === "cancelled"
                        ? "danger"
                        : order.status === "picked up"
                        ? "success"
                        : order.status === "delivered"
                        ? "success"
                        : order.status === "Pending"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(order?.creationDate).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="flex items-center justify-around alignspace-x-2">
                  <Label>
                    <Select
                      className="py-2 px-5"
                      onChange={(e) =>{
                        handleActionStatus(order, e.target.value)
                       
                      }
                      }
                    >
                      <option value={null}></option>
                      <option value={"pending"}>Pending</option>
                      <option value={"pickedUp"}>Picked up</option>
                      <option value={"delivered"}>Delivered</option>
                      <option value={"cancelled"}>Cancelled</option>
                    </Select>
                  </Label>
                  <Label>
                  <Button
                                            iconLeft={EyeIcon}
                                            aria-label="View Details"
                                            onClick={() => goToOrderDetails(order)}
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
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="flex items-center">
          Modify Order Status
        </ModalHeader>
        <ModalBody>
          Are you sure you want to set status to 
          {selectedOrder? ` ${actionStatuses[selectedOrder.id]} with order id is ${selectedOrder.id}` :null}
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={()=> handleAction()}>Confirme</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large">
              Confirme
            </Button>
          </div>
        </ModalFooter>
      </Modal>

    </div>
  );
};

export default OrdersTable;