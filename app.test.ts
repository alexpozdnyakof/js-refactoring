import { expect } from 'chai'
import { statement } from './app'
import invoices from './data/invoices.json'
import plays from './data/plays.json'
import { Play } from './domain-types'

it('should return true', () => {
	expect(statement(invoices[0], plays as Record<string, Play>)).be.string
})
