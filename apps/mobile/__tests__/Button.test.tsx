import {NormalButton} from '@workout-watcher/ui';
import {render, screen} from '@testing-library/react-native';
import React from 'react';

test('renders NormalButton', () => {
  render(<NormalButton />);

  const button = screen.getByTestId('button');

  expect(button).toBeOnTheScreen();
});
