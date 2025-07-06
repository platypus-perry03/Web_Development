import './CSS/ProfileCard.css';

function ProfileCard({ profile }) {
  if (!profile) return null;

  const { name, major, tech } = profile;

  return (
    <div className="profile-card">
      <h2>{name}</h2>
      <p><strong>전공:</strong> {major}</p>
      <p><strong>관심 기술:</strong> {tech}</p>
    </div>
  );
}


export default ProfileCard;
