# bankday

[![tests](https://github.com/ParsingMAINFRAME/bankday-js/actions/workflows/test.yml/badge.svg)](https://github.com/ParsingMAINFRAME/bankday-js/actions/workflows/test.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

JavaScript and TypeScript client for the [Bankday API](https://bankday.dev): business days, bank holidays and settlement dates for each payment system. Covers the US Federal Reserve (FedACH and Fedwire), Payments Canada, TARGET2, UK Bacs, 28 stock exchanges and 247 countries, through 2040.

Zero dependencies. Works in Node 18+, Deno, Bun, browsers and edge runtimes. Types included.

```bash
npm install bankday
```

## Quick start

Get a free API key at [bankday.dev](https://bankday.dev/#signup) (1,000 requests a month, no card needed), then:

```js
import { Bankday } from "bankday";

const bd = new Bankday({ apiKey: process.env.BANKDAY_API_KEY });

await bd.isBusinessDay("us-fed", "2026-11-11");             // { business_day: false, ... } Veterans Day
await bd.isBusinessDay("us-fed", "2027-12-24");             // { business_day: true, ... } see below
await bd.addBusinessDays("us-fed", "2026-11-25", 2);        // { result: "2026-11-30", ... }
await bd.isBusinessDay(["us-fed", "eu-target2"], "2026-04-03"); // joint calendar: open on both rails?
await bd.fxSpot("EURUSD", "2026-11-25");                    // { spot_date: "2026-11-27", ... }
await bd.payrollSchedule("us-fed", "biweekly", { anchor: "2027-01-08", year: 2027 }); // paydays + submit-by dates
```

## Why not a holiday library?

Federal holidays and Federal Reserve closures are not the same list. When a holiday falls on a Saturday, federal offices close on the Friday before, but the Fed stays open and ACH and wires settle as normal. That happened on July 3, 2026, and it happens again on June 18 and December 24, 2027. Payments Canada, TARGET2 and Bacs each have their own rules too. Bankday follows each operator's published schedule, so you don't have to.

## Methods

Every method returns the parsed JSON response. Calendars are ids like `us-fed`, `eu-target2`, `uk-bacs`, `ca-payments`, `xnys` or a country code (`gb`, `de`, `jp`), or an array of them for a joint calendar.

| Method | Endpoint |
|---|---|
| `isBusinessDay(calendar, date)` | [`/v1/business-day`](https://bankday.dev/docs#business-day) |
| `today(calendar, timezone?)` | [`/v1/today`](https://bankday.dev/docs#today) |
| `addBusinessDays(calendar, date, days)` | [`/v1/business-days/add`](https://bankday.dev/docs#add) |
| `countBusinessDays(calendar, start, end, includeStart?)` | [`/v1/business-days/count`](https://bankday.dev/docs#count) |
| `nextBusinessDay(calendar, date?, inclusive?)` / `previousBusinessDay(...)` | [`/v1/business-days/next`](https://bankday.dev/docs#next), `/previous` |
| `roll(calendar, date, convention?)` | [`/v1/business-days/roll`](https://bankday.dev/docs#roll) (following, preceding, modified_following, modified_preceding) |
| `listBusinessDays(calendar, start, end)` | [`/v1/business-days`](https://bankday.dev/docs#list) |
| `holidays(calendar, { year?, start?, end? })` | [`/v1/holidays`](https://bankday.dev/docs#holidays) |
| `fxSpot(pair, tradeDate)` | [`/v1/fx/spot`](https://bankday.dev/docs#fx) |
| `achSettlement({ submittedAt?, type?, amount? })` | [`/v1/ach/settlement`](https://bankday.dev/docs#ach) |
| `payrollSchedule(calendar, frequency, opts?)` | [`/v1/payroll/schedule`](https://bankday.dev/docs#payroll) |
| `calendars({ type?, q? })` / `calendar(id)` | [`/v1/calendars`](https://bankday.dev/docs#calendars) |
| `account()` | [`/v1/account`](https://bankday.dev/docs#account) |

Full parameter and response reference: [bankday.dev/docs](https://bankday.dev/docs).

## Configuration

```js
new Bankday({
  apiKey: "bd_live_...",          // or the BANKDAY_API_KEY environment variable
  baseUrl: "https://bankday.dev", // or BANKDAY_BASE_URL
  fetch: customFetch,             // optional, for runtimes without a global fetch
});
```

## Errors

Failed requests throw `BankdayError` with `status` (HTTP status), `code` (for example `unknown_calendar`, `date_out_of_range`, `quota_exceeded`) and a readable `message`.

```js
try {
  await bd.isBusinessDay("narnia", "2026-01-02");
} catch (e) {
  if (e instanceof BankdayError && e.code === "unknown_calendar") { /* ... */ }
}
```

## Links

- [API docs](https://bankday.dev/docs) · [Pricing](https://bankday.dev/pricing) · [All calendars](https://bankday.dev/calendars)
- [Python client](https://github.com/ParsingMAINFRAME/bankday-python) · [MCP server for AI agents](https://bankday.dev/docs#mcp)
- [Free Federal Reserve holiday dataset](https://github.com/ParsingMAINFRAME/fed-holidays)

## License

MIT
