// INR + unit formatters
export const formatINR = (n) => {
  const num = Number(n || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatNumber = (n, d = 2) => {
  const num = Number(n || 0);
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: d }).format(num);
};

export const formatCompactINR = (n) => {
  const num = Number(n || 0);
  if (num >= 1_00_00_000) return "₹" + (num / 1_00_00_000).toFixed(2) + " Cr";
  if (num >= 1_00_000) return "₹" + (num / 1_00_000).toFixed(2) + " L";
  if (num >= 1_000) return "₹" + (num / 1_000).toFixed(1) + "K";
  return "₹" + num.toFixed(0);
};

export const formatDate = (iso) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch (e) {
    return iso;
  }
};
