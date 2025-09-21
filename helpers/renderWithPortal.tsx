import { render } from '@testing-library/react-native';

import { PortalProvider } from '@/components/PortalProvider';

export const renderWithPortal = (component: React.ReactElement) => {
  return render(<PortalProvider>{component}</PortalProvider>);
};
