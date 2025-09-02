export const formatDateID = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('id-ID');
};

export const formatDateMediumID = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};