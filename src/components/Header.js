import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="app-header">
      <div className="container">
        <h1>
          <Link to="/">ZuAI Blog</Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/new">New Post</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
