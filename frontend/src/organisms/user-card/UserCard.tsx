import '@/organisms/user-card/UserCard.scss';

interface UserCardProps {
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  onClick: () => void;
}

export default function UserCard({
  firstName,
  lastName,
  profilePictureUrl,
  onClick,
}: UserCardProps): JSX.Element {
  return (
    <div onClick={onClick} className="user-card">
      <div>
        <img
          className="user-card__img"
          src={profilePictureUrl}
          alt={`${firstName}'s profile`}
        />
      </div>
      <div className="user-card__overlay"></div>
      <div className="user-card__name">
        <span>{firstName}</span>
        <span>{lastName}</span>
      </div>
    </div>
  );
}
