import { describe, expect, test, vi } from 'vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ButtonTest from '@components/ButtonTest/ButtonTest';

describe('Button test', () => {
  render(<ButtonTest />);

  test('Button click', async () => {
    const btn = screen.getByRole('button', { name: 'test' });

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await userEvent.click(btn);

    expect(logSpy).toHaveBeenCalledWith('test');

    logSpy.mockRestore();
  });
});
