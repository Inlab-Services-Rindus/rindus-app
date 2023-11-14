import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Toast() {
  return (
    <ToastContainer
      autoClose={2500}
      containerId="toast-container"
      draggable={false}
      pauseOnFocusLoss={false}
      position="bottom-right"
      transition={Slide}
    />
  );
}
