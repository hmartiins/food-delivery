import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { offers } from '@/constants';

import Index from '../index';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock do Zustand store
jest.mock('@/stores/cart.store', () => ({
  useCartStore: () => ({
    getTotalItems: jest.fn(() => 0),
  }),
}));

describe('Index Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render without errors', () => {
      render(<Index />);
      expect(screen.getByTestId('index-safe-area')).toBeTruthy();
    });

    it('should render the main FlatList component', () => {
      render(<Index />);
      expect(screen.getByTestId('offers-list')).toBeTruthy();
    });

    it('should render all main sections of the screen', () => {
      render(<Index />);

      expect(screen.getByTestId('header-container')).toBeTruthy();
      expect(screen.getByTestId('offers-list')).toBeTruthy();
    });
  });

  describe('Header Component', () => {
    it('should render location section with correct text', () => {
      render(<Index />);

      expect(screen.getByTestId('deliver-to-text')).toBeTruthy();
      expect(screen.getByTestId('deliver-to-text')).toHaveTextContent(
        'DELIVER TO'
      );
    });

    it('should render current location as Brazil', () => {
      render(<Index />);

      expect(screen.getByTestId('location-text')).toBeTruthy();
      expect(screen.getByTestId('location-text')).toHaveTextContent('Brazil');
    });

    it('should render location button with arrow', () => {
      render(<Index />);

      expect(screen.getByTestId('location-button')).toBeTruthy();
      expect(screen.getByTestId('location-arrow')).toBeTruthy();
    });

    it('should render cart button component', () => {
      render(<Index />);

      expect(screen.getByTestId('cart-button')).toBeTruthy();
    });
  });

  describe('Offers List', () => {
    it('should render all offer items from data', () => {
      render(<Index />);

      offers.forEach(offer => {
        expect(screen.getByTestId(`offer-item-${offer.id}`)).toBeTruthy();
      });
    });

    it('should render offer cards with correct titles', () => {
      render(<Index />);

      offers.forEach(offer => {
        expect(screen.getByTestId(`offer-title-${offer.id}`)).toBeTruthy();
        expect(screen.getByTestId(`offer-title-${offer.id}`)).toHaveTextContent(
          offer.title
        );
      });
    });

    it('should render offer images for each item', () => {
      render(<Index />);

      offers.forEach(offer => {
        expect(screen.getByTestId(`offer-image-${offer.id}`)).toBeTruthy();
        expect(
          screen.getByTestId(`offer-image-container-${offer.id}`)
        ).toBeTruthy();
      });
    });

    it('should render offer info sections for each item', () => {
      render(<Index />);

      offers.forEach(offer => {
        expect(screen.getByTestId(`offer-info-${offer.id}`)).toBeTruthy();
      });
    });

    it('should render correct number of offer items', () => {
      render(<Index />);

      const offerItems = offers.map(offer =>
        screen.getByTestId(`offer-item-${offer.id}`)
      );

      expect(offerItems).toHaveLength(offers.length);
    });
  });

  describe('Offer Card Interactions', () => {
    it('should handle press events on all offer cards', () => {
      render(<Index />);

      offers.forEach(offer => {
        const offerCard = screen.getByTestId(`offer-card-${offer.id}`);
        fireEvent.press(offerCard);
        expect(offerCard).toBeTruthy();
      });
    });

    it('should render offer cards as pressable components', () => {
      render(<Index />);

      offers.forEach(offer => {
        const offerCard = screen.getByTestId(`offer-card-${offer.id}`);
        expect(offerCard.props.accessible).not.toBe(false);
      });
    });
  });

  describe('Data Integration', () => {
    it('should use offers data from constants', () => {
      render(<Index />);

      expect(offers.length).toBeGreaterThan(0);

      const firstOffer = offers[0];
      expect(
        screen.getByTestId(`offer-title-${firstOffer.id}`)
      ).toHaveTextContent(firstOffer.title);
    });
  });
});

describe('Index Screen Snapshots', () => {
  it('should match snapshot with default state', () => {
    const component = render(<Index />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with offers data', () => {
    expect(offers.length).toBeGreaterThan(0);

    const component = render(<Index />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
