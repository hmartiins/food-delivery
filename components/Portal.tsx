import { ReactNode, useEffect } from 'react';

import { usePortalStore } from '@/stores/portal.store';

interface PortalProps {
  children: ReactNode;
  name: string;
}

export const Portal = ({ children, name }: PortalProps) => {
  const { addComponent, removeComponent } = usePortalStore();

  useEffect(() => {
    addComponent({ name, component: children });
    return () => removeComponent(name);
  }, [children, name, addComponent, removeComponent]);

  return null;
};
