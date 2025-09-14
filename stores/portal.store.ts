import type { ReactNode } from 'react';

import { create } from 'zustand';

interface PortalElement {
  name: string;
  component: ReactNode;
}

type PortalState = {
  components: Record<string, ReactNode>;

  addComponent: (element: PortalElement) => void;
  removeComponent: (name: string) => void;
  getComponents: () => [string, ReactNode][];
};

export const usePortalStore = create<PortalState>((set, get) => ({
  components: {},

  addComponent: ({ name, component }) => {
    set(state => ({
      components: {
        ...state.components,
        [name]: component,
      },
    }));
  },

  removeComponent: name => {
    set(state => {
      const newComponents = { ...state.components };
      delete newComponents[name];
      return { components: newComponents };
    });
  },

  getComponents: () => Object.entries(get().components),
}));
