import { useState } from 'react';
import profiles from './data';
import ProfileCard from './ProfileCard';
import Modal from './Modal';
import './CSS/App.css';

function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>자기소개 카드</h1>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px', maxWidth: '800px', margin: 'auto'
      }}>
        {profiles.map(profile => (
        <button
          key={profile.id}
          onClick={() => setSelected(profile)}
          className="name-button"
        >
          {profile.name}
        </button>
        ))}
      </div>

      <Modal isOpen={selected !== null} onClose={() => setSelected(null)}>
        {selected && <ProfileCard profile={selected} />}
      </Modal>
    </div>
  );
}

export default App;
