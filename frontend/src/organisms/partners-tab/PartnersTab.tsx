import Loader from '@/atoms/loader/Loader';
import { Partner } from '@/model/Partner';

interface PartnersTabProps {
  partners?: Partner[];
  isPartnersLoading: boolean;
}

export function PartnersTab({ partners, isPartnersLoading }: PartnersTabProps) {
  if (isPartnersLoading) {
    return (
      <div className="loader__container">
        <Loader />
      </div>
    );
  }

  return (
    <section data-testid="partners-tab">
      <div>
        <ul>
          {partners?.map((partner, index) => (
            <li key={index}>
              <ul>
                <img
                  src={partner.pictureUrl}
                  style={{ height: '50px', width: '50px' }}
                ></img>
                <span>{` ${partner.name}`}</span>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
