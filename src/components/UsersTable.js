import {
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
import { AppDataContext } from "../context/AppDataContext";
import { useAuth } from "../security/Authentification";


const UsersTable = ({ resultsPerPage, filter }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  
  const Auth = useAuth();
  const token =Auth.getToken()
  const { customers, loading, error } = useContext(AppDataContext);



  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data



  useEffect(() => {
    if (!loading && !error) {
        setTotalResults(customers.length);
        setData(
          customers.slice((page - 1) * resultsPerPage, page * resultsPerPage)
        );
    }
}, [page, resultsPerPage, customers, loading, error]);



  return (
    <div>
      {/* Table */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Full Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Trade Customer</TableCell>
              <TableCell>Joined on</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{user.fullName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.phoneNumber}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.email}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.tradeCustomer?"true":"false"}</span>
                </TableCell>

                <TableCell>
                  <span className="text-sm">
                    {new Date(user.dateOfCreation).toLocaleDateString()}
                  </span>
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

export default UsersTable;
