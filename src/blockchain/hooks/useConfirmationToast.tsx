import { toast } from "sonner";


const useConfirmationToast = (type: string) => {
    let message = "";
    let color = "";
    if (type === "emergency") {
       color = "#DC4C64";
       message = "Are you sure you want to take out your tokens? You won't get any rewards.";
    } else if (type === "stake") {
       color = "#54B4D3";
       message = "It appears you have rewards available for claim. If you proceed, these rewards will be credited to your wallet.";
    } else {
       throw new Error("Invalid type");
    }
    return (fn: any) =>{
        const toastId = toast(
          <div className="toast">
             <span>{message}</span>
             <div className="toast-btn-group">
                <button
                   className="toast-btn"
                   style={{ background: color }}
                   onClick={() => {
                      fn();
                      toast.dismiss(toastId);
                   }}
                >
                   Confirm
                </button>
                <button className="toast-btn close" onClick={() => toast.dismiss(toastId)}>
                   Dismiss
                </button>
             </div>
          </div>
       )
       return toastId;
    };
 };
 
 export default useConfirmationToast;
 