// Date Formatter
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

// Number Formatter
export const formatNumber = (num) => {
  if (!num) return "0";
  return num.toLocaleString();
};

export const formatPercent = (num) => {
  if (!num) return "0%";
  return `${(num * 100).toFixed(1)}%`;
};

// Text Formatter
export const truncate = (text, length = 50) => {
  if (!text) return "";
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// File Formatter
export const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Score Formatter
export const formatScore = (score) => {
  if (!score) return "0%";
  return `${Math.round(score * 100)}%`;
};
