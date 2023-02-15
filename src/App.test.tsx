import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const title = screen.getByText(/TV Database/i);
  expect(title).toBeInTheDocument();
});
