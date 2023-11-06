import { Link, useParams } from 'react-router-dom';
import email from '@/assets/email.svg';
import slack from '@/assets/slack.svg';
import Loader from '@/atoms/loader/Loader';
import { config } from '@/config/config';
import useFetch from '@/hooks/fetch/useFetch';
import { EmployeeProfile } from '@/model/Employee';
import '@/pages/profile/Profile.scss';

export function Profile() {
  const { id } = useParams();

  const { data: profile, isLoading: isLoading } = useFetch<EmployeeProfile>({
    options: {
      credentials: 'include',
    },
    url: `${config.backendUrl}/users/${id}/`,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="profile">
        <div className="profile__avatar">
          <img
            className="profile__avatar__img"
            src={profile?.profilePictureUrl}
            alt=""
          />
          <span className="profile__avatar__fullName">
            {profile?.firstName} {profile?.lastName}
          </span>
          <span className="profile__avatar__position">{profile?.position}</span>
        </div>
        <div className="profile__information-container">
          <div className="profile__information">
            <div className="profile__information__partner">
              <img
                src={profile?.department?.logoUrl}
                className="profile__information__partner__logo"
              />
              <div className="profile__information__partner__info">
                <span className="profile__information__partner__info__title">
                  Department
                </span>
                <span className="profile__information__partner__info__name">
                  {profile?.department?.name}
                </span>
              </div>
            </div>
            <div className="profile__information__account">
              <img
                src={email}
                className="profile__information__account__logo"
              />
              <span className="profile__information__account__adress">
                {profile?.email}
              </span>
            </div>
            <div className="profile__information__account">
              <img
                src={slack}
                alt=""
                className="profile__information__account__logo"
              />
              <Link to={profile?.slack.profileUrl ?? ''}>
                <span className="profile__information__account__adress">
                  {profile?.slack.name}
                </span>
              </Link>
              <span className="profile__information__account__adress">
                {profile?.slack.name}
              </span>
            </div>
          </div>
        </div>
        <div className="profile__languages">
          <div className="profile__section-title-container">
            <span className="profile__section-title">Languages:</span>
          </div>
          <div className="profile__tags-container">
            {profile?.languages.map((language, index) => (
              <div key={index} className="profile__tags">
                {language}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
