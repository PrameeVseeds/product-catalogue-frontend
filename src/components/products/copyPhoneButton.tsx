import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export const CopyPhoneButton = ({ phone }: { phone: string }) => {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(""), 2200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setFeedback("Phone number copied");
    } catch {
      setFeedback("Copy unavailable. Select the number above.");
    }
  };

  return (
    <div className="copyPhoneControl">
      <button className="copyPhoneButton" type="button" onClick={() => void copy()}>
        {feedback === "Phone number copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        Copy Number
      </button>
      <span className="copyPhoneFeedback" role="status" aria-live="polite">
        {feedback}
      </span>
    </div>
  );
};
