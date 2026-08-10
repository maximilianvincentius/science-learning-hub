const _getDate = (wibDate) => {
  const year = wibDate.getUTCFullYear();
  const month = String(wibDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(wibDate.getUTCDate()).padStart(2, '0');

  return { year, month, day };
};

/**
 * Format date to WIB timezone (UTC+7)
 * @param {string|Date} date - Date string or Date object
 * @returns {string} Formatted date string "YYYY-MM-DD, HH:mm WIB"
 */
export const formatDateAndTime = (date) => {
  if (!date) {
    return '';
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return '';
  }

  // Convert to WIB (UTC+7)
  const wibDate = new Date(d.getTime() + 7 * 60 * 60 * 1000);
  const { year, month, day } = _getDate(wibDate);

  const hours = String(wibDate.getUTCHours()).padStart(2, '0');
  const minutes = String(wibDate.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes} WIB`;
};

export const formatDate = (date) => {
  if (!date) {
    return '';
  }

  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return '';
  }

  const { year, month, day } = _getDate(d);

  return `${year}-${month}-${day}`;
};
