const AUD = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 2,
});

export const money = (value: number): string => AUD.format(value);

/** "$6.50" without the cents when they're .00 — used on menu listings. */
export const moneyShort = (value: number): string =>
  Number.isInteger(value) ? `$${value}` : AUD.format(value);

export const plural = (count: number, one: string, many = `${one}s`): string =>
  count === 1 ? one : many;
