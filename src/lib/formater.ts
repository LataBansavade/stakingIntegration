
/**
 * Converts a Unix timestamp (in seconds) to "dd-mm-yyyy" format.
 * @param timestamp - The Unix timestamp in seconds.
 * @returns A formatted date string.
 */

import { formatUnits, parseUnits } from "viem";

export const numFormater = (num: number) => {
   const toLocale = (fraction: number) => {
      return num.toLocaleString(undefined, {
         minimumFractionDigits: fraction,
         maximumFractionDigits: fraction,
      });
   };

   return { toLocale };
};

export const toWei = (num: number | string, decimals = 18) => {
   return parseUnits(num.toString(), decimals);
};

export const fromWei = (num: bigint, decimals = 18) => {
   return formatUnits(num, decimals);
};

export const amountFormatter = (value: number | undefined, to = 2) => {
   if (!value) return "0";
   const numFormat = Intl.NumberFormat("en-US", { maximumFractionDigits: to });
   return numFormat.format(value);
};


export function formatNumber(number: string): string {
    const num = Number(number);
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return num.toString();
  }
}

export function formatUnixTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function addDaysToUnixTimestamp(timestamp:any, days:any) {
  const milliseconds = timestamp * 1000;
  const newMilliseconds = milliseconds + (days * 24 * 60 * 60 * 1000);
  return Math.floor(newMilliseconds / 1000);
}