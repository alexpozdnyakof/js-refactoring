import { expect } from 'chai'
import { statement } from './app'
import invoices from './data/invoices.json'
import plays from './data/plays.json'
import { Play } from './domain-types'

it('should return string', () => {
	console.log(statement(invoices[0], plays as Record<string, Play>))
	expect(statement(invoices[0], plays as Record<string, Play>)).be.string(
		`Statement for BigCo\n Hamlet: $650.00 (55 seats)\n As You Like It: $580.00 (35 seats)\n Othello: $500.00 (40 seats)\nAmount owed is $1,730.00\nYou earned 47 credits`
	)
})
