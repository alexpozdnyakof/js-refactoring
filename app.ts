import { Invoice, Play, Performance } from './domain-types'

export function statement(invoice: Invoice, plays: Record<string, Play>) {
	let totalAmount = 0
	let volumeCredits = 0
	const playFor = (aPerformance: Performance) => plays[aPerformance.playID]

	const volumeCreditsFor = (aPerformance: Performance): number => {
		let result = 0
		result += Math.max(aPerformance.audience - 30, 0)

		if (playFor(aPerformance).type == 'comedy')
			result += Math.floor(aPerformance.audience / 5)

		return result
  }

	let result = `Statement for ${invoice.customer}\n`
	const format = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	}).format

	for (let perf of invoice.performances) {
		volumeCredits += volumeCreditsFor(perf)

		// Дополнительный бонус за каждые 10 комедий
		if ('comedy' == playFor(perf).type)
			volumeCredits += Math.floor(perf.audience / 5)

		// Вывод строки счета
		result += ` ${playFor(perf).name}: ${format(
			amountFor(perf, playFor(perf)) / 1000
		)}`
		result += ` (${perf.audience} seats)\n`
		totalAmount += amountFor(perf, playFor(perf))
	}
	result += `Amount owed is ${format(totalAmount / 100)}\n`
	result += `You earned ${volumeCredits} credits\n`
	return result
}


function amountFor(aPerformance: Performance, play: Play): number {
	let result = 0

	switch (play.type) {
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
			throw new Error(`unknown type: ${play.type}`)
	}
	return result
}
