const configuredCountryCode = (
  import.meta.env.VITE_PHONE_COUNTRY_CODE ?? ""
).replace(/\D/g, "");

const getInternationalNumber = (value: string) => {
  const trimmed = value.trim();
  let digits = trimmed.replace(/\D/g, "");

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (trimmed.startsWith("+")) return digits;
  if (digits.startsWith("0") && configuredCountryCode) {
    return `${configuredCountryCode}${digits.slice(1)}`;
  }
  return digits;
};

export const getWhatsAppUrl = (
  phone?: string | null,
  message?: string | null,
) => {
  if (!phone) return "";
  const number = getInternationalNumber(phone);
  if (!number) return "";
  const text = message?.trim();
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
};
