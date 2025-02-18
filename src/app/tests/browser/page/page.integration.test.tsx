import { describe, expect, test, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Page from '@/app/page';

describe('Test Index Page', () => {
  render(<Page />);

  const btn = screen.getByRole('button', { name: 'test' });

  test('Have elements', () => {
    const h1 = screen.getByRole('heading', {
      level: 1,
      name: 'Next-Admin app',
    });

    expect(h1).toBeDefined();
    expect(btn).toBeDefined();
  });

  test('Button click', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await userEvent.click(btn);

    expect(logSpy).toHaveBeenCalledWith('test');

    logSpy.mockRestore();
  });
});
