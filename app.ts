import { Invoice, Play, Performance } from './domain-types'
import createStatementData, { StatementData } from './create-statement-data'

export function statement(invoice: Invoice, plays: Record<string, Play>) {
	return renderPlainText(createStatementData(invoice, plays))
}

function usd(aNumber: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	}).format(aNumber / 100)
}

function renderPlainText(data: StatementData): string {
	let result = `Statement for ${data.customer}\n`

	for (let perf of data.performances) {
		result += ` ${perf.play.name}: ${usd(perf.amount)} (${
			perf.audience
		} seats)\n`
	}

	result += `Amount owed is ${usd(data.totalAmount)}\n`
	result += `You earned ${data.totalVolumeCredits} credits\n`
	return result
}



function renderHtml(data: StatementData): string {
	let result = `<h1>Statement for ${data.customer}</h1>\n`
	result += '<table>/n'
	result += '<tr><th>play</th><th>seats</th><th>cost</th></tr>'
	for (let perf of data.performances) {
		result += ` <tr><td>${perf.play.name}</td>`
		result += `<td>${perf.audience} seats</td>`
		result += `<td>${usd(perf.amount)}</td>`
	}
	result += '</table>\n'
	result += `<p>Amount owed is: `
	result += `<em>${usd(data.totalAmount)}</em></p>\n `
	result += `<p>You earned <em>${data.totalVolumeCredits}`
	result += `</em> credits</p>\n`
	return result
}