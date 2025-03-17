import React from 'react';
import { Button, ButtonProps, forwardRef } from '@chakra-ui/react';
import SmartLink, { SmartLinkProps } from '../SmartLink';
import { useAuth0IfEnabled } from './authIfEnabled';

export const ButtonWithAuth = forwardRef<
  SmartLinkProps & ButtonProps,
  typeof Button
>((props, ref) => {
  const auth = useAuth0IfEnabled();

  if (!auth.isEnabled) {
    return <Button ref={ref} as={SmartLink} {...props} />;
  }

  return auth.isAuthenticated && <Button ref={ref} as={SmartLink} {...props} />;
});
