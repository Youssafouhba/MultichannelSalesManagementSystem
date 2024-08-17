import {
  Badge,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow
} from "@windmill/react-ui";
import { useAuth } from "../security/Authentification";
  
  import React, { useEffect, useState } from "react";
  
  const StockTransactionTable = ({ resultsPerPage, filter, response }) => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const Auth = useAuth();
    const token = Auth.getToken();
  
    // Pagination change control
    function onPageChange(p) {
      setPage(p);
    }
  
    const totalResults = response.length;
  
    useEffect(() => {
      async function fetchStockTransactions() {
        setLoading(true);
        setError(null);
  
        try {
          let transactions = response;
          console.log(transactions)
  
          // Filter and paginate transactions based on filter and page
          if (filter === "New container") {
            transactions = transactions.filter((transaction) => transaction.type === "in-New container");
          } else if (filter === "Returned") {
            transactions = transactions.filter((transaction) => transaction.type === "in-Returned");
          } else if (filter === "Out") {
            transactions = transactions.filter((transaction) => transaction.type === "out");
          }
  
          setData(
            transactions.slice((page - 1) * resultsPerPage, page * resultsPerPage)
          );
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch stock transactions");
          setLoading(false);
        }
      }
  
      fetchStockTransactions();
    }, [page, resultsPerPage, filter, token, response]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }

    console.log(data)
  
    return (
      <div>
        {/* Table */}
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Id</TableCell>
                <TableCell>Quantity Before Transaction</TableCell>
                <TableCell>Quantity Of Transaction</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {data.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <span className="text-sm">{transaction.id}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{transaction.quantityBeforeAction}</span> {/* Updated field name */}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{transaction.quantity}</span> {/* Updated field name */}
                  </TableCell>
                  <TableCell>
                    <Badge
                      type={
                        transaction.type === "in-New container"
                          ? "success"
                          : transaction.type === "in-Returned"
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      type={
                        transaction.status === "PENDING"
                          ? "warning"
                          : transaction.status === "APPROVED"
                          ? "success"
                          :transaction.status === "REJECTED"
                          ? "danger"
                          : "neutral"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(transaction.lastUpdated).toLocaleDateString()}
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
  
  export default StockTransactionTable;
  