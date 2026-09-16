export default function Header({ titulo }) {
  return (
    <header className="bg-primary text-white text-center py-3">
      <h1 className="h4 m-0">{titulo}</h1>
    </header>
  );
}
