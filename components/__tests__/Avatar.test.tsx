import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { Avatar } from '../Avatar';

describe('<Avatar />', () => {
  describe('Rendering', () => {
    it('should render without error', () => {
      render(<Avatar />);
      expect(screen.getByTestId('avatar-container')).toBeTruthy();
      expect(screen.getByTestId('avatar-image')).toBeTruthy();
    });

    it('should display avatar image correctly', () => {
      render(<Avatar />);
      const avatarImage = screen.getByTestId('avatar-image');

      expect(avatarImage).toBeTruthy();
      expect(avatarImage.props.source.uri).toBe(
        'https://github.com/hmartiins.png'
      );
    });
  });

  describe('Edit badge behavior', () => {
    it('should not display edit badge when hasEdit is false', () => {
      render(<Avatar hasEdit={false} />);

      expect(screen.getByTestId('avatar-container')).toBeTruthy();
      expect(screen.queryByTestId('avatar-edit-badge')).toBeNull();
      expect(screen.queryByTestId('avatar-edit-icon')).toBeNull();
    });

    it('should display edit badge when hasEdit is true', () => {
      render(<Avatar hasEdit={true} />);

      expect(screen.getByTestId('avatar-container')).toBeTruthy();
      expect(screen.getByTestId('avatar-edit-badge')).toBeTruthy();
      expect(screen.getByTestId('avatar-edit-icon')).toBeTruthy();
    });

    it('should not display edit badge by default', () => {
      render(<Avatar />);

      expect(screen.queryByTestId('avatar-edit-badge')).toBeNull();
      expect(screen.queryByTestId('avatar-edit-icon')).toBeNull();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when hasEdit is true and avatar is pressed', () => {
      const mockOnPress = jest.fn();
      render(<Avatar hasEdit={true} onPress={mockOnPress} />);

      const avatarContainer = screen.getByTestId('avatar-container');
      fireEvent.press(avatarContainer);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should allow multiple presses when hasEdit is true', () => {
      const mockOnPress = jest.fn();
      render(<Avatar hasEdit={true} onPress={mockOnPress} />);

      const avatarContainer = screen.getByTestId('avatar-container');
      fireEvent.press(avatarContainer);
      fireEvent.press(avatarContainer);
      fireEvent.press(avatarContainer);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });
});

describe('<Avatar /> Snapshots', () => {
  it('should match snapshot with default props', () => {
    const component = render(<Avatar />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with hasEdit false', () => {
    const component = render(<Avatar hasEdit={false} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with hasEdit true', () => {
    const component = render(<Avatar hasEdit={true} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
