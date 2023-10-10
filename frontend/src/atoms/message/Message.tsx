interface MessageProps {
  message: string;
}

export default function Message({ message }: MessageProps) {
  return <p>{message}</p>;
}
