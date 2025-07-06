// src/assets/Modal.jsx
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '10px' }}>
        <button onClick={onClose} style={{ float: 'right' }}>닫기</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
