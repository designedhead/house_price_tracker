interface Props {
  language?: string;
  value: number;
  currency?: string;
}
export const formatAsCurrency = ({
  language = "en",
  value = 0,
  currency = "GBP",
}: Props) => {
  if (!language || !currency) return value;
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
