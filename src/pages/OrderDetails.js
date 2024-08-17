import {
  Badge,
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  TableCell,
  TableHeader
} from "@windmill/react-ui";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
import { AppDataContext } from "../context/AppDataContext";
import { useAuth } from "../security/Authentification";
import { OrderService } from "../service/OrderService";

const OrderDetails = () => {
  const { id } = useParams();
  const { orders } = useContext(AppDataContext);
  const [order,setOrder] = useState(orders.find((order) => order.id == id));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionStatuses, setActionStatuses] = useState('');
  const Auth = useAuth();
  const token = Auth.getToken();


  
  useEffect(() => {
    
    setOrder(orders.find((order) => order.id == id));
  }, [orders]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getBadgeType = (status) => {
    switch (status.toLowerCase()) {
      case "cancelled":
        return "danger";
      case "picked up":
      case "delivered":
        return "success";
      case "pending":
        return "warning";
      default:
        return "neutral";
    }
  };

  const handleActionStatus = (status) => {
    if (status) {
      setIsModalOpen(true);
      setActionStatuses(status);
    }
  };

  const handleAction = async () => {
    try {
      const response = await OrderService.setreview(token, actionStatuses, order.id);
      if (response.data) {
        closeModal();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <PageTitle>Order Details</PageTitle>

      <Card className="mb-8 shadow-lg rounded-lg overflow-hidden">
  <CardBody className="p-6">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold text-gray-800">
        Order for {order?.userFullName}
      </h2>
    </div>
    <div className="mt-4 space-y-2">
      <p className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">Date:</span> {new Date(order?.creationDate).toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">Name:</span> {order.userFullName}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">Address:</span> 1234 Elm Street, London, UK
      </p>
    </div>
    <div className="flex items-center mt-6 text-sm text-gray-600">
      <span className="font-medium text-gray-700">Status:</span>
      <Badge
        type={getBadgeType(order.status)}
        className="ml-2 px-4 py-1 rounded-full text-sm"
      >
        {order.status}
      </Badge>
      <Select
        className="ml-4 py-2 px-4 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => handleActionStatus(e.target.value)}
      >
        <option value="" disabled>
          Change status
        </option>
        <option value="pending">Pending</option>
        <option value="pickedUp">Picked up</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </Select>
    </div>
  </CardBody>
</Card>


      <div className="flex justify-center">
        <Card className="shadow-md" style={{ minWidth: '400px', width: 'auto' }}>
          <CardBody>
            <div className="flex justify-center mb-4">
              <h3 className="text-lg font-semibold">Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <TableHeader>
                  <tr>
                    <TableCell>Image</TableCell>
                    <TableCell className="text-center">Item</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item.product.id}>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <img src={item.product.imageUrls[0].url} alt={item.product.name} className="w-20 h-20 object-cover" />
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                        {item.product.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        £ {item.sub_total.toFixed(2)}
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900" colSpan="3">
                      Total
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">
                      £ {order.totalAmount.toFixed(2)}
                    </TableCell>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Button size="small">Done</Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="flex items-center">
          Modify Order Status
        </ModalHeader>
        <ModalBody>
          Are you sure you want to set status to 
          {order ? ` ${actionStatuses} for order ID ${order.id}` : null}?
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleAction}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default OrderDetails;
