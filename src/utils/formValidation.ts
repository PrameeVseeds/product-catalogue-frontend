export const isHexColor = (value: string) => /^#[0-9a-f]{6}$/i.test(value);
export const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
export const optionalText = (value: string) => value.trim() || null;
