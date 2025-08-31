export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const escapeHtml = (text: string): string => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};
