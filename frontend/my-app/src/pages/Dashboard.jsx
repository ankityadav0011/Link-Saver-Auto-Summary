import { useEffect, useState } from 'react';
import API from '../services/api';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import BookmarkCard from '../components/BookmarkCard';


function SortableCard({ bookmark, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: bookmark._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BookmarkCard bookmark={bookmark} onDelete={onDelete} />
    </div>
  );
}

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [filterTag, setFilterTag] = useState('');

  const fetchBookmarks = async (tag = '') => {
    try {
      const res = await API.get(`/bookmarks${tag ? '?tag=' + tag : ''}`);
      console.log('API response:', res.data);
      if (Array.isArray(res.data)) {
        setBookmarks(res.data);
      } else {
        console.error('API response is not an array:', res.data);
        setBookmarks([]);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setBookmarks([]);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const token = localStorage.getItem('token'); // Extracting token from localStorage

    try {
      const response = await axios.post(
        'http://localhost:5000/api/bookmarks', 
        { url, tags: tagList }, 
        {
          headers: {
            'Content-Type': 'application/json',
            token: token, 
          },
        }
      );

      console.log('Bookmark saved:', response.data); 
      setUrl(''); // Clear the URL input
      setTags(''); // Clear the tags input
      fetchBookmarks(); // Refresh the bookmarks
    } catch (error) {
      console.error('Error in handleSubmit:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'An error occurred while saving the bookmark');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await API.delete(`/bookmarks/${id}`);
      fetchBookmarks(); 
      setTimeout(() => {
        alert("Bookmark deleted successfully");
      }, 1000);
    } catch (error) {
      console.error('Error deleting bookmark:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'An error occurred while deleting the bookmark');
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = bookmarks.findIndex(i => i._id === active.id);
      const newIndex = bookmarks.findIndex(i => i._id === over.id);
      setBookmarks((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const allTags = Array.from(new Set((Array.isArray(bookmarks) ? bookmarks : []).flatMap(b => b.tags || [])));

  console.log('Bookmarks state:', bookmarks);
  console.log('Bookmarks:', bookmarks);


  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.href = '/';
    alert("You logged out successfully") // go to login page
  };

  return (
    <div>
            <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: '9px',
          right: '120px',
          backgroundColor: '#ff4d4f',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Logout
      </button>
      <h2>Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Paste URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <button type="submit">Save</button>
      </form>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => fetchBookmarks('')}>All</button>
        {allTags.map(tag => (
          <button key={tag} onClick={() => fetchBookmarks(tag)}>{tag}</button>
        ))}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={bookmarks.map((b) => b._id)} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem', border: '1px solid red' }}>
            {Array.isArray(bookmarks) && bookmarks.length > 0 ? (
              bookmarks.map((b) => (
                <SortableCard key={b._id} bookmark={b} onDelete={handleDelete} />
              ))
            ) : (
              <p>No bookmarks available.</p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
