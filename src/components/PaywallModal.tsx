"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, CreditCard, Check, ShieldCheck } from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  totalFindings: number;
  freeFindings: number;
}

export default function PaywallModal({
  isOpen,
  onClose,
  onUnlock,
  totalFindings,
  freeFindings,
}: PaywallModalProps) {
  const t = useTranslations("results.paywall");
  const tu = useTranslations("results.unlock");
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  const handlePay = () => {
    setStep("processing");
    // Simulate payment processing
    setTimeout(() => {
      setStep("success");
    }, 2000);
  };

  const handleViewReport = () => {
    onUnlock();
    onClose();
    setStep("form");
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => setStep("form"), 300);
  };

  const formatCardNumber = (val: string) => {
    const nums = val.replace(/\D/g, "").slice(0, 16);
    return nums.replace(/(\d{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const nums = val.replace(/\D/g, "").slice(0, 4);
    if (nums.length >= 3) {
      return nums.slice(0, 2) + "/" + nums.slice(2);
    }
    return nums;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal__close"
            onClick={handleClose}
            aria-label="Close"
            id="paywall-close"
          >
            <X size={20} />
          </button>

          {step === "form" && (
            <>
              <div className="text-center mb-xl">
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "var(--radius-lg)",
                    background:
                      "linear-gradient(135deg, var(--color-accent), var(--color-primary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto var(--space-md)",
                  }}
                >
                  <Lock size={24} color="white" />
                </div>
                <h3 className="heading-2">{t("title")}</h3>
                <p className="text-small mt-sm">{t("subtitle")}</p>
              </div>

              <div className="flex-col gap-md mb-xl">
                <div className="form-group">
                  <label className="form-label" htmlFor="card-number">
                    {t("cardNumber")}
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="card-number"
                      className="form-input"
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      style={{ paddingLeft: 44 }}
                    />
                    <CreditCard
                      size={18}
                      style={{
                        position: "absolute",
                        left: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)",
                      }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="card-expiry">
                      {t("expiry")}
                    </label>
                    <input
                      id="card-expiry"
                      className="form-input"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="card-cvc">
                      {t("cvc")}
                    </label>
                    <input
                      id="card-cvc"
                      className="form-input"
                      placeholder="123"
                      maxLength={3}
                      value={cvc}
                      onChange={(e) =>
                        setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="card-name">
                    {t("name")}
                  </label>
                  <input
                    id="card-name"
                    className="form-input"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="btn btn--accent btn--full btn--lg"
                onClick={handlePay}
                id="pay-button"
              >
                {t("pay")}
              </button>

              <p
                className="text-small text-center mt-md"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <ShieldCheck size={14} color="var(--color-success)" />
                {t("secure")}
              </p>
            </>
          )}

          {step === "processing" && (
            <div className="text-center" style={{ padding: "var(--space-2xl) 0" }}>
              <div className="loading-orb" style={{ margin: "0 auto var(--space-xl)", width: 60, height: 60 }} />
              <p className="heading-3">{t("processing")}</p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center" style={{ padding: "var(--space-xl) 0" }}>
              <div className="success-check">
                <Check size={36} color="white" />
              </div>
              <h3 className="heading-2 mb-sm">{t("success")}</h3>
              <p className="text-body mb-xl">{t("successDesc")}</p>
              <button
                className="btn btn--primary btn--full btn--lg"
                onClick={handleViewReport}
                id="view-full-report"
              >
                {t("viewReport")}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
