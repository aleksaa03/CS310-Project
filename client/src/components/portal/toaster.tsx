import { createPortal } from "react-dom";
import { ToastContainer } from "react-toastify";
import { Bounce } from "react-toastify";

const Toaster = () => {
  return createPortal(
    <ToastContainer
      position="bottom-right"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      theme="colored"
      transition={Bounce}
    />,
    document.getElementById("toast-container")!
  );
};

export default Toaster;
