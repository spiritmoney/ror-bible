import { closeAppShellMarketingOverlay } from './appShellOverlayClose';

describe('closeAppShellMarketingOverlay', () => {
  it('uses history back when opened over the reader', () => {
    const navigate = jest.fn();
    closeAppShellMarketingOverlay(true, navigate);
    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it('replaces with /bible-online on cold load', () => {
    const navigate = jest.fn();
    closeAppShellMarketingOverlay(false, navigate);
    expect(navigate).toHaveBeenCalledWith('/bible-online', { replace: true });
  });
});
