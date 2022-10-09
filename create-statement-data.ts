import { Invoice, Play, Performance } from './domain-types'

type PerformanceWithPlay = Performance & { play: Play }
type EnrichedPerformance = PerformanceWithPlay & { amount: number } & {
	volumeCredits: number
}

export type StatementData = {
	customer: string
	performances: Array<EnrichedPerformance>
	totalAmount: number
	totalVolumeCredits: number
}
export default function createStatementData(
	invoice: Invoice,
	plays: Record<string, Play>
): StatementData {
	const withEnrichedPerformances = {
		customer: invoice.customer,
		performances: invoice.performances.map(enrichPerformance),
	}
	const statementData = {
		...withEnrichedPerformances,
		totalAmount: totalAmount(withEnrichedPerformances),
		totalVolumeCredits: totalVolumeCredits(withEnrichedPerformances),
	}

	return statementData

	function enrichPerformance<T extends Performance>(
		aPerformance: T
	): EnrichedPerformance {
		const withPlay = Object.assign(
			{ play: playFor(aPerformance) },
			aPerformance
		)
		return {
			...withPlay,
			amount: amountFor(withPlay),
			volumeCredits: volumeCreditsFor(withPlay),
		}
	}
	function playFor(aPerformance: Performance) {
		return plays[aPerformance.playID]
	}

	function volumeCreditsFor(aPerformance: PerformanceWithPlay): number {
		let result = 0
		result += Math.max(aPerformance.audience - 30, 0)

		if (aPerformance.play.type == 'comedy')
			result += Math.floor(aPerformance.audience / 5)

		return result
	}

	function totalAmount({
		performances,
	}: {
		performances: Array<EnrichedPerformance>
	}) {
		return performances.reduce((total, p) => total + p.amount, 0)
	}
	function totalVolumeCredits({
		performances,
	}: {
		performances: Array<EnrichedPerformance>
	}) {
		return performances.reduce((total, p) => total + p.volumeCredits, 0)
	}
}

function amountFor(aPerformance: PerformanceWithPlay): number {
	let result = 0

	switch (aPerformance.play.type) {
		case 'tragedy':
			result = 40_000

			if (aPerformance.audience > 30) {
				result += 1000 * (aPerformance.audience - 30)
			}

			break
		case 'comedy':
			result = 30_000

			if (aPerformance.audience > 20) {
				result += 10_000 + 500 * (aPerformance.audience - 20)
			}

			result += 300 * aPerformance.audience
			break

		default:
			throw new Error(`unknown type: ${aPerformance.play.type}`)
	}
	return result
}
