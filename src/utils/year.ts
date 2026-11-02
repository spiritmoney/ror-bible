/**
 * Get the current year
 * @returns The current year as a number
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

/**
 * Get the copyright year string
 * @param startYear Optional start year for copyright range (e.g., "2022 - 2024")
 * @returns Formatted copyright year string
 */
export const getCopyrightYear = (startYear?: number): string => {
  const currentYear = getCurrentYear();
  if (startYear && startYear !== currentYear) {
    return `${startYear} - ${currentYear}`;
  }
  return currentYear.toString();
};
