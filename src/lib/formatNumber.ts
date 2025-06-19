export const formatNumber = (num: number | string): string => {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(number)) return '0.00';
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatNumberWithDecimals = (num: number | string, decimals: number = 4): string => {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(number)) return '0.00';
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  });
};
