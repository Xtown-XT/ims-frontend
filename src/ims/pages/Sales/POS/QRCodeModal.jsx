import React from "react";
import { Modal } from "antd";

export default function QRCodeModal({ visible, onClose, amount = 0 }) {
  // Simple QR code placeholder - in production, use a QR code library or API
  const QRCodePlaceholder = () => (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg-white">
      {/* QR code pattern using squares */}
      {/* Positioning squares for realistic QR code look */}
      <rect x="20" y="20" width="20" height="20" fill="black" />
      <rect x="40" y="20" width="20" height="20" fill="white" />
      <rect x="60" y="20" width="20" height="20" fill="black" />
      <rect x="80" y="20" width="20" height="20" fill="black" />
      <rect x="100" y="20" width="20" height="20" fill="white" />
      <rect x="120" y="20" width="20" height="20" fill="black" />
      <rect x="140" y="20" width="20" height="20" fill="white" />
      <rect x="160" y="20" width="20" height="20" fill="black" />
      
      <rect x="20" y="40" width="20" height="20" fill="white" />
      <rect x="40" y="40" width="20" height="20" fill="black" />
      <rect x="60" y="40" width="20" height="20" fill="white" />
      <rect x="80" y="40" width="20" height="20" fill="black" />
      <rect x="100" y="40" width="20" height="20" fill="black" />
      <rect x="120" y="40" width="20" height="20" fill="black" />
      <rect x="140" y="40" width="20" height="20" fill="black" />
      <rect x="160" y="40" width="20" height="20" fill="white" />
      
      <rect x="20" y="60" width="20" height="20" fill="black" />
      <rect x="40" y="60" width="20" height="20" fill="white" />
      <rect x="60" y="60" width="20" height="20" fill="black" />
      <rect x="80" y="60" width="20" height="20" fill="white" />
      <rect x="100" y="60" width="20" height="20" fill="white" />
      <rect x="120" y="60" width="20" height="20" fill="black" />
      <rect x="140" y="60" width="20" height="20" fill="white" />
      <rect x="160" y="60" width="20" height="20" fill="black" />
      
      <rect x="20" y="80" width="20" height="20" fill="black" />
      <rect x="40" y="80" width="20" height="20" fill="black" />
      <rect x="60" y="80" width="20" height="20" fill="black" />
      <rect x="80" y="80" width="20" height="20" fill="white" />
      <rect x="100" y="80" width="20" height="20" fill="black" />
      <rect x="120" y="80" width="20" height="20" fill="white" />
      <rect x="140" y="80" width="20" height="20" fill="black" />
      <rect x="160" y="80" width="20" height="20" fill="black" />
      
      <rect x="20" y="100" width="20" height="20" fill="white" />
      <rect x="40" y="100" width="20" height="20" fill="black" />
      <rect x="60" y="100" width="20" height="20" fill="white" />
      <rect x="80" y="100" width="20" height="20" fill="black" />
      <rect x="100" y="100" width="20" height="20" fill="white" />
      <rect x="120" y="100" width="20" height="20" fill="black" />
      <rect x="140" y="100" width="20" height="20" fill="white" />
      <rect x="160" y="100" width="20" height="20" fill="black" />
      
      <rect x="20" y="120" width="20" height="20" fill="black" />
      <rect x="40" y="120" width="20" height="20" fill="black" />
      <rect x="60" y="120" width="20" height="20" fill="white" />
      <rect x="80" y="120" width="20" height="20" fill="black" />
      <rect x="100" y="120" width="20" height="20" fill="white" />
      <rect x="120" y="120" width="20" height="20" fill="black" />
      <rect x="140" y="120" width="20" height="20" fill="black" />
      <rect x="160" y="120" width="20" height="20" fill="white" />
      
      <rect x="20" y="140" width="20" height="20" fill="white" />
      <rect x="40" y="140" width="20" height="20" fill="white" />
      <rect x="60" y="140" width="20" height="20" fill="black" />
      <rect x="80" y="140" width="20" height="20" fill="white" />
      <rect x="100" y="140" width="20" height="20" fill="black" />
      <rect x="120" y="140" width="20" height="20" fill="white" />
      <rect x="140" y="140" width="20" height="20" fill="black" />
      <rect x="160" y="140" width="20" height="20" fill="white" />
      
      <rect x="20" y="160" width="20" height="20" fill="black" />
      <rect x="40" y="160" width="20" height="20" fill="black" />
      <rect x="60" y="160" width="20" height="20" fill="black" />
      <rect x="80" y="160" width="20" height="20" fill="white" />
      <rect x="100" y="160" width="20" height="20" fill="white" />
      <rect x="120" y="160" width="20" height="20" fill="black" />
      <rect x="140" y="160" width="20" height="20" fill="black" />
      <rect x="160" y="160" width="20" height="20" fill="black" />
    </svg>
  );

  return (
    <Modal
      title={<span className="text-lg font-semibold">Amount to Pay: ${amount}</span>}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      bodyStyle={{ paddingTop: 20, paddingBottom: 20, textAlign: "center" }}
      closeIcon={<button className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">✕</button>}
    >
      <div className="flex flex-col items-center">
        {/* QR Code */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <QRCodePlaceholder />
        </div>
        
        {/* Instruction */}
        <p className="text-sm text-gray-600">
          Scan your Phone or UPI App to Complete the payment
        </p>
      </div>
    </Modal>
  );
}
