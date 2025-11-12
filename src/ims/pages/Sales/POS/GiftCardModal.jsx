import React, { useState } from "react";
import { Modal, Input, Button } from "antd";

export default function GiftCardModal({ visible, onClose }) {
  const [barcode, setBarcode] = useState("");

  const handleSubmit = () => {
    // Handle gift card submission
    console.log("Gift Card submitted:", barcode);
    onClose();
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold">Pay By Gift Card</span>}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      bodyStyle={{ paddingTop: 20, paddingBottom: 10 }}
      closeIcon={<button className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">✕</button>}
    >
      {/* Gift Card Image */}
      <div className="mb-6">
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-lg">
          {/* Diagonal stripe */}
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-red-600 via-yellow-500 to-orange-500 transform rotate-45 translate-x-12 translate-y-12"></div>
          
          {/* Card content */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            <div>
              <div className="text-white text-2xl font-bold">DISCOUNT CARD</div>
              <div className="text-gray-300 text-sm mt-1">VALID THRU 05/30</div>
            </div>
            <div className="flex items-end justify-between relative">
              <div className="text-white text-6xl font-bold relative z-20">50%</div>
              {/* Ribbon decoration - positioned over the 0 */}
              <div className="absolute right-16 bottom-8 z-10">
                <div className="relative">
                  {/* Main ribbon */}
                  <div className="w-12 h-12 bg-red-600 transform rotate-45"></div>
                  {/* Ribbon center circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-red-700 rounded-full"></div>
                  </div>
                  {/* Ribbon tails */}
                  <div className="absolute -top-2 left-0 w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-red-800"></div>
                  <div className="absolute -bottom-2 right-0 w-0 h-0 border-r-[12px] border-r-transparent border-t-[12px] border-t-red-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Input */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Scan Barcode / Enter Number</label>
        <div className="flex gap-2">
          <Input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter gift card code"
            className="flex-1"
          />
          <Button
            type="primary"
            className="bg-orange-500 hover:bg-orange-600"
            onClick={handleSubmit}
          >
            Check
          </Button>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-2 border-t mt-4">
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}
