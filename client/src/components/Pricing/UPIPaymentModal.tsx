import React, { useState } from "react";
import {
  X,
  Copy,
  CheckCircle,
  Smartphone,
  ExternalLink,
  AlertCircle,
  Shield,
  Zap,
} from "lucide-react";
import "./UPIPaymentModal.css";

interface Plan {
  id: string;
  name: string;
  gradient: string;
  icon: React.ReactNode;
}

interface UPIPaymentModalProps {
  plan: Plan;
  amount: number;
  billingCycle: "monthly" | "yearly";
  onClose: () => void;
}

const UPI_ID = "deepakvaishnav45@nyes";
const MERCHANT_NAME = "StudySync";

// UPI Payment Apps with deep links
const upiApps = [
  {
    id: "phonepe",
    name: "PhonePe",
    color: "#5f259f",
    textColor: "#fff",
    emoji: "📱",
    getUrl: (upiId: string, amount: number, note: string) =>
      `phonepe://pay?pa=${upiId}&pn=${MERCHANT_NAME}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
    fallbackUrl: "https://www.phonepe.com/app-download/",
  },
  {
    id: "gpay",
    name: "Google Pay",
    color: "#4285f4",
    textColor: "#fff",
    emoji: "💳",
    getUrl: (upiId: string, amount: number, note: string) =>
      `tez://upi/pay?pa=${upiId}&pn=${MERCHANT_NAME}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
    fallbackUrl: "https://pay.google.com/",
  },
  {
    id: "paytm",
    name: "Paytm",
    color: "#00baf2",
    textColor: "#fff",
    emoji: "💳",
    getUrl: (upiId: string, amount: number, note: string) =>
      `paytmmp://pay?pa=${upiId}&pn=${MERCHANT_NAME}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
    fallbackUrl: "https://paytm.com/",
  },
  {
    id: "bhim",
    name: "BHIM",
    color: "#00a651",
    textColor: "#fff",
    emoji: "🏦",
    getUrl: (upiId: string, amount: number, note: string) =>
      `upi://pay?pa=${upiId}&pn=${MERCHANT_NAME}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
    fallbackUrl: "https://www.bhimupi.org.in/",
  },
  {
    id: "amazonpay",
    name: "Amazon Pay",
    color: "#ff9900",
    textColor: "#000",
    emoji: "🛒",
    getUrl: (upiId: string, amount: number, note: string) =>
      `upi://pay?pa=${upiId}&pn=${MERCHANT_NAME}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
    fallbackUrl: "https://pay.amazon.in/",
  },
  {
    id: "cred",
    name: "CRED",
    color: "#2d2d2d",
    textColor: "#fff",
    emoji: "🎯",
    getUrl: (upiId: string, amount: number, note: string) =>
      `upi://pay?pa=${upiId}&pn=${MERCHANT_NAME}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
    fallbackUrl: "https://cred.club/",
  },
];

const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  plan,
  amount,
  billingCycle,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"choose" | "confirm">(
    "choose",
  );
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const transactionNote = `StudySync ${plan.name} Plan - ${billingCycle}`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openUpiUrl = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleAppPay = (app: (typeof upiApps)[0]) => {
    setSelectedApp(app.id);
    const upiUrl = app.getUrl(UPI_ID, amount, transactionNote);
    openUpiUrl(upiUrl);
    // Show confirmation step after attempting
    setTimeout(() => {
      setPaymentStep("confirm");
    }, 1500);
  };

  const handleGenericUPI = () => {
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    openUpiUrl(upiUrl);
    setTimeout(() => setPaymentStep("confirm"), 1500);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header" style={{ background: plan.gradient }}>
          <div className="modal-header-content">
            <div className="modal-plan-info">
              <div className="modal-plan-icon">{plan.icon}</div>
              <div>
                <h2 className="modal-title">StudySync {plan.name}</h2>
                <p className="modal-subtitle">
                  ₹{amount}/{billingCycle === "yearly" ? "year" : "month"}
                </p>
              </div>
            </div>
            <button className="modal-close" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {paymentStep === "choose" ? (
            <>
              {/* UPI ID Display */}
              <div className="upi-id-section">
                <div className="upi-id-label">
                  <Shield className="w-4 h-4" />
                  <span>Pay to UPI ID</span>
                </div>
                <div className="upi-id-box">
                  <span className="upi-id-text">{UPI_ID}</span>
                  <button className="upi-copy-btn" onClick={copyUpiId}>
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="payment-amount-display">
                <span className="amount-label">Amount to Pay</span>
                <span className="amount-value">₹{amount}</span>
              </div>

              {/* Pay Via App Section */}
              <div className="pay-via-section">
                <div className="pay-via-header">
                  <Smartphone className="w-5 h-5" />
                  <span>Pay via UPI App</span>
                </div>
                <p className="pay-via-hint">
                  Tap any payment app to open it directly on your device
                </p>

                <div className="upi-apps-grid">
                  {upiApps.map((app) => (
                    <button
                      key={app.id}
                      className="upi-app-btn"
                      style={{ borderColor: app.color + "40" }}
                      onClick={() => handleAppPay(app)}
                    >
                      <span className="app-emoji">{app.emoji}</span>
                      <span className="app-name" style={{ color: app.color }}>
                        {app.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Universal UPI Button */}
                <button className="pay-any-btn" onClick={handleGenericUPI}>
                  <ExternalLink className="w-4 h-4" />
                  Open Any UPI App
                </button>
              </div>

              {/* Manual Pay Instructions */}
              <div className="manual-pay-section">
                <div className="manual-pay-header">
                  <AlertCircle className="w-4 h-4" />
                  <span>Or pay manually</span>
                </div>
                <ol className="manual-steps">
                  <li>Open any UPI app (PhonePe, GPay, etc.)</li>
                  <li>Go to "Send Money" or "Pay"</li>
                  <li>
                    Enter UPI ID: <strong>{UPI_ID}</strong>
                  </li>
                  <li>
                    Enter amount: <strong>₹{amount}</strong>
                  </li>
                  <li>After payment, click "I've Paid" below</li>
                </ol>
                <button
                  className="paid-btn"
                  onClick={() => setPaymentStep("confirm")}
                >
                  <Zap className="w-4 h-4" />
                  I've Paid ₹{amount}
                </button>
              </div>
            </>
          ) : (
            /* Confirmation Step */
            <div className="confirm-section">
              <div className="confirm-icon">✅</div>
              <h3 className="confirm-title">Payment Initiated!</h3>
              <p className="confirm-subtitle">
                {selectedApp
                  ? `Your payment of ₹${amount} has been sent via your payment app.`
                  : `Please complete the payment of ₹${amount} in your UPI app.`}
              </p>

              <div className="confirm-details">
                <div className="confirm-row">
                  <span>Plan</span>
                  <strong>StudySync {plan.name}</strong>
                </div>
                <div className="confirm-row">
                  <span>Amount</span>
                  <strong>₹{amount}</strong>
                </div>
                <div className="confirm-row">
                  <span>UPI ID</span>
                  <strong>{UPI_ID}</strong>
                </div>
                <div className="confirm-row">
                  <span>Reference</span>
                  <strong>{transactionNote}</strong>
                </div>
              </div>

              <div className="confirm-note">
                <AlertCircle className="w-4 h-4" />
                <p>
                  After successful payment, your account will be activated
                  within 24 hours. Please save your transaction ID for
                  reference.
                </p>
              </div>

              <div className="confirm-actions">
                <button
                  className="back-btn"
                  onClick={() => setPaymentStep("choose")}
                >
                  ← Go Back
                </button>
                <button
                  className="done-btn"
                  onClick={onClose}
                  style={{ background: plan.gradient }}
                >
                  Done ✓
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <Shield className="w-4 h-4" />
          <span>100% Secure UPI Payment • Powered by NPCI</span>
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentModal;
// Force TS refresh
