export const validators = {
  userName: (str) => /^[a-z][a-z0-9_]{4,16}$/.test(str),
  email: (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str),
  password: (str) => /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(str),
  name: (str) => /^[a-zA-Z\s]{2,50}$/.test(str),
  noExtraSpaces: (str) => str.replace(/\s{2,}/g, " ").trim(),
};
