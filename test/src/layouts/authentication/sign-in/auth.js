export const login = (username, password) => {
  const USER = "admin";
  const PASS = "123456";

  if (username === USER && password === PASS) {
    localStorage.setItem("auth", "true");
    return true;
  }

  return false;
};

export const logout = () => {
  localStorage.removeItem("auth");
};

export const isAuthenticated = () => {
  return localStorage.getItem("auth") === "true";
};
