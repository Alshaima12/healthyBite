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
    state.cart.items.reduce((sum, it) => sum + (it.qty || 0), 0)
  );

  const normalizedPath =
    pathname.endsWith('/') && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const classFor = (to) => (to === normalizedPath ? 'active nav-link' : 'nav-link');

  const getLinks = () => {
    if (!user) {
      return [
        { label: 'About Us', to: '/about' },
        { label: 'Login', to: '/login' },
        { label: 'Sign Up', to: '/signup' },
      ];
    }

    switch (normalizedPath) {
      case '/welcome':
        return [
          { label: 'Menu', to: '/menu' },
          { label: 'Profile', to: '/profile' },
          { label: 'Logout', action: 'logout' },
        ];
      case '/menu':
        return [
          { label: 'Home', to: '/welcome' },
          { label: 'Profile', to: '/profile' },
          { label: 'Logout', action: 'logout' },
        ];
      case '/cart':
        return [
          { label: 'Home', to: '/welcome' },
          { label: 'Menu', to: '/menu' },
          { label: 'Logout', action: 'logout' },
        ];
      case '/meals':
      case '/drinks':
        return [
          { label: 'Home', to: '/welcome' },
          { label: 'Menu', to: '/menu' },
          { label: 'Cart', to: '/cart' },
          { label: 'Profile', to: '/profile' },
          { label: 'Logout', action: 'logout' },
        ];
      case '/order-complete':
        return [
          { label: 'Home', to: '/welcome' },
          { label: 'Profile', to: '/profile' },
          { label: 'Logout', action: 'logout' },
        ];
      case '/order-receipt':
        return [
          { label: 'Home', to: '/welcome' },
          { label: 'Logout', action: 'logout' },
        ];
      case '/profile':
        return [
          { label: 'Home', to: '/welcome' },
          { label: 'Menu', to: '/menu' },
          { label: 'Logout', action: 'logout' },
        ];
      default:
        return [
          { label: 'Home', to: '/welcome' },
          { label: 'Menu', to: '/menu' },
          { label: 'Cart', to: '/cart' },
          { label: 'Profile', to: '/profile' },
          { label: 'Logout', action: 'logout' },
        ];
    }
  };

  const links = getLinks();

  return (
    <Navbar className="navbar" expand="md">
      <div className="nav-left">
        <div className="logo-icon">🌿</div>
        <span className="logo-main">HealthyBite</span>
      </div>

      <Nav className="nav-right" navbar>
        {links.map((link) => (
          <NavItem key={link.label}>
            {link.action === 'logout' ? (
              <Button
                color="link"
                className="nav-link nav-btn"
                onClick={handleLogout}
              >
                {link.label}
              </Button>
            ) : (
              <Link to={link.to} className={classFor(link.to)}>
                {link.label === 'Cart' && cartCount > 0 ? (
                  <>
                    Cart <Badge color="light">{cartCount}</Badge>
                  </>
                ) : (
                  link.label
                )}
              </Link>
            )}
          </NavItem>
        ))}
      </Nav>
    </Navbar>
  );
}

export default NavbarComponent;
