export function getInitials(name: string) {
  if (!name) return 'UU';
  return (
    name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  );
}

export default getInitials;
