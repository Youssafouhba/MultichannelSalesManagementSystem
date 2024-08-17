/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/app/dashboard", 
    icon: "HomeIcon", 
    name: "Dashboard", 
    roles: ["SuperAdmin", "Admin", "StockManager"], // Define roles that can access this route
  },
  {
    path: "/app/orders",
    icon: "CartIcon",
    name: "Orders",
    roles: ["SuperAdmin", "Admin"],
  },
  {
    icon: "TruckIcon",
    name: "Products",
    roles: ["SuperAdmin", "Admin"],
    routes: [
      {
        path: "/app/all-products",
        name: "All Products",
        roles: ["SuperAdmin", "Admin"],
      },
      {
        path: "/app/add-product",
        name: "Add Product",
        roles: ["SuperAdmin", "Admin"],
      },
    ],
  },
  {
    path: "/app/customers",
    icon: "GroupIcon",
    name: "Customers",
    roles: ["SuperAdmin", "Admin"],
  },
  {
    icon: "StockIcon",
    name: "Stock Managing",
    roles: ["SuperAdmin", "StockManager" , "Admin"],
    routes: [
      {
        path: "/app/stockManagement",
        name: "Stock Action",
        roles: ["SuperAdmin", "StockManager" , "Admin"],
      },
      {
        path: "/app/reviewStockAction",
        name: "Stock Action Review",
        roles: ["SuperAdmin" , "Admin"],
      },
      {
        path: "/app/historyStockAction",
        name: "Stock Action History",
        roles: ["SuperAdmin"],
      },
    ],
  },
  {
    path: "/app/chats",
    icon: "ChatIcon",
    name: "Chats",
    roles: ["SuperAdmin"],
  },
  {
    path: "/app/manage-profile",
    icon: "UserIcon",
    name: "Accounts Manager",
    roles: ["SuperAdmin"],
  },
  {
    path: "/app/tradeCustomer",
    icon: "UserIcon",
    name: "Trade Customer",
    roles: ["SuperAdmin"],
  },
  {
    path: "/app/settings",
    icon: "OutlineCogIcon",
    name: "Settings",
    roles: ["SuperAdmin", "Admin", "StockManager"],
  },
 
  {
    path: "/app/logout",
    icon: "OutlineLogoutIcon",
    name: "Logout",
    roles: ["SuperAdmin", "Admin", "StockManager"],
  },
];

export default routes;
