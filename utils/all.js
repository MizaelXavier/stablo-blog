export function formatDate(date) {
  if (!date) return "";
  
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

// because we use sanity-next-image
// vercel throws error when using normal imports
export function myLoader({ src }) {
  return src;
}
