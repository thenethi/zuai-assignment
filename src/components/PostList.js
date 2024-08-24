import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "https://zuai-assignment.onrender.com/posts"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching posts");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="post-list">
      <h2>Recent Posts</h2>
      {posts.map((post) => (
        <article key={post.id} className="post-card">
          <h3>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
          </h3>
          <p>By {post.author}</p>
          <p>{post.content.substring(0, 100)}...</p>
          <Link to={`/post/${post.id}`} className="read-more">
            Read More
          </Link>
        </article>
      ))}
    </div>
  );
}

export default PostList;
