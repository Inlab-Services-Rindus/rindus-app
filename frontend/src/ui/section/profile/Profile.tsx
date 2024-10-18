import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import email from '@/assets/icons/Contact_gmail_40.svg';
import slack from '@/assets/icons/Contact_slack_40.svg';
import Tag from '@/ui/components/atoms/tag/Tag';
import Section from '@/ui/components/molecules/section/Section';
import AvatarTile from '@/ui/components/organisms/avatar-tile/AvatarTile';

import { getUser } from '@/modules/users/application/get/getUser';
import { UserExtended } from '@/modules/users/domain/User';
import { createUserRepository } from '@/modules/users/infrastructure/UserRepository';

import '@/ui/section/profile/Profile.scss';

export function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<UserExtended>();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const userRepository = createUserRepository();

  const load = async (userId?: string) => {
    if (userId) {
      setHasError(false);
      try {
        const user = await getUser(userRepository, userId);
        setUser(user);
      } catch (error) {
        setHasError(true);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(id);
  }, [id]);

  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);

  return (
    <Section
      dataTestId="profile"
      refresh={() => load(id)}
      isLoading={isLoading}
      shouldRefresh={hasError}
    >
      <div className="profile-container">
        <div className="avatar">
          <div onClick={openLightbox}>
            <AvatarTile
              key={user?.id}
              profilePictureUrl={user?.profilePictureUrl ?? ''}
              isBirthday={user?.isBirthday ?? false}
              isCaptain={user?.isCaptain}
            />
          </div>

          <span className="avatar__fullName">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="avatar__position">{user?.position}</span>
        </div>

        <div className="information-container">
          <div className="partner">
            <Link
              className="partner__link"
              to={user?.department?.id ? `/partner/${user.department.id}` : ''}
            >
              <img src={user?.department?.logoUrl} className="partner__logo" />
            </Link>
            <div className="partner__info">
              <span className="partner__info__title">Department</span>
              <span className="partner__info__name">
                {user?.department?.name}
              </span>
            </div>
          </div>
          <div className="account">
            <img src={email} className="account__logo" />
            <span className="account__address">
              <a href={`mailto:${user?.email}`}>{user?.email}</a>
            </span>
          </div>
          {user?.slack && (
            <div className="account">
              <img src={slack} alt="" className="account__logo" />
              <Link
                className="account__link"
                to={user?.slack.profileUrl ?? ''}
                target="_blank"
              >
                <span className="account__address">@{user?.slack.name}</span>
              </Link>
            </div>
          )}
        </div>
        <div className="languages">
          <div className="languages__title-container">
            <span className="languages__title">Languages:</span>
          </div>
          <div className="languages__tags-container">
            {user?.languages.map((language) => (
              <Tag
                key={language}
                tag={language.charAt(0).toUpperCase() + language.slice(1) ?? ''}
              />
            ))}
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <div
            className="lightbox__content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={user?.profilePictureUrl}
              alt={`${user?.firstName} ${user?.lastName}`}
              className="lightbox__image"
            />
            <button className="lightbox__close" onClick={closeLightbox}>
              &times;
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
