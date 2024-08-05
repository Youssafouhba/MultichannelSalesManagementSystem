import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon } from "../icons";


function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}

const TradeCustomers = () => {
  // pagination setup
  const [resultsPerPage, setResultPerPage] = useState(10);
  const [filter, setFilter] = useState("all");
  

  const handleFilter = (filter_name) => {
    // console.log(filter_name);
    if (filter_name === "All") {
      setFilter("all");
    }
    if (filter_name === "Un-Paid Orders") {
      setFilter("un-paid");
    }
    if (filter_name === "Paid Orders") {
      setFilter("paid");
    }
    if (filter_name === "Completed") {
      setFilter("completed");
    }
  };

  return (
    <div>
      <PageTitle>Trade Customers</PageTitle>

      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Trade Customers</p>
      </div>

 
    </div>
  );
};

export default TradeCustomers
