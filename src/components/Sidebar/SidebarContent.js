import { Button } from "@windmill/react-ui";
import React from "react";
import { NavLink, Route } from "react-router-dom";
import * as Icons from "../../icons";
import routes from "../../routes/sidebar";
import { useAuth } from "../../security/Authentification";
import SidebarSubmenu from "./SidebarSubmenu";

function Icon({ icon, ...props }) {
  const Icon = Icons[icon];
  return <Icon {...props} />;
}

function SidebarContent() {
    const Auth = useAuth();
    const userRole = Auth.getUser()?.role[0]; // Get the user's role
  
    // Function to filter routes based on user role
    const filterRoutesByRole = (routes, role) => {
      return routes
        .filter(route => route.roles.includes(role))
        .map(route => ({
          ...route,
          routes: route.routes ? filterRoutesByRole(route.routes, role) : null,
        }));
    };
  
    const filteredRoutes = filterRoutesByRole(routes, userRole);
  
  
  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <a
        className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
        href="#"
      >
        Wholesaled
      </a>
      <ul className="mt-6">
        {filteredRoutes.slice(0, -2).map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            <li className="relative px-6 py-3" key={route.name}>
              <NavLink
                exact
                to={route.path}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                activeClassName="text-gray-800 dark:text-gray-100"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                </Route>
                <Icon
                  className="w-5 h-5"
                  aria-hidden="true"
                  icon={route.icon}
                />
                <span className="ml-4">{route.name}</span>
              </NavLink>
            </li>
          )
        )}

        <hr className="customeDivider mx-4 my-5" />

        {routes.slice(-2).map((route) => (
          <li className="relative px-6 py-3" key={route.name}>
            <NavLink
              exact
              to={route.path}
              className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
              activeClassName="text-gray-800 dark:text-gray-100"
            >
              <Route path={route.path} exact={route.exact}>
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                  aria-hidden="true"
                ></span>
              </Route>
              <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
              <span className="ml-4">{route.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="px-6 my-6">
        <Button>
          Genarate Report
          <span className="ml-2" aria-hidden="true">
            +
          </span>
        </Button>
      </div>
    </div>
  );
}

export default SidebarContent;
