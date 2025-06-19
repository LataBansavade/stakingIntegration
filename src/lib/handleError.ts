import { toast } from "sonner";

export const handleError = (error: any) => {
    const errMsg = error?.shortMessage;
    console.error("Error Message", errMsg);
 
    if (error instanceof Error) {
       let errorMessage = "";
       if (error.name === "ContractFunctionExecutionError") {
          errorMessage = error.message.split("\n")[1];
          return toast.error(errorMessage);
       }
    } else if (typeof error === "string") {
       console.error("Error - Message", error);
    }
    toast.error("An error occurred. Please try again later.");
 };
 
 export const findError = (error: any, fallbackErr: string) => {
    try {
       const messageStr = error.reason ? error.reason : error.error.data.message;
       const messageArr = messageStr.split(":");
       if (messageArr[messageArr.length - 1]) {
          return messageArr[messageArr.length - 1];
       }
    } catch {
       const messageStr = error?.message;
       const messageArr = ["User rejected request", "User denied transaction signature", "user rejected transaction"];
       if (messageArr.some((predicate) => messageStr.includes(predicate))) {
          return "Transaction rejected by user";
       }
    }
    return fallbackErr ? fallbackErr : "Something went wrong, please try again!";
 };
 