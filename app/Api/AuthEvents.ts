// @ts-nocheck
if (!global._authHandlers) {
  global._authHandlers = {
    openAuthModal: null,
    navigate: null,
  };
}

export const setHandler = (
  openFn: () => void,
  navigateFn: (screen: string) => void
) => {
  global._authHandlers.openAuthModal = openFn;
  global._authHandlers.navigate = navigateFn;
};

export const openAuthModal = () => {
  if (global._authHandlers?.openAuthModal) {
    global._authHandlers.openAuthModal();
  }
};

export const navigate = (screen: string, params?: object) => {
  if (global._authHandlers?.navigate) {
    global._authHandlers.navigate(screen, params);
  }
};