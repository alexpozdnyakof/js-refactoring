export type Play = {
  name: string;
  type: 'tragedy' | 'comedy'
}

export type Invoice = {
  customer: string;
  performances: Array<{
    playID: string;
    audience: number;
  }>
}
