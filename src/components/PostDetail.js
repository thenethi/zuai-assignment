import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetch(
        `https://zuai-assignment.onrender.com/posts/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      const data = await response.json();
      setPost(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching post");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://zuai-assignment.onrender.com/posts/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      navigate("/");
    } catch (error) {
      setError("Error deleting post");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article className="post-detail">
      <h2>{post.title}</h2>
      <p className="post-meta">
        By {post.author} on {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="post-content">{post.content}</div>
      <div className="post-actions">
        <Link to={`/edit/${post.id}`} className="btn btn-edit">
          Edit
        </Link>
        <button onClick={handleDelete} className="btn btn-delete">
          Delete
        </button>
      </div>
    </article>
  );
}

export default PostDetail;
