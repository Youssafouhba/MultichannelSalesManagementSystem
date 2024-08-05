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
import {
  EditIcon
} from "../icons";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../security/Authentification";

import React, { useEffect, useState } from "react";
















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
  const handleActionStatus = (orderId, status) => {
    setActionStatuses((prevStatuses) => ({
      ...prevStatuses,
      [orderId]: status,
    }));
  };


  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const response = await OrderService.getAllOrders(token);
      let orders = response.data;
      setTotalResults(orders.length);

      // Filter and paginate orders based on filter and page
      if (filter === "Pending") {
        orders = orders.filter((order) => order.status === "Pending");
      } else if (filter === "delivered") {
        orders = orders.filter((order) => order.status === "delivered");
      } else if (filter === "picked up") {
        orders = orders.filter((order) => order.status === "picked up");
      } else if (filter === "cancelled") {
        orders = orders.filter((order) => order.status === "cancelled");
      }

      setData(
        orders.slice((page - 1) * resultsPerPage, page * resultsPerPage)
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
    console.log(`Order ID: ${selectedOrder.id}, Action Status: ${actionStatus}`);

    setLoading(true);
    setError(null);
    try {

          
        
        const response = actionStatus === "Picked up"?await OrderService.setreview(token,"pickedUp",selectedOrder.id):await OrderService.setreview(token,actionStatus,selectedOrder.id)
        console.log(response.data)
        if(response.data){
          fetchOrders()
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
  }, [page, resultsPerPage, filter, token]);

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
                      <p className="font-semibold">{order.user.fullName}</p>
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
                    {new Date(order.creationDate).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell className="flex items-center justify-around alignspace-x-2">
                  <Label>
                    <Select
                      className="py-2 px-5"
                      onChange={(e) =>
                        handleActionStatus(order.id, e.target.value)
                      }
                    >
                      <option></option>
                      <option>Pending</option>
                      <option>Picked up</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </Select>
                  </Label>
                  <Button
                    icon={EditIcon}
                    layout="outline"
                    aria-label="Delete"
                    onClick={() => openModal(order)}
                    size="small"
                  />
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