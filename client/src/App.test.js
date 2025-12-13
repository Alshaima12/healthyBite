import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const mockStore = configureStore([]);

test('renders HealthyBite header', () => {
  const store = mockStore({
    auth: { user: null },
    cart: { items: [] }
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );

  const linkElement = screen.getByText(/HealthyBite/i);
  expect(linkElement).toBeInTheDocument();
});
