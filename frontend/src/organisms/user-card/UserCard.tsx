import '@/organisms/user-card/UserCard.scss';

interface UserCardProps {
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
}

export default function UserCard({
  firstName,
  lastName,
  profilePictureUrl,
}: UserCardProps): JSX.Element {
  return (
    <div className="user-card">
      <div className="user-card__img">
        <img
          className="user-card__img"
          src={profilePictureUrl}
          alt={`${firstName}'s profile`}
        />
      </div>
      <div>
        <span className="user-card__name">
          {firstName} {lastName}
        </span>
      </div>
    </div>
  );
}
