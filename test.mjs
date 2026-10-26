// Live test: BANKDAY_API_KEY=... node test.mjs
import assert from "node:assert/strict";
import { Bankday, BankdayError } from "./src/index.js";

const bd = new Bankday();
assert.equal((await bd.isBusinessDay("us-fed", "2026-10-12")).business_day, false);
assert.equal((await bd.addBusinessDays("us-fed", "2026-11-25", 2)).result, "2026-11-30");
assert.equal((await bd.isBusinessDay(["us-fed", "eu-target2"], "2026-04-03")).business_day, false);
assert.equal((await bd.fxSpot("EURUSD", "2026-11-25")).spot_date, "2026-11-27");
assert.equal((await bd.isBusinessDay("xnys", "2026-11-27")).early_closes[0].close_time, "13:00");
assert.equal((await bd.isBusinessDay("lynx", "2026-12-28")).business_day, false);
await assert.rejects(() => bd.isBusinessDay("narnia", "2026-01-02"), (e) => e instanceof BankdayError && e.status === 404);
console.log("bankday-js: all checks passed");
