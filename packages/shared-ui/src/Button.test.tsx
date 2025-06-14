import { describe, it, expect } from 'vitest';
import { Button } from './Button';
import React from 'react';
import { render } from '@testing-library/react';

describe('Button', () => {
  it('renders children', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeDefined();
  });
});
