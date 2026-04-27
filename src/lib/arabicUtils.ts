export const toArabicNumerals = (n: number | string): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(n).replace(/\d/g, (d) => arabicDigits[parseInt(d)]);
};
