import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// prevents multiple redirects on multiple 401s
let isRedirecting = false;

/**
 * Global navigation helper
 * Use this from Axios interceptor
 */
export function navigate(name, params = {}) {
  // navigation not ready or already redirecting
  if (!navigationRef.isReady() || isRedirecting) {
    return;
  }

  isRedirecting = true;

  // reset stack and redirect
  navigationRef.reset({
    index: 0,
    routes: [{ name, params }],
  });

  // unlock navigation after short delay
  setTimeout(() => {
    isRedirecting = false;
  }, 500);
}
