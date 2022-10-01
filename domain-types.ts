export type Play = {
  name: string;
  type: 'tragedy' | 'comedy'
}

export type Performance = {
	playID: string
	audience: number
}

export type Invoice = {
	customer: string
	performances: Array<Performance>
}

