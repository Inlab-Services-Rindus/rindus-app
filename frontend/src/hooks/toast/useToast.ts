import { toast } from 'react-toastify';

export default function useToast() {
  return {
    showToastError: (message: string) => {
      toast.error(message);
    },
    showToastInfo: (message: string) => {
      toast.info(message);
    },
    showToastSuccess: (message: string) => {
      toast.success(message);
    },
    showToastWarning: (message: string) => {
      toast.warning(message);
    },
  };
}
