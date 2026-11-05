import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';
import Modal from './index';

const renderModal = (ui: React.ReactElement) =>
  render(<RecoilRoot>{ui}</RecoilRoot>);

describe('Modal headerless dismiss', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a 44px close control when hasHeader is false', () => {
    renderModal(
      <Modal id="test" hasHeader={false} isShown={false} content={<div>Body</div>} />
    );
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toHaveClass('modal-headerless-close');
    expect(close).toHaveAttribute('data-bs-dismiss', 'modal');
  });

  it('calls setIsShown(false) when headerless close is clicked', async () => {
    const setIsShown = jest.fn();
    renderModal(
      <Modal
        id="test"
        hasHeader={false}
        isShown={false}
        setIsShown={setIsShown}
        content={<div>Body</div>}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(setIsShown).toHaveBeenCalledWith(false);
  });

  it('does not render headerless close when hasHeader is true', () => {
    renderModal(
      <Modal id="test" hasHeader isShown={false} content={<div>Body</div>} />
    );
    expect(screen.queryByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(document.querySelector('.modal-headerless-close')).toBeNull();
  });
});
