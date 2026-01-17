export const validateEventId = (id: string): string | undefined => {
  if (!id) return "ID wydarzenia jest wymagane";
  const idNum = Number(id);
  if (isNaN(idNum)) return "ID musi być liczbą";
  if (!Number.isInteger(idNum)) return "ID musi być całkowitą liczbą";
  if (idNum < 0) return "ID musi być nieujemne";
  return undefined;
};

export const validateUserName = (name: string): string | undefined => {
  if (!name) return "To pole jest wymagane";
  if (name.length > 50) return "Maksymalnie 50 znaków";
  if (!/^[\p{L}-]+$/u.test(name)) {
    return "Niedozwolone spacje, cyfry lub znaki specjalne";
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return "Hasło jest wymagane";
  if (password.length < 8) return "Minimum 8 znaków";
  if (password.length > 300) return "Maksymalnie 300 znaków";
  return undefined;
};

export const validateSecretCode = (secretCode: string): string | undefined => {
  if (!secretCode) return "To pole jest wymagane";
  if (secretCode.length > 200) return "Maksymalnie 200 znaków";
  return undefined;
};

export const validateName = (name: string): string | undefined => {
  if (!name) return "To pole jest wymagane";
  if (name.length > 100) return "Maksymalnie 100 znaków";
  return undefined;
};
