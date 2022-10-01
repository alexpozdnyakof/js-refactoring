import { Invoice, Play, Performance } from './domain-types'

export function statement(invoice: Invoice, plays: Record<string, Play>) {
	let totalAmount = 0
	const playFor = (aPerformance: Performance) => plays[aPerformance.playID]

	const volumeCreditsFor = (aPerformance: Performance): number => {
		let result = 0
		result += Math.max(aPerformance.audience - 30, 0)

		if (playFor(aPerformance).type == 'comedy')
			result += Math.floor(aPerformance.audience / 5)

		return result
	}

	function amountFor(aPerformance: Performance): number {
		let result = 0

		switch (playFor(aPerformance).type) {
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
				throw new Error(`unknown type: ${playFor(aPerformance).type}`)
		}
		return result
	}

	let result = `Statement for ${invoice.customer}\n`

	for (let perf of invoice.performances) {
		// Вывод строки счета
		result += ` ${playFor(perf).name}: ${usd(amountFor(perf) / 100)}`
		result += ` (${perf.audience} seats)\n`
		totalAmount += amountFor(perf)
	}

	let volumeCredits = 0
	for (let perf of invoice.performances) {
		volumeCredits += volumeCreditsFor(perf)
	}


	result += `Amount owed is ${usd(totalAmount)}\n`
	result += `You earned ${volumeCredits} credits\n`
	return result
}

function usd(aNumber: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	}).format(aNumber / 100)
}


