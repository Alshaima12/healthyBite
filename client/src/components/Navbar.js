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
    state.cart.items.reduce((sum, it) => sum + (it.quantity || 0), 0)
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const normalizedPath = pathname.replace(/\/$/, ''); // remove trailing slash

  // Define links per page
  const pageLinks = {
    '/welcome': ['Menu', 'Profile', 'Logout'],
    '/menu': ['Home', 'Profile', 'Logout'],
    '/meals': ['Home', 'Menu', 'Cart', 'Profile', 'Logout'],
    '/drinks': ['Home', 'Menu', 'Cart', 'Profile', 'Logout'],
    '/cart': ['Home', 'Menu', 'Logout'],
    '/order-complete': ['Home', 'Profile', 'Logout'],
    '/order-receipt': ['Home', 'Logout'],
    '/profile': ['Home', 'Menu', 'Logout'],
  };

  const links = pageLinks[normalizedPath] || ['Home', 'Menu', 'Cart', 'Profile', 'Logout'];

  const renderLink = (label) => {
    switch (label) {
      case 'Home':
        return <Link to="/welcome">{label}</Link>;
      case 'Menu':
        return <Link to="/menu">{label}</Link>;
      case 'Cart':
        return (
          <Link to="/cart">
            {label} {cartCount > 0 && <Badge color="light">{cartCount}</Badge>}
          </Link>
        );
      case 'Profile':
        return <Link to="/profile">{label}</Link>;
      case 'Logout':
        return (
          <Button color="link" className="nav-link nav-btn" onClick={handleLogout}>
            {label}
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Navbar className="navbar" expand="md">
      <div className="nav-left">
        <div className="logo-icon">🌿</div>
        <span className="logo-main">HealthyBite</span>
      </div>

      <Nav className="nav-right" navbar>
        {links.map((label) => (
          <NavItem key={label}>{renderLink(label)}</NavItem>
        ))}
      </Nav>
    </Navbar>
  );
}

export default NavbarComponent;
