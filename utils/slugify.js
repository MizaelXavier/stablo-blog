export function slugify(text) {
  const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  const to = "aaaaaeeeeeiiiiooooouuuunc------";

  const newText = text.toString().toLowerCase()
    .trim()
    .split('')
    .map(char => {
      const index = from.indexOf(char);
      return index !== -1 ? to[index] : char;
    })
    .join('')
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/&/g, '-e-')     // Replace & with 'e'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text

  return newText;
} 