

export const formatMoney = (value: string) => {
  const round = Number(value).toFixed(2);
  return round.toString().replace('.', ',');
};

export const formatNumberToMoneyWithSymbol = (value: number, prefix: string = 'R$') => `${prefix} ${formatMoney(String(value))}`;

export const padNumberStart = (value:number, lenght:number = 2, fill:string = '0' ) => value.toString().padStart(lenght, fill);

export const formatSimpleDate = (date: Date) => `${padNumberStart(date.getDate())}/${padNumberStart(date.getMonth())}/${date.getFullYear()}`;
