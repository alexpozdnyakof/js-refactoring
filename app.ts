import { Invoice, Play, Performance } from './domain-types'

type PerformanceWithPlay = Performance & { play: Play }
type EnrichedPerformance = PerformanceWithPlay & { amount: number } & {
	volumeCredits: number
}

export function statement(invoice: Invoice, plays: Record<string, Play>) {
	const statementData = {
		customer: invoice.customer,
		performances: invoice.performances.map(enrichPerformance),
	}
	return renderPlainText(statementData, plays)

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

	function volumeCreditsFor(aPerformance: PerformanceWithPlay): number {
		let result = 0
		result += Math.max(aPerformance.audience - 30, 0)

		if (aPerformance.play.type == 'comedy')
			result += Math.floor(aPerformance.audience / 5)

		return result
	}
}

function renderPlainText(
	data: {
		customer: string
		performances: Array<EnrichedPerformance>
	},
	plays: Record<string, Play>
): string {
	let result = `Statement for ${data.customer}\n`

	for (let perf of data.performances) {
		result += ` ${perf.play.name}: ${usd(perf.amount)} (${
			perf.audience
		} seats)\n`
	}

	result += `Amount owed is ${usd(totalAmount())}\n`
	result += `You earned ${totalVolumeCredits()} credits\n`
	return result

	function totalAmount() {
		let result = 0
		for (let perf of data.performances) {
			result += perf.amount
		}
		return result
	}

	function totalVolumeCredits() {
		let result = 0
		for (let perf of data.performances) {
			result += perf.volumeCredits
		}
		return result
	}

	function usd(aNumber: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
		}).format(aNumber / 100)
	}
}