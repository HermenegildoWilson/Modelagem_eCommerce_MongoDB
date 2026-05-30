export function formatPrice(value: number, currency = 'AOA') {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function productImageFallback(productName: string) {
  const initials = productName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return `https://placehold.co/900x720/1e293b/e2e8f0?text=${encodeURIComponent(initials || 'EC')}`
}
