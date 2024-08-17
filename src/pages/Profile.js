import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import React, { useContext, useState } from 'react';
import { AppDataContext } from "../context/AppDataContext";
import { EditIcon, TrashIcon } from '../icons';
import { useAuth } from "../security/Authentification";
import { AdminCreationService } from "../service/admincreationservice";

const FormTitle = ({ children }) => {
  return (
    <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
      {children}
    </h2>
  );
};

const Profile = () => {
  const Auth = useAuth();
const token = Auth.getToken();
const { admins , setAdmins } = useContext(AppDataContext);

  const [newAdmin, setNewAdmin] = useState({ email: '', password: '', fullName: '', role: '' });
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);

  const handleAddAdmin = async () => {
    try {
      let response;
      if (newAdmin.id) {
        response = await AdminCreationService.Update(newAdmin, token);
        console.log(response.data)
        if(response.data === "Admin is updated"){
          console.log("updatees")
          setAdmins(prevAdmins => {
            const indexToUpdate = prevAdmins.findIndex((admin) => admin.id === newAdmin.id);
            if (indexToUpdate >= 0) {
              const updatedAdmins = [...prevAdmins];
              newAdmin.password=""
              updatedAdmins[indexToUpdate] = newAdmin;
              setNewAdmin({ email: '', password: '', fullName: '', role: '' });
              return updatedAdmins;
            } 
          })
        }
        setNewAdmin({ email: '', password: '', fullName: '', role: '' });
      } else {
        response = await AdminCreationService.AddUserAdmin(newAdmin, token);
        console.log("Adddd")

        if(response.data.message ==="Admin registered successfully!"){
        
          setAdmins(prevAdmins => {
            newAdmin.password=""
            return [newAdmin, ...prevAdmins]})
  
          setNewAdmin({ email: '', password: '', fullName: '', role: '' });

      }
      }

    
      
  } catch (err) {
     // setError("Failed to fetch Products");
  } finally {
  }

    setIsAddAdminModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  
  const handleDeleteAdmin = async(email) => {
    try {
      const response = await AdminCreationService.deleteAdmin(email,token);
      console.log(response)
      if(response.status==200){
        setAdmins(admins.filter((admin) => admin.email !== email));


        setNewAdmin({ email: '', password: '', fullName: '', role: '' });
      }
      console.log(response.data)
    
    }
    catch(err){
      //
    }
  };
    
  

  const handleEditAdmin = (admin) => {
    setNewAdmin(admin);

    setIsAddAdminModalOpen(true);
  };

  const handleCancelEdit = () => {
    setNewAdmin({ email: '', password: '', fullName: '', role: '' });
    setIsAddAdminModalOpen(false);
  };

  const closeModal = () => {
    setNewAdmin({ email: '', password: '', fullName: '', role: '' });

    setIsAddAdminModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Manage Admins</h1>
      <Button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {console.log(newAdmin)
        setIsAddAdminModalOpen(true)} }
        icon={EditIcon}
      >
        Add Admin
      </Button>
      <Modal isOpen={isAddAdminModalOpen} onClose={closeModal}>
        <ModalHeader className="flex items-center mb-8">
          {newAdmin.id ? "Edit Admin" : "Add Admin"}
        </ModalHeader>
        <ModalBody>
          <form>
            <FormTitle>Email</FormTitle>
            <Label>
              <Input
                name="email"
                type="email"
                placeholder="Enter admin email"
                value={newAdmin.email}
                onChange={handleInputChange}
                required
              />
            </Label>

            <FormTitle>Password</FormTitle>
            <Label>
              <Input
                name="password"
                type="password"
                placeholder="Enter admin password"
                value={newAdmin.password}
                onChange={handleInputChange}
                required
              />
            </Label>

            <FormTitle>Full Name</FormTitle>
            <Label>
              <Input
                name="fullName"
                type="text"
                placeholder="Enter admin full name"
                value={newAdmin.fullName}
                onChange={handleInputChange}
                required
              />
            </Label>

            <FormTitle>Role</FormTitle>
            <Label>
              <Select
                name="role"
                value={newAdmin.role}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 text-sm text-gray-700 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Role</option>
                <option value="StockManager">Stock Manager</option>
                <option value="Admin">Admin</option>
              </Select>
            </Label>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button onClick={handleAddAdmin}>
            {newAdmin.id ? "Update" : "Add"}
          </Button>
        </ModalFooter>
      </Modal>
      <TableContainer className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.filter((admin) => admin.role !=="SuperAdmin" ).map((admin) => (
              <TableRow key={admin.email}>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.fullName}</TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button
                    icon={EditIcon}
                    className="mr-3"
                    aria-label="Edit"
                    onClick={() => handleEditAdmin(admin)}
                  />
                  <Button
                    icon={TrashIcon}
                    layout="outline"
                    aria-label="Delete"
                    onClick={() => handleDeleteAdmin(admin.email)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Profile;