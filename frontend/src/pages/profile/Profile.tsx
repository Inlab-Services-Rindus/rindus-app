import { Link, useNavigate, useParams } from 'react-router-dom';

import email from '@/assets/email.svg';
import slack from '@/assets/slack.svg';
import Loader from '@/atoms/loader/Loader';
import Tag from '@/atoms/tag/Tag';
import { config } from '@/config/config';
import useFetch from '@/hooks/fetch/useFetch';
import { EmployeeProfile } from '@/model/Employee';
import AvatarTile from '@/organisms/avatar-tile/AvatarTile';
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
      <div className="profile-container">
        <div className="avatar">
          <AvatarTile
            key={profile?.id}
            profilePictureUrl={profile?.profilePictureUrl ?? ''}
            isBirthday={profile?.isBirthday ?? false}
            // isCaptain={profile?.isCaptain}
          />

          <span className="avatar__fullName">
            {profile?.firstName} {profile?.lastName}
          </span>
          <span className="avatar__position">{profile?.position}</span>
        </div>
        <div className="information-container">
          <div className="partner">
            <img src={profile?.department?.logoUrl} className="partner__logo" />
            <div className="partner__info">
              <span className="partner__info__title">Department</span>
              <span className="partner__info__name">
                {profile?.department?.name}
              </span>
            </div>
          </div>
          <div className="account">
            <img src={email} className="account__logo" />
            <span className="account__address">
              <a href={`mailto:${profile?.email}`}>{profile?.email}</a>
            </span>
          </div>
          <div className="account">
            <img src={slack} alt="" className="account__logo" />
            <Link
              className="account__link"
              to={profile?.slack.profileUrl ?? ''}
              target="_blank"
            >
              <span className="account__address">@{profile?.slack.name}</span>
            </Link>
          </div>
        </div>
        <div className="languages">
          <div className="languages__title-container">
            <span className="languages__title">Languages:</span>
          </div>
          <div className="languages__tags-container">
            {profile?.languages.map((language) => (
              <Tag
                key={profile?.id}
                tag={language.charAt(0).toUpperCase() + language.slice(1) ?? ''}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
