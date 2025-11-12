import React, { useEffect, useState } from "react";
import { Modal, Input, Select, Button } from "antd";

const { TextArea } = Input;
const { Option } = Select;

export default function PaymentModal({
  visible,
  onClose,
  paymentType = "Cash",
  subtotal = 0,
  paymentData,
  setPaymentData,
  onPaymentComplete,
}) {
  const [received, setReceived] = useState("");
  const [paying, setPaying] = useState("");
  const [change, setChange] = useState(0);
  const [balancePoint, setBalancePoint] = useState(200);
  const [receiver, setReceiver] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [saleNote, setSaleNote] = useState("");
  const [staffNote, setStaffNote] = useState("");

  // Initialize values when modal opens
  useEffect(() => {
    if (visible && subtotal > 0) {
      setPaying(subtotal.toString());
      setReceived(subtotal.toString());
    }
  }, [visible, subtotal]);

  // Auto update paying and change
  useEffect(() => {
    const receivedAmt = parseFloat(received) || 0;
    const payingAmt = parseFloat(paying) || 0;
    const diff = receivedAmt - payingAmt;
    setChange(diff > 0 ? diff : 0);
  }, [received, paying]);

  const quickCashValues = [10, 20, 50, 100, 500, 1000];

  const handleQuickCash = (value) => {
    setReceived(value);
    setPaying(value);
  };

  const handleSubmit = () => {
    const data = {
      received,
      paying,
      change,
      paymentType,
      receiver,
      paymentNote,
      saleNote,
      staffNote,
    };
    setPaymentData(data);
    onClose();
    // Trigger payment completion modal
    if (onPaymentComplete) {
      onPaymentComplete();
    }
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold">Finalize Sale</span>}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      bodyStyle={{ paddingTop: 20, paddingBottom: 10 }}
    >
      {/* Amount Inputs */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block font-medium mb-1">
            Received Amount <span className="text-red-500">*</span>
          </label>
          <Input
            prefix="$"
            type="number"
            value={received}
            onChange={(e) => setReceived(e.target.value)}
            placeholder="Enter received amount"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Paying Amount <span className="text-red-500">*</span>
          </label>
          <Input
            prefix="$"
            type="number"
            value={paying}
            onChange={(e) => setPaying(e.target.value)}
            placeholder="Enter paying amount"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            {paymentType === "Points" ? "Balance Point" : "Change"}
          </label>
          <Input 
            prefix={paymentType === "Points" ? undefined : "$"} 
            value={paymentType === "Points" ? balancePoint : change.toFixed(2)} 
            readOnly 
          />
        </div>
      </div>

      {/* Payment Type */}
      <div className="mb-4">
        <label className="block font-medium mb-1">
          Payment Type <span className="text-red-500">*</span>
        </label>
        <Select
          value={paymentType}
          className="w-full"
          onChange={(val) => setPaymentData({ ...paymentData, paymentType: val })}
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
      </div>

      {/* Points Information - shown only when Points is selected */}
      {paymentType === "Points" && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-green-700 font-semibold">You have 2000 Points to Use</div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">
              Use for this Purchase
            </button>
          </div>
        </div>
      )}

      {/* Quick Cash - hidden for Points payment */}
      {paymentType !== "Points" && (
        <div className="mb-4">
          <label className="block font-medium mb-2">Quick Cash</label>
          <div className="grid grid-cols-6 gap-2">
            {quickCashValues.map((val) => (
              <button
                key={val}
                onClick={() => handleQuickCash(val)}
                className={`py-2 border rounded-md ${
                  Number(received) === val
                    ? "border-purple-400 bg-purple-50 text-purple-600"
                    : "border-gray-300 bg-white hover:bg-gray-50"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section */}
      <div className="mb-3">
        <label className="block font-medium mb-1">Payment Receiver</label>
        <Input
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="Enter receiver name"
        />
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1">Payment Note</label>
        <TextArea
          rows={2}
          value={paymentNote}
          onChange={(e) => setPaymentNote(e.target.value)}
          placeholder="Type your message"
        />
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1">Sale Note</label>
        <TextArea
          rows={2}
          value={saleNote}
          onChange={(e) => setSaleNote(e.target.value)}
          placeholder="Type your message"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Staff Note</label>
        <TextArea
          rows={2}
          value={staffNote}
          onChange={(e) => setStaffNote(e.target.value)}
          placeholder="Type your message"
        />
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-2 border-t mt-4">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="primary"
          className="bg-purple-500 hover:bg-purple-600"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}
