export interface ICurrencyFormatter {
  value: number
  currency: string
  locale?: string
}
export const currencyFormatter = ({
  value,
  currency = 'USD',
  locale,
}: ICurrencyFormatter) => {
  return new Intl.NumberFormat(
    locale ? `${locale.toLowerCase()}-${locale}` : 'en-US',
    {
      style: 'currency',
      currency,
    },
  ).format(value)
}
