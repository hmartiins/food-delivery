import React from 'react';

import { render } from '@testing-library/react-native';

import { images } from '@/constants';

import { EmptyData } from '../EmptyData';

describe('<EmptyData />', () => {
  const defaultProps = {
    title: 'Nothing matched your search',
    subtitle: 'Try a different search term or check for typos.',
    image: images.search,
  };

  it('should render without errors', () => {
    const { getByTestId } = render(<EmptyData {...defaultProps} />);

    const customIcon = getByTestId('custom-icon');
    const emptyDataTitle = getByTestId('empty-data-title');
    const emptyDataSubtitle = getByTestId('empty-data-subtitle');

    expect(emptyDataTitle).toHaveTextContent(defaultProps.title);
    expect(emptyDataSubtitle).toHaveTextContent(defaultProps.subtitle);
    expect(customIcon.props.source).toBe(defaultProps.image);
  });

  describe('snapshots', () => {
    it('should match snapshot with default props', () => {
      const component = render(<EmptyData {...defaultProps} />);
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
