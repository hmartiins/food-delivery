import { Fragment, ReactNode } from 'react';

import { usePortalStore } from '@/stores/portal.store';

interface PortalProviderProps {
  children: ReactNode;
}

export const PortalProvider = ({ children }: PortalProviderProps) => {
  const { getComponents } = usePortalStore();
  const components = getComponents();

  return (
    <Fragment>
      {children}
      <Fragment>
        {components.map(([name, Component]) => (
          <Fragment key={name}>{Component}</Fragment>
        ))}
      </Fragment>
    </Fragment>
  );
};
