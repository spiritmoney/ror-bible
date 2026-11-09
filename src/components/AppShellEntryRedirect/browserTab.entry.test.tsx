import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppShellEntryRedirect from './index';

describe('AppShellEntryRedirect in a browser tab', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === '(display-mode: browser)',
      media: query,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    document.documentElement.classList.remove('is-electron');
    delete (window as Window & { electronAPI?: { isElectron?: boolean } })
      .electronAPI;
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('does not redirect / to the reader', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AppShellEntryRedirect />
                <div>Website home</div>
              </>
            }
          />
          <Route path="/bible-online" element={<div>Bible reader</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Website home')).toBeInTheDocument();
    expect(screen.queryByText('Bible reader')).not.toBeInTheDocument();
  });
});
