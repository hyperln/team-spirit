export function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function kebabToSentenceCase(s: string) {
  return s
    .split('-')
    .map((word) => {
      return word.slice(0, 1).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
