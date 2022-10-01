"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const app_1 = require("./app");
const invoices_json_1 = __importDefault(require("./data/invoices.json"));
const plays_json_1 = __importDefault(require("./data/plays.json"));
it('should return string', () => {
    console.log((0, app_1.statement)(invoices_json_1.default[0], plays_json_1.default));
    (0, chai_1.expect)((0, app_1.statement)(invoices_json_1.default[0], plays_json_1.default)).be.string(`Statement for BigCo\n Hamlet: $65.00 (55 seats)\n As You Like It: $58.00 (35 seats)\n Othello: $50.00 (40 seats)\nAmount owed is $1,730.00\nYou earned 54 credits`);
});
