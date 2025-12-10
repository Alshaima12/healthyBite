import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, NavItem, Badge, Button } from 'reactstrap';
import { logout } from '../slices/authSlice';

function NavbarComponent() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, it) => sum + it.qty, 0)
  );

  const classFor = (path) =>
    pathname === path ? 'nav-link nav-link-active' : 'nav-link';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Navbar className="navbar" expand="md">
      <div className="nav-left">
        <div className="logo-icon">🌿</div>
        <span className="logo-main">HealthyBite</span>
      </div>

      {!user ? (
        <Nav className="nav-right" navbar>
          <NavItem>
            <Link to="/about" className={classFor('/about')}>
              About Us
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/login" className={classFor('/login')}>
              Login
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/signup" className={classFor('/signup')}>
              Sing Up
            </Link>
          </NavItem>
        </Nav>
      ) : (
        <Nav className="nav-right" navbar>
          <NavItem>
            <Link to="/welcome" className={classFor('/welcome')}>
              Home
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/menu" className={classFor('/menu')}>
              Menu
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/cart" className={classFor('/cart')}>
              Cart {cartCount > 0 && <Badge color="light">{cartCount}</Badge>}
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/profile" className={classFor('/profile')}>
              Profile
            </Link>
          </NavItem>
          <NavItem>
            <Button
              color="link"
              className="nav-link nav-btn"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </NavItem>
        </Nav>
      )}
    </Navbar>
  );
}

export default NavbarComponent;
