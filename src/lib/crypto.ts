import axios from "axios";
import { TransactionResponse } from "ethers";


export async function getValueInUSD(totalToken: number) {
  const voxToken = "0x28d68df514cb0726dd6fadf92a10146b081d1696";
  try {
    const api = `https://api.dexscreener.com/latest/dex/tokens/${voxToken}`;
    const response = await axios.get(api);
    console.log("API response:", response.data);
    
    const tokenPriceInUSD = response.data?.pairs?.find(
      (pair: any) => pair.chainId === "ethereum"
    )?.priceUsd;

    console.log("Token price in USD:", tokenPriceInUSD);
    console.log("Total token amount:", totalToken);

    if (!tokenPriceInUSD) {
      console.warn("Token price not found in response!");
      return 0;
    }

    const totalTokenPriceInUSD = Number(tokenPriceInUSD) * Number(totalToken);
    console.log("Total token price in USD:", totalTokenPriceInUSD);

    return totalTokenPriceInUSD;
  } catch (error) {
    console.log("error fetching token price:", error);
  }
}


export async function getTokenPriceInUSD() {
    const voxToken = "0x28d68df514cb0726dd6fadf92a10146b081d1696";
  try {
    const api = `https://api.dexscreener.com/latest/dex/tokens/${voxToken}`;
    const response = await axios.get(api);
    console.log("API response:", response.data);
    
    const tokenPriceInUSD = response.data?.pairs?.find(
      (pair: any) => pair.chainId === "ethereum"
    )?.priceUsd;

    return tokenPriceInUSD;
  } catch (error) {
    console.log("error fetching token price:", error);
  }
}
 
 
 export async function wethPriceInUSD() {
    try {
       const api = `https://api.coinbase.com/v2/prices/ETH-USD/spot`;
       const response = await axios.get(api);
       const value = +response.data?.data?.amount;
       return value;
    } catch (error) {
       console.log("error fetching weth price", error);
    }
 }


 export async function sendAndConfirmTransaction(transaction: () => any) {
   const tx: TransactionResponse = await transaction();
   const receipt = await tx.wait();
   if (!receipt || receipt.status === 0) {
      throw new Error("Transaction failed");
   }
   return tx.hash;
}
