import { Partner } from '@/model/Partner';

interface PartnersTabProps {
  partners: Partner[];
}

export function PartnersTab({ partners }: PartnersTabProps) {
  return (
    <section data-testid="partners-tab">
      <h1>PartnersTab</h1>
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
