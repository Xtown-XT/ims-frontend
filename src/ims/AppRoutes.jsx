// IMSRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  FileDoneOutlined,
  AppstoreOutlined,
  SwapOutlined,
  SlidersOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  FileOutlined,
  FormOutlined,
  ShoppingOutlined,
  RollbackOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  DeleteOutlined,
  SettingOutlined,
  BarcodeOutlined,
  QrcodeOutlined,
  TagsOutlined,
  InboxOutlined,
  GoldOutlined,
  BlockOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  ContainerOutlined,
  FileProtectOutlined,
  DollarOutlined,
  BankOutlined,
  FundOutlined,
  TransactionOutlined,
  AccountBookOutlined,
  BarChartOutlined,
  AuditOutlined,
  PieChartOutlined,
  CalculatorOutlined,
  CreditCardOutlined,
  GiftOutlined,
  TagOutlined,
  // Added icons for Peoples module
  TeamOutlined,
  IdcardOutlined,
  SolutionOutlined,
  HomeOutlined,
  ApartmentOutlined,
  // Added icons for HRM module
  UserSwitchOutlined,
  ClusterOutlined,
  BranchesOutlined,
} from "@ant-design/icons";

// Import images for main modules from IMS assets
import inventoryIcon from "./assets/Inventory.png";
import couponsIcon from "./assets/coupons.png";
import stockIcon from "./assets/Stock.png";
import salesIcon from "./assets/Sales.png";
import purchaseIcon from "./assets/Purchase.png";
import financeIcon from "./assets/Finance_Accounts.png";
import userManagementIcon from "./assets/User-management.png";

// Inventory Pages
import Products from "./pages/inventory/products";
import CreateProducts from "./pages/inventory/createproducts";
import ExpiredProducts from "./pages/inventory/expiredproducts";
import LowStocks from "./pages/inventory/lowstocks";
import ProductCategory from "./pages/inventory/productcategory";
import ProductSubCategory from "./pages/inventory/productsubcategory";
import Brands from "./pages/inventory/brands";
import Units from "./pages/inventory/units";
import VariantAttributes from "./pages/inventory/variantattributes";
import Warranties from "./pages/inventory/warranty";
import PrintBarcode from "./pages/inventory/printbarcode";
import PrintQRCode from "./pages/inventory/printqrcode";
import Coupons from "./pages/coupons/coupons";
import GiftCards from "./pages/coupons/giftcards";
import Discount from "../ims/pages/coupons/Discount"; // ✅ Added Discount import under Coupons
import ProductDetails from "../ims/pages/inventory/ProductDetails";

// Finance & Accounts Pages
import Expenses from "./pages/Finance&Accounts/Expenses";
import ExpenseCategory from "./pages/Finance&Accounts/ExpenseCategory";
import Income from "./pages/Finance&Accounts/Income";
import IncomeCategory from "./pages/Finance&Accounts/IncomeCategory";
import BankAccounts from "./pages/Finance&Accounts/BankAccounts";
import MoneyTransfer from "./pages/Finance&Accounts/MoneyTransfer";
import BalanceSheet from "./pages/Finance&Accounts/BalanceSheet";
import CashFlow from "./pages/Finance&Accounts/CashFlow";
import AccountStatement from "./pages/Finance&Accounts/AccountStatement";

// Sales Pages
import OnlineOrder from "./pages/Sales/sales/OnlineOrder";
import POSOrders from "./pages/Sales/sales/POSOrders";
import POS from "./pages/Sales/POS/POS";
import Invoices from "./pages/Sales/invoices";
import Quotation from "./pages/Sales/Quotation";
import SalesReturn from "./pages/Sales/SalesReturn";

// Purchase Pages
import Purchases from "./pages/purchases/Purchases";
import PurchaseOrder from "./pages/purchases/PurchaseOrder";
import PurchaseReturn from "./pages/purchases/PurchaseReturn";

// Stock Pages
import ManageStock from "./pages/stock/ManageStock";
import StockAdjustment from "./pages/stock/StockAdjustment";
import StockTransfer from "./pages/stock/StockTransfer";

// ✅ Peoples Pages
import Customers from "../ims/pages/peoples/Customers";
import Billers from "../ims/pages/peoples/Billers";
import Suppliers from "../ims/pages/peoples/Suppliers";
import Stores from "../ims/pages/peoples/Stores";
import Warehouses from "../ims/pages/peoples/Warehouses";

// ✅ HRM Pages
import Employees from "../ims/pages/hrm/Employees";
import EmployeeList from "../ims/pages/hrm/Employeelist";
import Departments from "../ims/pages/hrm/Departments";
import Designation from "../ims/pages/hrm/Designation";
import AddEmployee from "../ims/pages/hrm/Addemployee";

// ✅ User Management Pages
import Users from "./pages/usermanagement/Users";
import RolesPermissions from "./pages/UserManagement/RolesPermissions";
import DeleteAccountRequest from "./pages/usermanagement/DeleteAccountRequest";

// ✅ Sidebar Menu Items
export const imsMenuItems = [
  // ✅ INVENTORY MODULE (Updated Icons)
  {
    icon: <img src={inventoryIcon} alt="Inventory" className="w-6 h-6" />,
    key: "/ims/inventory",
    label: "Inventory",
    children: [
      {
        key: "/ims/inventory/products",
        label: "Products",
        icon: <AppstoreOutlined />,
      },
      {
        key: "/ims/inventory/Createproducts",
        label: "Create Products",
        icon: <FormOutlined />,
      },
      {
        key: "/ims/inventory/Expiredproducts",
        label: "Expired Products",
        icon: <FileProtectOutlined />,
      },
      {
        key: "/ims/inventory/lowstocks",
        label: "Low Stocks",
        icon: <DatabaseOutlined />,
      },
      {
        key: "/ims/inventory/ProductCategory",
        label: "Product Category",
        icon: <ContainerOutlined />,
      },
      {
        key: "/ims/inventory/ProductSubCategory",
        label: "Product Sub Category",
        icon: <BlockOutlined />,
      },
      {
        key: "/ims/inventory/brands",
        label: "Brands",
        icon: <GoldOutlined />,
      },
      {
        key: "/ims/inventory/units",
        label: "Units",
        icon: <DeploymentUnitOutlined />,
      },
      {
        key: "/ims/inventory/variantattributes",
        label: "Variant Attributes",
        icon: <TagsOutlined />,
      },
      {
        key: "/ims/inventory/warranty",
        label: "Warranties",
        icon: <SafetyCertificateOutlined />,
      },
      {
        key: "/ims/inventory/print-barcode",
        label: "Print Barcode",
        icon: <BarcodeOutlined />,
      },
      {
        key: "/ims/inventory/print-qr",
        label: "Print QR Code",
        icon: <QrcodeOutlined />,
      },
    ],
  },

  // ✅ COUPONS MODULE (Now includes Discount)
  {
    icon: <img src={couponsIcon} alt="Coupons" className="w-6 h-6" />,
    key: "/ims/coupons",
    label: "Coupons",
    children: [
      {
        key: "/ims/coupons/coupons",
        label: "Coupons",
        icon: <TagOutlined />,
      },
      {
        key: "/ims/coupons/giftcards",
        label: "Gift Cards",
        icon: <GiftOutlined />,
      },
      {
        key: "/ims/coupons/discount", // ✅ Added Discount submenu
        label: "Discount",
        icon: <TagOutlined />,
      },
    ],
  },

  // Stock
  {
    icon: <img src={stockIcon} alt="Stock" className="w-6 h-6" />,
    key: "/ims/stock",
    label: "Stock",
    children: [
      {
        key: "/ims/stock/manage",
        label: "Manage Stock",
        icon: <AppstoreOutlined />,
      },
      {
        key: "/ims/stock/adjustment",
        label: "Stock Adjustment",
        icon: <SlidersOutlined />,
      },
      {
        key: "/ims/stock/transfer",
        label: "Stock Transfer",
        icon: <SwapOutlined />,
      },
    ],
  },

  // Sales
  {
    icon: <img src={salesIcon} alt="Sales" className="w-6 h-6" />,
    key: "/ims/sales",
    label: "Sales",
    children: [
      { key: "/ims/sales/online-orders", label: "Online Orders", icon: <FileTextOutlined /> },
      { key: "/ims/sales/pos-orders", label: "POS Orders", icon: <FileTextOutlined /> },
      { key: "/ims/invoice", label: "Invoices", icon: <FileOutlined /> },
      { key: "/ims/sales/sales-return", label: "Sales Return", icon: <RollbackOutlined /> },
      { key: "/ims/quotation", label: "Quotation", icon: <FormOutlined /> },
      { key: "/ims/sales/pos", label: "POS", icon: <ShopOutlined /> },
    ],
  },

  // Purchases
  {
    icon: <img src={purchaseIcon} alt="Purchases" className="w-6 h-6" />,
    key: "/ims/purchases",
    label: "Purchases",
    children: [
      { key: "/ims/purchases/list", label: "Purchases", icon: <ShoppingOutlined /> },
      { key: "/ims/purchases/order", label: "Purchase Order", icon: <FileTextOutlined /> },
      { key: "/ims/purchases/return", label: "Purchase Return", icon: <RollbackOutlined /> },
    ],
  },

  // ✅ FINANCE & ACCOUNTS MODULE
  {
    icon: <img src={financeIcon} alt="Finance & Accounts" className="w-6 h-6" />,
    key: "/ims/FinanceAccounts",
    label: "Finance & Accounts",
    children: [
      { key: "/ims/FinanceAccounts/Expenses", label: "Expenses", icon: <DollarOutlined /> },
      { key: "/ims/FinanceAccounts/ExpenseCategory", label: "Expense Category", icon: <CalculatorOutlined /> },
      { key: "/ims/FinanceAccounts/Income", label: "Income", icon: <FundOutlined /> },
      { key: "/ims/FinanceAccounts/IncomeCategory", label: "Income Category", icon: <PieChartOutlined /> },
      { key: "/ims/FinanceAccounts/BankAccounts", label: "Bank Accounts", icon: <BankOutlined /> },
      { key: "/ims/FinanceAccounts/MoneyTransfer", label: "Money Transfer", icon: <TransactionOutlined /> },
      { key: "/ims/FinanceAccounts/BalanceSheet", label: "Balance Sheet", icon: <BarChartOutlined /> },
      { key: "/ims/FinanceAccounts/CashFlow", label: "Cash Flow", icon: <CreditCardOutlined /> },
      { key: "/ims/FinanceAccounts/AccountStatement", label: "Account Statement", icon: <AuditOutlined /> },
    ],
  },

  // ✅ PEOPLES MODULE
  {
    icon: (
      <div className="w-6 h-6 flex items-center justify-center">
        <TeamOutlined />
      </div>
    ),
    key: "/ims/peoples",
    label: "Peoples",
    children: [
      {
        key: "/ims/peoples/customers",
        label: "Customers",
        icon: <TeamOutlined />,
      },
      {
        key: "/ims/peoples/billers",
        label: "Billers",
        icon: <IdcardOutlined />,
      },
      {
        key: "/ims/peoples/suppliers",
        label: "Suppliers",
        icon: <SolutionOutlined />,
      },
      {
        key: "/ims/peoples/stores",
        label: "Stores",
        icon: <HomeOutlined />,
      },
      {
        key: "/ims/peoples/warehouses",
        label: "Warehouses",
        icon: <ApartmentOutlined />,
      },
    ],
  },

  // ✅ HRM MODULE (EmployeeList hidden)
  {
    icon: (
      <div className="w-6 h-6 flex items-center justify-center">
        <UserSwitchOutlined />
      </div>
    ),
    key: "/ims/hrm",
    label: "HRM",
    children: [
      {
        key: "/ims/hrm/employees",
        label: "Employees",
        icon: <UserOutlined />,
      },
      {
        key: "/ims/hrm/departments",
        label: "Departments",
        icon: <ClusterOutlined />,
      },
      {
        key: "/ims/hrm/designation",
        label: "Designation",
        icon: <BranchesOutlined />,
      },
    ],
  },

  // ✅ USER MANAGEMENT MODULE
  {
    icon: <img src={userManagementIcon} alt="User Management" className="w-6 h-6" />,
    key: "/ims/user-management",
    label: "User Management",
    children: [
      { key: "/ims/user-management/users", label: "Users", icon: <UserOutlined /> },
      { key: "/ims/user-management/roles-permissions", label: "Roles & Permissions", icon: <SafetyCertificateOutlined /> },
      { key: "/ims/user-management/delete-account-request", label: "Delete Account Request", icon: <DeleteOutlined /> },
    ],
  },
];

// ✅ Route Definitions
const IMSRoutes = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="dashboard" element={<div>IMS Dashboard</div>} />

      {/* Inventory */}
      <Route path="inventory/products" element={<Products />} />
      <Route path="inventory/createproducts" element={<CreateProducts />} />
      <Route path="inventory/Expiredproducts" element={<ExpiredProducts />} />
      <Route path="inventory/lowstocks" element={<LowStocks />} />
      <Route path="inventory/ProductCategory" element={<ProductCategory />} />
      <Route path="inventory/ProductSubCategory" element={<ProductSubCategory />} />
      <Route path="inventory/brands" element={<Brands />} />
      <Route path="inventory/units" element={<Units />} />
      <Route path="inventory/variantattributes" element={<VariantAttributes />} />
      <Route path="inventory/warranty" element={<Warranties />} />
      <Route path="inventory/print-barcode" element={<PrintBarcode />} />
      <Route path="inventory/print-qr" element={<PrintQRCode />} />
      <Route path="inventory/productdetails" element={<ProductDetails />} />

      {/* Coupons */}
      <Route path="coupons/coupons" element={<Coupons />} />
      <Route path="coupons/giftcards" element={<GiftCards />} />
      <Route path="coupons/discount" element={<Discount />} /> {/* ✅ Added Discount Route */}

      {/* Stock */}
      <Route path="stock/manage" element={<ManageStock />} />
      <Route path="stock/adjustment" element={<StockAdjustment />} />
      <Route path="stock/transfer" element={<StockTransfer />} />

      {/* Sales */}
      <Route path="sales/pos" element={<POS />} />
      <Route path="sales/online-orders" element={<OnlineOrder />} />
      <Route path="sales/pos-orders" element={<POSOrders />} />
      <Route path="invoice" element={<Invoices />} />
      <Route path="quotation" element={<Quotation />} />
      <Route path="sales/sales-return" element={<SalesReturn />} />

      {/* Purchases */}
      <Route path="purchases/list" element={<Purchases />} />
      <Route path="purchases/order" element={<PurchaseOrder />} />
      <Route path="purchases/return" element={<PurchaseReturn />} />

      {/* Finance & Accounts */}
      <Route path="FinanceAccounts/Expenses" element={<Expenses />} />
      <Route path="FinanceAccounts/ExpenseCategory" element={<ExpenseCategory />} />
      <Route path="FinanceAccounts/Income" element={<Income />} />
      <Route path="FinanceAccounts/IncomeCategory" element={<IncomeCategory />} />
      <Route path="FinanceAccounts/BankAccounts" element={<BankAccounts />} />
      <Route path="FinanceAccounts/MoneyTransfer" element={<MoneyTransfer />} />
      <Route path="FinanceAccounts/BalanceSheet" element={<BalanceSheet />} />
      <Route path="FinanceAccounts/CashFlow" element={<CashFlow />} />
      <Route path="FinanceAccounts/AccountStatement" element={<AccountStatement />} />

      {/* Peoples */}
      <Route path="peoples/customers" element={<Customers />} />
      <Route path="peoples/billers" element={<Billers />} />
      <Route path="peoples/suppliers" element={<Suppliers />} />
      <Route path="peoples/stores" element={<Stores />} />
      <Route path="peoples/warehouses" element={<Warehouses />} />

      {/* HRM */}
      <Route path="hrm/employeelist" element={<EmployeeList />} /> {/* ✅ Hidden Route */}
      <Route path="hrm/employees" element={<Employees />} />
      <Route path="hrm/addemployee" element={<AddEmployee />} />
      <Route path="hrm/departments" element={<Departments />} />
      <Route path="hrm/designation" element={<Designation />} />

      {/* User Management */}
      <Route path="user-management/users" element={<Users />} />
      <Route path="user-management/roles-permissions" element={<RolesPermissions />} />
      <Route path="user-management/delete-account-request" element={<DeleteAccountRequest />} />
    </Routes>
  );
};

export default IMSRoutes;
