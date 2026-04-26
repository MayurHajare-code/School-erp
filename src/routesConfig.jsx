import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ItemsList from "./pages/Inventory/ItemsList";
import AddInventoryItem from "./pages/Inventory/AddInventoryItem";
import ViewItem from "./pages/Inventory/ViewItem";
import EditInventoryItem from "./pages/Inventory/EditInventoryItem";

import AddVendor from "./pages/Vendors/AddVendors";
import VendorLists from "./pages/Vendors/VendorsList";
import ViewVendor from "./pages/Vendors/ViewVendor";
import EditVendor from "./pages/Vendors/EditVendor";

import AddUser from "./pages/Users/AddUser";
import UsersList from "./pages/Users/UsersLists";
import EditUser from "./pages/Users/EditUser";

import PurchaseOrder from "./pages/PurchaseOrder/PurchaseOrder";
import AddPurchaseOrder from "./pages/PurchaseOrder/AddPurchaseOrder";
import EditPurchaseOrder from "./pages/PurchaseOrder/EditPurchaseOrder";
import ViewPurchaseOrder from "./pages/PurchaseOrder/ViewPurchaseOrder";

import Department from "./pages/Department/Department";
import Category from "./pages/Category/Categories";

export const ROLES = {
  ADMIN: "ADMIN",
  STORE_MANAGER: "STORE_MANAGER",
};

export const appRoutes = [
  // Common
  {
    path: "dashboard",
    element: <Dashboard />,
    roles: [ROLES.ADMIN, ROLES.STORE_MANAGER],
  },
  {
    path: "profile",
    element: <Profile />,
    roles: [ROLES.ADMIN, ROLES.STORE_MANAGER],
  },

  // Inventory
  {
    path: "items-list",
    element: <ItemsList />,
    roles: [ROLES.ADMIN, ROLES.STORE_MANAGER],
  },
  {
    path: "add-item",
    element: <AddInventoryItem />,
    roles: [ROLES.STORE_MANAGER],
  },
  {
    path: "item/:id",
    element: <ViewItem />,
    roles: [ROLES.ADMIN, ROLES.STORE_MANAGER],
  },
  {
    path: "edit-item/:id",
    element: <EditInventoryItem />,
    roles: [ROLES.STORE_MANAGER],
  },

  // Vendors
  {
    path: "add-vendor-form",
    element: <AddVendor />,
    roles: [ROLES.STORE_MANAGER],
  },
  {
    path: "vendors-list",
    element: <VendorLists />,
    roles: [ROLES.ADMIN, ROLES.STORE_MANAGER],
  },
  {
    path: "vendor/:id",
    element: <ViewVendor />,
    roles: [ROLES.ADMIN, ROLES.STORE_MANAGER],
  },
  {
    path: "edit-vendor/:id",
    element: <EditVendor />,
    roles: [ROLES.STORE_MANAGER],
  },

  // Users
  {
    path: "add-user",
    element: <AddUser />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "users-list",
    element: <UsersList />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "edit-user/:id",
    element: <EditUser />,
    roles: [ROLES.ADMIN],
  },

  // Purchase Orders
  {
    path: "add-purchase-order",
    element: <AddPurchaseOrder />,
    roles: [ROLES.STORE_MANAGER],
  },
  {
    path: "purchase-order-list",
    element: <PurchaseOrder />,
    roles: [ROLES.ADMIN, ROLES.STORE_MANAGER],
  },
  {
    path: "edit-purchase-order/:id",
    element: <EditPurchaseOrder />,
    roles: [ROLES.STORE_MANAGER],
  },
  {
    path: "view-purchase-order/:id",
    element: <ViewPurchaseOrder />,
    roles: [ROLES.ADMIN, ROLES.STORE_MANAGER],
  },

  // Admin
  {
    path: "department",
    element: <Department />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "category",
    element: <Category />,
    roles: [ROLES.ADMIN],
  },
];