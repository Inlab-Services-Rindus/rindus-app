import '@/atoms/tag/Tag.scss';

interface Props {
  tag: string;
}

export default function Tag({ tag }: Props): JSX.Element {
  return <span className="tag">{tag}</span>;
}
