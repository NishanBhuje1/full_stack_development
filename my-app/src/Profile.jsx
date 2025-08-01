export default function Profile({ prof, size = 50 }) {
  return <img src={prof.url} width={size} alt={prof.name} />;
}
