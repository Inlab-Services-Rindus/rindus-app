import { useNavigate } from 'react-router-dom';

import '@/atoms/loader/Loader.scss';

export default function Loader() {
  return <span className="loader" data-testid="loader"></span>;
}
