import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "antd";
import {
  FiSearch,
  FiPlus,
  FiMinus,
  FiShoppingCart,
  FiTag,
  FiRefreshCw,
  FiChevronDown,
  FiSettings,
} from "react-icons/fi";
import { FaUsers, FaRegCreditCard, FaMoneyBillAlt } from "react-icons/fa";
import PaymentModal from "./PosModal";
import GiftCardModal from "./GiftCardModal";
import QRCodeModal from "./QRCodeModal";
import SplitBillModal from "./SplitBillModal";
import HoldOrderModal from "./HoldOrderModal";

import LenovoIdeaPad3 from "../../Sales/assets/LenovoIdeaPad3.png";
import Bold from "../../Sales/assets/Bold.png";
import NikeJordan from "../../Sales/assets/NikeJordan.png";
import AppleWatch from "../../Sales/assets/AppleWatch.png";
import Iphone14Pro from "../../Sales/assets/Iphone14Pro.png";

const sampleProducts = [
  { id: 1, title: "IPhone 14 64GB", category: "Mobiles", price: 15800, img: Iphone14Pro },
  { id: 2, title: "MacBook Pro", category: "Laptops", price: 1000, img: LenovoIdeaPad3 },
  { id: 3, title: "Rolex Tribute V3", category: "Watches", price: 6800, img: AppleWatch },
  { id: 4, title: "Red Nike Angelo", category: "Shoes", price: 7800, img: NikeJordan },
  { id: 5, title: "Airpod 2", category: "Headset", price: 5478, img: Bold },
  { id: 6, title: "IdeaPad Slim 5 Gen 7", category: "Laptops", price: 1454, img: LenovoIdeaPad3 },
  { id: 7, title: "Tablet 1.02 inch", category: "Computer", price: 4744, img: LenovoIdeaPad3 },
  { id: 8, title: "Fossil Pair Of 3 in 1", category: "Watches", price: 789, img: AppleWatch },
];

const categories = [
  "All",
  "Headset",
  "Shoes",
  "Mobiles",
  "Watches",
  "Laptops",
  "Appliance",
  "Computer",
];

export default function POS() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [orderItems, setOrderItems] = useState([
    { id: 1, title: "iPhone 14 64GB", category: "Mobiles", price: 15800, qty: 1, img: Iphone14Pro },
    { id: 4, title: "Red Nike Angelo", category: "Shoes", price: 398, qty: 4, img: NikeJordan },
    { id: 3, title: "Rolex Tribute V3", category: "Watches", price: 6800, qty: 1, img: AppleWatch },
  ]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: "James Anderson",
    phone: "",
    email: "",
    bonus: 148,
    loyalty: 20,
    country: "",
    city: "",
    address: ""
  });

  // NEW: modal state + payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showGiftCardModal, setShowGiftCardModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSplitBillModal, setShowSplitBillModal] = useState(false);
  const [showHoldOrderModal, setShowHoldOrderModal] = useState(false);
  const [showPaymentCompletedModal, setShowPaymentCompletedModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showRecentTransactionsModal, setShowRecentTransactionsModal] = useState(false);
  const [showViewOrdersModal, setShowViewOrdersModal] = useState(false);
  const [paymentType, setPaymentType] = useState("Cash");
  const [paymentData, setPaymentData] = useState({
    receivedAmount: "",
    payingAmount: "",
    paymentType: "Cash",
    paymentReceiver: "",
    paymentNote: "",
    saleNote: "",
    staffNote: ""
  });

  // Sample transaction data
  const [allTransactions] = useState({
    Purchase: [
      {
        id: 1,
        customer: "Carl Evans",
        reference: "INV/SL0101",
        date: "24 Dec 2024",
        amount: "$1000",
        avatar: "https://i.pravatar.cc/150?img=12"
      },
      {
        id: 2,
        customer: "Minerva Rameriz",
        reference: "INV/SL0102",
        date: "10 Dec 2024",
        amount: "$1500",
        avatar: "https://i.pravatar.cc/150?img=47"
      },
      {
        id: 3,
        customer: "Robert Lamon",
        reference: "INV/SL0103",
        date: "27 Nov 2024",
        amount: "$1500",
        avatar: "https://i.pravatar.cc/150?img=13"
      },
      {
        id: 4,
        customer: "Patricia Lewis",
        reference: "INV/SL0104",
        date: "18 Nov 2024",
        amount: "$2000",
        avatar: "https://i.pravatar.cc/150?img=45"
      },
      {
        id: 5,
        customer: "Mark Joslyn",
        reference: "INV/SL0105",
        date: "06 Nov 2024",
        amount: "$800",
        avatar: "https://i.pravatar.cc/150?img=14"
      },
      {
        id: 6,
        customer: "Marsha Betts",
        reference: "INV/SL0106",
        date: "25 Oct 2024",
        amount: "$750",
        avatar: "https://i.pravatar.cc/150?img=20"
      },
      {
        id: 7,
        customer: "Daniel Jude",
        reference: "INV/SL0107",
        date: "14 Oct 2024",
        amount: "$1300",
        avatar: "https://i.pravatar.cc/150?img=16"
      }
    ],
    Payment: [
      {
        id: 8,
        customer: "Emma Watson",
        reference: "PAY/001",
        date: "23 Dec 2024",
        amount: "$500",
        avatar: "https://i.pravatar.cc/150?img=25"
      },
      {
        id: 9,
        customer: "John Smith",
        reference: "PAY/002",
        date: "22 Dec 2024",
        amount: "$750",
        avatar: "https://i.pravatar.cc/150?img=30"
      }
    ],
    Return: [
      {
        id: 10,
        customer: "Alice Johnson",
        reference: "RET/001",
        date: "21 Dec 2024",
        amount: "$200",
        avatar: "https://i.pravatar.cc/150?img=35"
      },
      {
        id: 11,
        customer: "Bob Wilson",
        reference: "RET/002",
        date: "20 Dec 2024",
        amount: "$150",
        avatar: "https://i.pravatar.cc/150?img=40"
      }
    ]
  });

  const [activeTransactionTab, setActiveTransactionTab] = useState("Purchase");
  const [transactionSearchTerm, setTransactionSearchTerm] = useState("");

  const handleQuickCash = (amount) => {
    setPaymentData({
      ...paymentData,
      receivedAmount: amount.toString(),
      payingAmount: subtotal.toString()
    });
  };

  const calculateChange = () => {
    const received = parseFloat(paymentData.receivedAmount) || 0;
    const paying = parseFloat(paymentData.payingAmount) || 0;
    return (received - paying).toFixed(2);
  };



  const filtered = useMemo(() => {
    return sampleProducts.filter((p) => {
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (query.trim() === "") return true;
      return p.title.toLowerCase().includes(query.toLowerCase());
    });
  }, [selectedCategory, query]);

  function addToOrder(product) {
    setOrderItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setOrderItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
        .filter((it) => it.qty > 0)
    );
  }

  function clearOrder() {
    setOrderItems([]);
  }

  // Handle reset confirmation
  const handleResetConfirm = () => {
    setOrderItems([]);
    setCustomerData({
      name: "Walk in Customer",
      phone: "",
      email: "",
      bonus: 148,
      loyalty: 20,
      country: "",
      city: "",
      address: ""
    });
    setShowResetConfirmModal(false);
    console.log("Order reset successfully");
  };

  const subtotal = orderItems.reduce((s, it) => s + it.price * it.qty, 0);



  return (
    <div className="w-full h-screen overflow-hidden bg-gray-50 text-slate-800">
      <div className="flex w-full gap-4 px-6 pt-6 pb-24">
        <div className="flex gap-6 flex-1">
          <div className="w-24 md:w-32 flex-shrink-0 border-r border-gray-200 pr-3">
            <div className="flex flex-col gap-3 sticky top-6" style={{ alignItems: "center" }}>
              {categories.map((c) => {
                const active = selectedCategory === c;
                const categoryImages = {
                  All: Iphone14Pro,
                  Headset: Bold,
                  Shoes: NikeJordan,
                  Mobiles: Iphone14Pro,
                  Watches: AppleWatch,
                  Laptops: LenovoIdeaPad3,
                  Appliance: Bold,
                  Computer: LenovoIdeaPad3,
                };
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`w-20 flex flex-col items-center justify-center py-3 px-2 rounded-lg border transition-all duration-200 ${active ? "border-purple-400 bg-white shadow-md" : "bg-white/80 hover:bg-white"
                      }`}
                    title={c}
                  >
                    <div
                      className={`w-10 h-10 rounded-md flex items-center justify-center mb-2 overflow-hidden ${active ? "bg-purple-50" : "bg-gray-50"
                        }`}
                    >
                      <img
                        src={categoryImages[c]}
                        alt={c}
                        className="object-contain w-8 h-8"
                      />
                    </div>
                    <span
                      className={`text-xs font-medium text-center ${active ? "text-purple-500" : "text-slate-600"
                        }`}
                    >
                      {c}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 pl-4">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-slate-800">
                Welcome, Wesley Adrian
              </h2>
              <div className="text-sm text-slate-500 mt-1">December 24, 2024</div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="relative w-full md:w-72">
                <FiSearch className="absolute left-3 top-3 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Product"
                  className="pl-10 pr-4 py-2.5 w-full border rounded-lg bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 rounded-lg text-white bg-slate-900 shadow-md text-sm font-medium hover:bg-slate-800 transition-all">
                  View All Brands
                </button>

                <button
                  onClick={() => setFeaturedOnly((s) => !s)}
                  className={`px-5 py-2.5 rounded-lg text-white shadow-md text-sm font-medium flex items-center gap-2 transition-all ${featuredOnly
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-purple-500 hover:bg-purple-600"
                    }`}
                >
                  <FiTag />
                  Featured
                </button>
              </div>
            </div>

            <div
              className="overflow-y-auto pr-2"
              style={{
                height: "calc(100vh - 110px)",
                scrollbarWidth: "thin",
                scrollbarColor: "#cbd5e1 #f1f5f9",
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                {filtered.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-green-400 transition-all duration-200 flex flex-col justify-between relative"
                  >
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs opacity-0">
                      ✓
                    </div>

                    <div className="flex-1">
                      <div className="h-32 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        <img
                          src={p.img}
                          alt={p.title}
                          className="object-contain h-full w-full hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="text-xs text-slate-500 mb-1">{p.category}</div>
                      <div className="font-semibold text-sm">{p.title}</div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-lg font-bold text-slate-800">${p.price}</div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToOrder(p)}
                          className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center hover:bg-purple-100 hover:text-purple-500 transition-colors"
                        >
                          <FiMinus className="text-sm" />
                        </button>

                        <span className="text-sm font-medium px-2">4</span>

                        <button
                          onClick={() => addToOrder(p)}
                          className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center hover:bg-purple-100 hover:text-purple-500 transition-colors"
                        >
                          <FiPlus className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order List Section */}
        <div className="w-80 lg:w-96 flex-shrink-0">
          <div
            className="bg-white rounded-lg border shadow-sm overflow-y-auto"
            style={{
              height: "calc(100vh - 110px)",
              position: "relative",
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 #f1f5f9",
            }}
          >
            {/* Order List Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-800">Order List</h3>
              <div className="flex gap-2 items-center">
                <div className="text-xs px-3 py-1 rounded-md bg-slate-900 text-white font-medium">#ORD123</div>
                <button 
                  onClick={() => setShowResetConfirmModal(true)}
                  className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Clear Order"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Customer Information Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Information</label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  >
                    <option>Walk in Customer</option>
                    <option>James Anderson</option>
                    <option>Sarah Wilson</option>
                    <option>Mike Johnson</option>
                  </select>
                  <button
                    onClick={() => setShowCustomerModal(true)}
                    className="px-3 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                    title="Add Customer"
                  >
                    <FaUsers />
                  </button>
                  <button 
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    title="Customer Options"
                  >
                    <FiChevronDown />
                  </button>
                </div>

                {/* Customer Details Card */}
                {customerData.name === "James Anderson" && (
                  <div className="mt-3 border border-orange-200 bg-orange-50 rounded-lg p-4">
                    <div className="font-bold text-lg text-gray-800 mb-3">{customerData.name}</div>
                    <div className="flex items-center gap-3 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-medium">Bonus :</span>
                        <span className="px-2 py-1 bg-cyan-500 text-white rounded text-sm font-bold">
                          148
                        </span>
                      </div>
                      <div className="text-gray-300 font-bold">|</div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-medium">Loyalty :</span>
                        <span className="px-2 py-1 bg-emerald-500 text-white rounded text-sm font-bold">
                          $20
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        console.log("Apply customer benefits");
                        // Apply customer discounts/benefits logic here
                      }}
                      className="w-full py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-all"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Order Details Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-semibold text-gray-800">
                    Order Details <span className="text-gray-400 text-sm ml-2">Items : {orderItems.length}</span>
                  </h4>
                  <button 
                    onClick={clearOrder} 
                    className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                {orderItems.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    No items in order. Click product to add.
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 bg-gray-50 px-3 py-2 border-b text-xs font-semibold text-gray-600">
                      <div className="col-span-6">Item</div>
                      <div className="col-span-3 text-center">QTY</div>
                      <div className="col-span-3 text-right">Cost</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {orderItems.map((it) => (
                        <div key={it.id} className="grid grid-cols-12 gap-2 px-3 py-3 items-center hover:bg-gray-50 transition-colors">
                          <div className="col-span-6 flex items-center gap-2">
                            <button
                              onClick={() => changeQty(it.id, -it.qty)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Remove item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-800 truncate">{it.title}</div>
                              <div className="text-xs text-gray-500">${it.price} each</div>
                            </div>
                          </div>

                          <div className="col-span-3 flex items-center justify-center gap-2">
                            <button
                              onClick={() => changeQty(it.id, -1)}
                              className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600 transition-colors"
                            >
                              −
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{it.qty}</span>
                            <button
                              onClick={() => changeQty(it.id, +1)}
                              className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <div className="col-span-3 text-right">
                            <div className="text-sm font-semibold text-gray-800">${(it.price * it.qty).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Discount Section */}
              <div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-purple-700">Discount 5%</div>
                      <div className="text-xs text-purple-600">
                        For $20 Minimum Purchase, all Items
                      </div>
                    </div>
                    <button className="text-purple-700 hover:text-purple-800 font-bold text-lg">
                      −
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Summary Section */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">$40.21</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium">$25</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Coupon</span>
                    <span className="font-medium text-green-600">-$25</span>
                  </div>
                  <div className="border-t pt-2 mt-3">
                    <div className="flex justify-between items-center text-base font-semibold text-gray-800">
                      <span>Sub Total</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-3">
                    <div className="text-lg font-bold text-purple-800">
                      Total Payable: ${subtotal.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Select Payment Section */}
              <div className="border-t pt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Select Payment</h4>
                <div className="grid grid-cols-3 gap-2">
                  {/* Cash button */}
                  <button
                    onClick={() => {
                      setPaymentType("Cash");
                      setShowPaymentModal(true);
                    }}
                    className="flex items-center gap-2 justify-center py-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">💵</span>
                    <span className="text-sm">Cash</span>
                  </button>

                  {/* Card button */}
                  <button
                    onClick={() => {
                      setPaymentType("Card");
                      setShowPaymentModal(true);
                    }}
                    className="flex items-center gap-2 justify-center py-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">💳</span>
                    <span className="text-sm">Card</span>
                  </button>

                  {/* Points button */}
                  <button
                    onClick={() => {
                      setPaymentType("Points");
                      setShowPaymentModal(true);
                    }}
                    className="flex items-center gap-2 justify-center py-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">⭐</span>
                    <span className="text-sm">Points</span>
                  </button>

                  {/* Deposit button */}
                  <button
                    onClick={() => {
                      setPaymentType("Deposit");
                      setShowPaymentModal(true);
                    }}
                    className="flex items-center gap-2 justify-center py-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">👛</span>
                    <span className="text-sm">Deposit</span>
                  </button>

                  {/* Cheque button */}
                  <button
                    onClick={() => {
                      setPaymentType("Cheque");
                      setShowPaymentModal(true);
                    }}
                    className="flex items-center gap-2 justify-center py-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">📝</span>
                    <span className="text-sm">Cheque</span>
                  </button>

                  {/* Gift Card button */}
                  <button 
                    onClick={() => setShowGiftCardModal(true)}
                    className="flex items-center gap-2 justify-center py-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">🎁</span>
                    <span className="text-sm">Gift Card</span>
                  </button>

                  {/* Scan button */}
                  <button 
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center gap-2 justify-center py-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">📱</span>
                    <span className="text-sm">Scan</span>
                  </button>

                  {/* Pay Later button */}
                  <button className="flex items-center gap-2 justify-center py-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                    <span className="text-xl">💰</span>
                    <span className="text-sm">Pay Later</span>
                  </button>

                  {/* External button */}
                  <button className="flex items-center gap-2 justify-center py-3 rounded-lg border-2 border-purple-400 bg-white hover:bg-purple-50 transition-colors">
                    <span className="text-xl">🔌</span>
                    <span className="text-sm text-purple-500 font-semibold">External</span>
                  </button>
                </div>

                {/* Split Bill button */}
                <button 
                  onClick={() => setShowSplitBillModal(true)}
                  className="w-full mt-3 py-3 rounded-lg border bg-white hover:bg-gray-50 flex items-center gap-2 justify-center transition-colors"
                >
                  <span className="text-xl">🤝</span>
                  <span>Split Bill</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                <button 
                  onClick={() => setShowHoldOrderModal(true)}
                  className="flex-1 py-3 rounded-lg border bg-white hover:bg-gray-100 transition-colors font-medium"
                >
                  Print Order
                </button>
                <button className="flex-1 py-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors font-medium">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Add Customer</h3>
              <button
                onClick={() => setShowCustomerModal(false)}
                className="text-white hover:bg-white/20 rounded-sm w-8 h-8 flex items-center justify-center transition-colors text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Walk in Customer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Enter Email Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Enter Phone Number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Country
                  </label>
                  <select
                    value={customerData.country}
                    onChange={(e) => setCustomerData({ ...customerData, country: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                  >
                    <option>Choose</option>
                    <option>United States</option>
                    <option>India</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={customerData.city}
                    onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Enter City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={customerData.address}
                    onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Enter Address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Loyalty Point
                  </label>
                  <input
                    type="number"
                    value={customerData.loyalty}
                    onChange={(e) => setCustomerData({ ...customerData, loyalty: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bonus Point
                  </label>
                  <input
                    type="number"
                    value={customerData.bonus}
                    onChange={(e) => setCustomerData({ ...customerData, bonus: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Customer Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors cursor-pointer bg-white">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-orange-500 font-semibold mb-1">
                      Click to upload <span className="text-slate-500 font-normal">or drag and drop</span>
                    </p>
                    <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="px-8 py-2.5 border border-gray-300 rounded hover:bg-gray-50 font-medium text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="px-8 py-2.5 bg-orange-500 text-white rounded hover:bg-orange-600 font-medium transition-all"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="fixed left-0 right-0 bottom-0 bg-white/95 border-t py-4 z-50">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-center gap-4">
          <button 
            onClick={() => setShowHoldOrderModal(true)}
            className="px-6 py-3 rounded-lg bg-orange-500 text-white flex items-center gap-2 shadow hover:bg-orange-600"
          >
            <div className="w-3 h-3 bg-white rounded"></div> Hold
          </button>

          <button 
            onClick={() => {
              if (orderItems.length > 0) {
                setShowResetConfirmModal(true);
              } else {
                console.log("No items to void");
              }
            }}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white flex items-center gap-2 shadow hover:bg-blue-700"
          >
            Void
          </button>

          <button 
            onClick={() => {
              setPaymentType("Cash");
              setShowPaymentModal(true);
            }}
            className="px-6 py-3 rounded-lg bg-teal-500 text-white flex items-center gap-2 shadow hover:bg-teal-600"
          >
            Payment
          </button>

          <button 
            onClick={() => setShowViewOrdersModal(true)}
            className="px-6 py-3 rounded-lg bg-slate-900 text-white flex items-center gap-2 shadow hover:bg-slate-800"
          >
            View Orders
          </button>

          <button 
            onClick={() => setShowResetConfirmModal(true)}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white flex items-center gap-2 shadow hover:bg-indigo-700"
          >
            Reset
          </button>

          <button 
            onClick={() => setShowRecentTransactionsModal(true)}
            className="px-6 py-3 rounded-lg bg-red-500 text-white flex items-center gap-2 shadow hover:bg-red-600"
          >
            Transaction
          </button>
        </div>
      </div>

      {/* Payment modal - opens when Cash, Card, Points, Deposit, or Cheque button clicked */}
      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentType={paymentType}
        subtotal={subtotal}
        paymentData={paymentData}
        setPaymentData={setPaymentData}
        onPaymentComplete={() => setShowPaymentCompletedModal(true)}
      />

      {/* Gift Card modal - opens when Gift Card button clicked */}
      <GiftCardModal
        visible={showGiftCardModal}
        onClose={() => setShowGiftCardModal(false)}
      />

      {/* QR Code modal - opens when Scan button clicked */}
      <QRCodeModal
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
        amount={subtotal}
      />

      {/* Split Bill modal - opens when Split Bill button clicked */}
      <SplitBillModal
        visible={showSplitBillModal}
        onClose={() => setShowSplitBillModal(false)}
        subtotal={subtotal}
      />

      {/* Hold Order modal - opens when Print Order button clicked */}
      <HoldOrderModal
        visible={showHoldOrderModal}
        onClose={() => setShowHoldOrderModal(false)}
        subtotal={subtotal}
      />

      {/* Payment Completed Modal */}
      <Modal
        open={showPaymentCompletedModal}
        onCancel={() => setShowPaymentCompletedModal(false)}
        footer={null}
        centered
        width={500}
        bodyStyle={{ paddingTop: 20, paddingBottom: 10 }}
        closeIcon={<button className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">✕</button>}
      >
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Completed</h2>
          
          {/* Description */}
          <p className="text-gray-600 mb-6">Do you want to Print Receipt for the Completed Order</p>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => {
                console.log("Print Receipt clicked");
                setShowPaymentCompletedModal(false);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Print Receipt
            </button>
            <button 
              onClick={() => {
                console.log("Next Order clicked");
                setShowPaymentCompletedModal(false);
                // Reset order items for next order
                setOrderItems([]);
              }}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
            >
              Next Order
            </button>
          </div>
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        open={showResetConfirmModal}
        onCancel={() => setShowResetConfirmModal(false)}
        footer={null}
        centered
        width={500}
        bodyStyle={{ paddingTop: 20, paddingBottom: 10 }}
        closeIcon={<button className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">✕</button>}
      >
        <div className="text-center">
          {/* Warning Icon */}
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Your Action</h2>
          
          {/* Description */}
          <p className="text-gray-600 mb-6">The current order will be cleared. But not deleted if it's persistent. Would you like to proceed ?</p>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => setShowResetConfirmModal(false)}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
            >
              No, Cancel
            </button>
            <button 
              onClick={handleResetConfirm}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
            >
              Yes, Proceed
            </button>
          </div>
        </div>
      </Modal>

      {/* Recent Transactions Modal */}
      <Modal
        title={<span className="text-xl font-semibold text-gray-800">Recent Transactions</span>}
        open={showRecentTransactionsModal}
        onCancel={() => setShowRecentTransactionsModal(false)}
        footer={null}
        width={900}
        bodyStyle={{ paddingTop: 20, paddingBottom: 10 }}
        closeIcon={<button className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">✕</button>}
      >
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4">
          {["Purchase", "Payment", "Return"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTransactionTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTransactionTab === tab
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
              <span className={`px-2 py-1 rounded-full text-xs ${
                activeTransactionTab === tab
                  ? "bg-white bg-opacity-20 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}>
                {allTransactions[tab]?.length || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={transactionSearchTerm}
              onChange={(e) => setTransactionSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            <FiSettings />
          </button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Reference</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {(allTransactions[activeTransactionTab] || [])
                .filter(transaction => 
                  transaction.customer.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
                  transaction.reference.toLowerCase().includes(transactionSearchTerm.toLowerCase())
                )
                .map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={transaction.avatar}
                        alt={transaction.customer}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-800">{transaction.customer}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{transaction.reference}</td>
                  <td className="py-3 px-4 text-gray-600">{transaction.date}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800">{transaction.amount}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => console.log("View transaction:", transaction.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="View"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => console.log("Edit transaction:", transaction.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => console.log("Delete transaction:", transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Row Per Page</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-600">Entries</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="px-3 py-1 bg-orange-500 text-white rounded">1</span>
            <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </Modal>

      {/* View Orders Modal */}
      <Modal
        title={<span className="text-xl font-semibold text-gray-800">Current Orders</span>}
        open={showViewOrdersModal}
        onCancel={() => setShowViewOrdersModal(false)}
        footer={null}
        width={600}
        bodyStyle={{ paddingTop: 20, paddingBottom: 10 }}
        closeIcon={<button className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">✕</button>}
      >
        <div className="space-y-4">
          {orderItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No items in current order</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={item.img} alt={item.title} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">${(item.price * item.qty).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-orange-600">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
