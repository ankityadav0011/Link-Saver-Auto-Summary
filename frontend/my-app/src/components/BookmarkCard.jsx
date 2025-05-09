import { useState } from 'react';

export default function BookmarkCard({ bookmark, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    await onDelete(bookmark._id);
    setDeleting(false);
  };

  return (
    <div style={{
      width: '320px',
      background: '#fdfdfd',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      transition: 'transform 0.2s ease',
      cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <img src={bookmark.favicon} alt="icon" width="24" height="24" style={{ borderRadius: '4px' }} />
        <strong style={{ fontSize: '1.1rem', color: '#333' }}>{bookmark.title}</strong>
      </div>

      <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '8px' }}>
        {bookmark.summary?.substring(0, 180)}...
      </p>

      <a href={bookmark.url} target="_blank" rel="noreferrer" style={{
        display: 'inline-block',
        color: '#0077cc',
        textDecoration: 'none',
        fontWeight: 'bold',
        marginBottom: '10px'
      }}>
        Visit Website ↗
      </a>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0' }}>
        {bookmark.tags?.map(tag => (
          <span key={tag} style={{
            background: '#e1ecf4',
            color: '#0366d6',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>{tag}</span>
        ))}
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        style={{
          backgroundColor: deleting ? '#ccc' : '#ff4d4f',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: deleting ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.2s ease'
        }}
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
