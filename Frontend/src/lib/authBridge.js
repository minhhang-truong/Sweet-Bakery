let logoutFn = null;

export const registerLogout = (fn) => {
  logoutFn = fn;
};

export const forceLogout = async () => {
  if (logoutFn) await logoutFn();
};