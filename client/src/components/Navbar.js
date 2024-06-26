import { NavLink } from "react-router-dom";
import "../Navbar.css"

function NavBar({ onLogout, user }) {
  function handleLogout() {
    fetch("/logout", {
      method: "DELETE",
    }).then(() => onLogout());
  }
  return (
    <>
    <header>
      {user && <button onClick={handleLogout}>Logout</button>}
    </header>
    <nav>
      <NavLink
        to="/"
        className="navbar-link"
        activeClassName="active"
        exact
        onClick={() => console.log("Home link clicked")}
      >
        Home
      </NavLink>
      <NavLink
        to="/users"
        className="navbar-link"
        activeClassName="active"
        onClick={() => console.log("User List link clicked")}
      >
        User List
      </NavLink>
    </nav>
    </>
  );
};

export default NavBar;