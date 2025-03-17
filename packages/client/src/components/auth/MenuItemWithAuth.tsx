import React from 'react';
import { forwardRef, MenuItem, MenuItemProps } from '@chakra-ui/react';
import { useAuth0IfEnabled } from './authIfEnabled';

export const MenuItemWithAuth = forwardRef<MenuItemProps, typeof MenuItem>(
  (props, ref) => {
    const auth = useAuth0IfEnabled();

    if (!auth.isEnabled) {
      return <MenuItem ref={ref} {...props} />;
    }

    return auth.isAuthenticated && <MenuItem ref={ref} {...props} />;
  }
);
