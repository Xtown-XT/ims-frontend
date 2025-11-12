import React, { useState } from "react";
import { Modal, Input, Button } from "antd";

export default function HoldOrderModal({ visible, onClose, subtotal = 0 }) {
  const [orderReference, setOrderReference] = useState("");

  const handleConfirm = () => {
    // Handle hold order
    console.log("Order held with reference:", orderReference);
    onClose();
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold">Hold order</span>}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      bodyStyle={{ paddingTop: 20, paddingBottom: 10 }}
      closeIcon={<button className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">✕</button>}
    >
      {/* Amount Display */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-gray-800">{subtotal % 1 === 0 ? subtotal.toFixed(0) : subtotal.toFixed(2)}</div>
      </div>

      {/* Order Reference */}
      <div className="mb-4">
        <label className="block font-medium mb-2">
          Order Reference <span className="text-red-500">*</span>
        </label>
        <Input
          value={orderReference}
          onChange={(e) => setOrderReference(e.target.value)}
          placeholder="Enter order reference"
        />
      </div>

      {/* Explanation */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          The current order will be set on hold. You can retrieve this order from the pending order button. Providing a reference to it might help you to identify the order more quickly.
        </p>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-2 border-t mt-4">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="primary"
          className="bg-orange-500 hover:bg-orange-600"
          onClick={handleConfirm}
          disabled={!orderReference.trim()}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
