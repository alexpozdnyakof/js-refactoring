"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statement = void 0;
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    const playFor = (aPerformance) => plays[aPerformance.playID];
    const volumeCreditsFor = (aPerformance) => {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if (playFor(aPerformance).type == 'comedy')
            result += Math.floor(aPerformance.audience / 5);
        return result;
    };
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format;
    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);
        // Дополнительный бонус за каждые 10 комедий
        if ('comedy' == playFor(perf).type)
            volumeCredits += Math.floor(perf.audience / 5);
        // Вывод строки счета
        result += ` ${playFor(perf).name}: ${format(amountFor(perf, playFor(perf)) / 1000)}`;
        result += ` (${perf.audience} seats)\n`;
        totalAmount += amountFor(perf, playFor(perf));
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}
exports.statement = statement;
function amountFor(aPerformance, play) {
    let result = 0;
    switch (play.type) {
        case 'tragedy':
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case 'comedy':
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return result;
}
