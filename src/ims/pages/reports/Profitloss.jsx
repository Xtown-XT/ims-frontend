import React from "react";
import { DatePicker, Button } from "antd";
import { IoReloadOutline } from "react-icons/io5";
import { FaAngleUp } from "react-icons/fa6";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;

const columns = [
  "Jan 2025",
  "Feb 2025",
  "Mar 2025",
  "Apr 2025",
  "May 2025",
  "Jun 2025",
];

const rows = [
  { key: "income-section", label: "Income", type: "section" },
  {
    key: "income-sales",
    label: "Sales",
    values: [50000, 50000, 50000, 50000, 50000, 50000],
  },
  {
    key: "income-service",
    label: "Service",
    values: [30000, 30000, 30000, 30000, 30000, 30000],
  },
  {
    key: "income-purchase-return",
    label: "Purchase Return",
    values: [7000, 7000, 7000, 7000, 7000, 7000],
  },
  {
    key: "gross-profit",
    label: "Gross Profit",
    values: [8000, 8000, 8000, 8000, 8000, 8000],
    type: "highlight",
  },
  { key: "expense-section", label: "Expenses", type: "section" },
  {
    key: "expense-sales",
    label: "Sales",
    values: [50000, 50000, 50000, 50000, 50000, 50000],
  },
  {
    key: "expense-purchase",
    label: "Purchase",
    values: [30000, 30000, 30000, 30000, 30000, 30000],
  },
  {
    key: "expense-sales-return",
    label: "Sales Return",
    values: [7000, 7000, 7000, 7000, 7000, 7000],
  },
  {
    key: "total-expense",
    label: "Total Expense",
    values: [8000, 8000, 8000, 8000, 8000, 8000],
    type: "highlight",
  },
  {
    key: "net-profit",
    label: "Net Profit",
    values: [8000, 8000, 8000, 8000, 8000, 8000],
    type: "highlight",
  },
];

const Profitloss = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
        }}
      >
        <div
          style={{
            padding: "24px 28px 20px",
            borderBottom: "1px solid #eef2f6",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Profit / Loss Report
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              View Reports of Profit / Loss Report
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              icon={<IoReloadOutline size={18} color="#9333ea" />}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                borderColor: "#e0e7ff",
                color: "#9333ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f3ff",
              }}
            />
            <Button
              icon={<FaAngleUp size={16} color="#9333ea" />}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                borderColor: "#e0e7ff",
                color: "#9333ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f3ff",
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: "24px 28px",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <RangePicker
            defaultValue={[dayjs("2025-11-07"), dayjs("2025-11-13")]}
            format="MM/DD/YYYY"
            style={{
              height: 42,
              borderRadius: 12,
            }}
          />
          <Button
            type="primary"
            style={{
              height: 42,
              borderRadius: 12,
              padding: "0 22px",
              backgroundColor: "#9333ea",
              borderColor: "#9333ea",
              fontWeight: 600,
            }}
          >
            Generate Report
          </Button>
        </div>

        <div style={{ padding: "0 28px 28px" }}>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: 0,
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  <th
                    style={{
                      width: 220,
                      padding: "16px 20px",
                      borderBottom: "1px solid #e2e8f0",
                      fontWeight: 600,
                      color: "#0f172a",
                      textAlign: "left",
                      fontSize: 14,
                    }}
                  >
                    &nbsp;
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column}
                      style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #e2e8f0",
                        fontWeight: 600,
                        color: "#1e293b",
                        textAlign: "right",
                        fontSize: 14,
                      }}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  if (row.type === "section") {
                    return (
                      <tr
                        key={row.key}
                        style={{
                          backgroundColor: "#fbfcff",
                        }}
                      >
                        <td
                          colSpan={columns.length + 1}
                          style={{
                            padding: "14px 20px",
                            fontWeight: 600,
                            color: "#0f172a",
                            fontSize: 14,
                          }}
                        >
                          {row.label}
                        </td>
                      </tr>
                    );
                  }

                  const isHighlight = row.type === "highlight";

                  return (
                    <tr key={row.key}>
                      <td
                        style={{
                          padding: "16px 20px",
                          borderBottom: "1px solid #f1f5f9",
                          fontWeight: isHighlight ? 700 : 500,
                          color: isHighlight ? "#0f172a" : "#475569",
                          fontSize: 14,
                          backgroundColor: "#fff",
                        }}
                      >
                        {row.label}
                      </td>
                      {row.values.map((value, index) => (
                        <td
                          key={`${row.key}-${index}`}
                          style={{
                            padding: "16px 20px",
                            borderBottom: "1px solid #f1f5f9",
                            textAlign: "right",
                            fontWeight: isHighlight ? 700 : 500,
                            color: isHighlight ? "#0f172a" : "#1e293b",
                            fontSize: 14,
                            backgroundColor: "#fff",
                          }}
                        >
                          {formatCurrency(value)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profitloss;