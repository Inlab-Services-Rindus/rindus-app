import { Result } from '@/model/Result';
import UserCard from '@/organisms/user-card/UserCard';

interface SearchResultsProps {
  results: Result[] | null;
}

export default function SearchResults({
  results,
}: SearchResultsProps): JSX.Element {
  return (
    <>
      {results?.map((result: Result) => (
        <UserCard
          key={result.id}
          profilePictureUrl={result.profilePictureUrl}
          fullName={result.fullName}
          position={result.position}
        />
      ))}
    </>
  );
}
