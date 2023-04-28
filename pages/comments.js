import { useState, useEffect } from 'react';


function CommentsPage() {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch('/api/comments')
      .then(response => response.json())
      .then(data => setComments(data));
  }, []);

  const handleSubmit = event => {
    event.preventDefault();
    fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, content })
    })
      .then(response => response.json())
      .then(data => setComments([data, ...comments]));
    setUsername('');
    setContent('');
  };

  return (
    <div className="comment-container">
      <form className="comment-form" onSubmit={handleSubmit}>
        <label htmlFor="content">Comment:</label>
        <textarea id="content" value={content} onChange={event => setContent(event.target.value)} required />
        <button type="submit">Submit Comment</button>
      </form>
      <div className='comment'>
        {comments.map(comment => (
          <div key={comment.id}>
            <p><strong>{comment.username}:</strong> {comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentsPage;