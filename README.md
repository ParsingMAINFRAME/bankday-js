# bankday

Official JavaScript/TypeScript client for the [Bankday API](https://bankday.dev/docs): business days, bank holidays and settlement dates for US ACH/Fedwire, TARGET2, UK Bacs, Payments Canada, 28 stock exchanges and 247 countries.

Zero dependencies. Works in Node 18+, Deno, Bun, browsers and edge runtimes.

```bash
npm install bankday
```

```js
import { Bankday } from "bankday";

const bd = new Bankday({ apiKey: process.env.BANKDAY_API_KEY }); // free key at https://bankday.dev/#signup

await bd.isBusinessDay("us-fed", "2026-10-12");                   // Columbus Day: business_day false
await bd.addBusinessDays("us-fed", "2026-11-25", 2);              // result "2026-11-30"
await bd.isBusinessDay(["us-fed", "eu-target2"], "2026-04-03");   // joint calendar
await bd.fxSpot("EURUSD", "2026-11-25");                          // spot_date "2026-11-27"
await bd.achSettlement({ type: "same_day", submittedAt: new Date().toISOString() });
await bd.payrollSchedule("us-fed", "biweekly", { anchor: "2027-01-08", year: 2027 }); // paydays + submit-by dates
```

Errors throw `BankdayError` with `status`, `code` and `message`.

MIT licensed.
