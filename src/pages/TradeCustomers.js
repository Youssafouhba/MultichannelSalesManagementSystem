import { Card, CardBody, Label, Select } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import TradeCustomersTable from "../components/TradeCustomersTable";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon } from "../icons";
import { useAuth } from "../security/Authentification";
import { UserService } from "../service/UserService"; // Import UserService


function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}

const TradeCustomers = () => {
  // pagination setup
  const [resultsPerPage, setResultPerPage] = useState(10);
  const [filter, setFilter] = useState("all");
  const Auth = useAuth();
  const token = Auth.getToken();
  const [tradeCustomers,setTradeCustomers]= useState([])

  useEffect(() => {
    const fetchTradeCustomers = async () => {
      const response = await UserService.getTradeCustomerRequests(token);
      setTradeCustomers(response.data)
    }

    fetchTradeCustomers();
    
}, [ token]);


  const handleFilter = (filter_name) => {
    // console.log(filter_name);
    if (filter_name === "All") {
      setFilter("all");
    }
    if (filter_name === "Pending") {
      setFilter("Pending");
    }
    if (filter_name === "Rejected") {
      setFilter("Rejected");
    }
    if (filter_name === "Approved") {
      setFilter("Approved");
    }
    
  };

  return (
    <div>
      <PageTitle>TradeCustomers</PageTitle>

      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">TradeCustomers</p>
      </div>

      {/* Sort */}
      <Card className="mt-5 mb-5 shadow-md">
        <CardBody>
          <div className="flex items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Filter TradeCustomers
            </p>

            <Label className="mx-3">
              <Select
                className="py-3"
                onChange={(e) => handleFilter(e.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Rejected</option>
              </Select>
            </Label>

            <Label className="">
              {/* <!-- focus-within sets the color for the icon when input is focused --> */}
              <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                <input
                  className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  value={resultsPerPage}
                  onChange={(e) => setResultPerPage(e.target.value)}
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

      {/* Table */}
      <TradeCustomersTable resultsPerPage={resultsPerPage} filter={filter} tradeCustomers={tradeCustomers} />
    </div>
  );
};

export default TradeCustomers;
