const dateFormatter = new Intl.DateTimeFormat('sr-RS')
const currencyFormatter = new Intl.NumberFormat('sr-RS', {
  currency: 'RSD',
  maximumFractionDigits: 2,
  style: 'currency',
})
const numberFormatter = new Intl.NumberFormat('sr-RS')

export const formatDate = (value?: null | string): string => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return dateFormatter.format(date)
}

export const formatCurrency = (value?: null | number): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '-'
  }

  return currencyFormatter.format(value)
}

export const formatNumber = (value?: null | number): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '-'
  }

  return numberFormatter.format(value)
}
