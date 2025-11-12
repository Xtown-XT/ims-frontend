import React, { useState } from "react";
import { Modal, Input, Select, Button } from "antd";

const { Option } = Select;

export default function SplitBillModal({ visible, onClose, subtotal = 0 }) {
  const [payments, setPayments] = useState([
    { method: "Cash", amount: "" },
    { method: "Cash", amount: "" }
  ]);

  const handleMethodChange = (index, method) => {
    const updated = [...payments];
    updated[index].method = method;
    setPayments(updated);
  };

  const handleAmountChange = (index, amount) => {
    const updated = [...payments];
    updated[index].amount = amount;
    setPayments(updated);
  };

  const handleAddMore = () => {
    setPayments([...payments, { method: "Cash", amount: "" }]);
  };

  const handleCompleteSale = () => {
    console.log("Split payments:", payments);
    onClose();
  };

  const calculateTotal = () => {
    return payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  };

  const remaining = subtotal - calculateTotal();

  return (
    <Modal
      title={<span className="text-lg font-semibold">Split Payment</span>}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      bodyStyle={{ paddingTop: 20, paddingBottom: 10 }}
      closeIcon={<button className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">✕</button>}
    >
      {payments.map((payment, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-3">
            <label className="font-medium text-sm w-20">
              Payment {index + 1}
            </label>
            <Select
              value={payment.method}
              onChange={(val) => handleMethodChange(index, val)}
              className="w-32"
            >
              <Option value="Cash">Cash</Option>
              <Option value="Card">Card</Option>
              <Option value="Points">Points</Option>
              <Option value="Deposit">Deposit</Option>
              <Option value="Cheque">Cheque</Option>
              <Option value="Gift Card">Gift Card</Option>
              <Option value="Pay Later">Pay Later</Option>
              <Option value="External">External</Option>
            </Select>
            <Input
              type="number"
              placeholder="Enter Amount"
              value={payment.amount}
              onChange={(e) => handleAmountChange(index, e.target.value)}
              className="flex-1"
              prefix="$"
            />
            <Button
              type="primary"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Charge
            </Button>
          </div>
        </div>
      ))}

      <div className="mb-4">
        <Button
          onClick={handleAddMore}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
        >
          Add More
        </Button>
      </div>

      {/* Total Summary */}
      {payments.some(p => p.amount) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Total Paid:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Remaining:</span>
            <span className={remaining === 0 ? "text-green-600" : remaining > 0 ? "text-blue-600" : "text-red-600"}>
              ${Math.abs(remaining).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-2 border-t mt-4">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="primary"
          className="bg-purple-500 hover:bg-purple-600"
          onClick={handleCompleteSale}
        >
          Complete Sale
        </Button>
      </div>
    </Modal>
  );
}
