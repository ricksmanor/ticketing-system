import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('displays the correct title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Your App Title/i); // Replace with your actual title
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the sidebar menu', () => {
    render(<App />);
    const dashboardMenuItem = screen.getByText(/Dashboard/i);
    const eventsMenuItem = screen.getByText(/Events/i);
    const showsMenuItem = screen.getByText(/Shows/i);
    const screensMenuItem = screen.getByText(/Screens/i);

    expect(dashboardMenuItem).toBeInTheDocument();
    expect(eventsMenuItem).toBeInTheDocument();
    expect(showsMenuItem).toBeInTheDocument();
    expect(screensMenuItem).toBeInTheDocument();
  });

  // Add more tests as needed
});