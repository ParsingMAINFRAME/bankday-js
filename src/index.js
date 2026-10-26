// Bankday API client: zero dependencies, works in Node 18+, Deno, Bun, browsers and edge runtimes.
export class BankdayError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = "BankdayError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const cal = (c) => (Array.isArray(c) ? c.join(",") : c);

export class Bankday {
  /** @param {{ apiKey?: string, baseUrl?: string, fetch?: typeof fetch }} [opts] */
  constructor(opts = {}) {
    const env = typeof process !== "undefined" ? process.env : {};
    this.apiKey = opts.apiKey ?? env.BANKDAY_API_KEY ?? env.BANKDAY_KEY;
    this.baseUrl = (opts.baseUrl ?? env.BANKDAY_BASE_URL ?? "https://bankday.dev").replace(/\/$/, "");
    this.fetch = opts.fetch ?? globalThis.fetch.bind(globalThis);
    if (!this.apiKey) throw new BankdayError(0, "missing_api_key", "Pass { apiKey } or set BANKDAY_API_KEY. Free key: " + this.baseUrl + "/#signup");
  }

  async request(path, params = {}) {
    const url = new URL(this.baseUrl + path);
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    const res = await this.fetch(url, { headers: { authorization: `Bearer ${this.apiKey}`, "user-agent": "bankday-js/1.1.0" } });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const e = body.error || {};
      throw new BankdayError(res.status, e.code || "http_error", e.message || `HTTP ${res.status}`, e);
    }
    return body;
  }

  isBusinessDay(calendar, date) { return this.request("/v1/business-day", { calendar: cal(calendar), date }); }
  today(calendar, timezone) { return this.request("/v1/today", { calendar: cal(calendar), timezone }); }
  addBusinessDays(calendar, date, days) { return this.request("/v1/business-days/add", { calendar: cal(calendar), date, days }); }
  countBusinessDays(calendar, start, end, includeStart = false) { return this.request("/v1/business-days/count", { calendar: cal(calendar), start, end, include_start: includeStart }); }
  nextBusinessDay(calendar, date, inclusive = false) { return this.request("/v1/business-days/next", { calendar: cal(calendar), date, inclusive }); }
  previousBusinessDay(calendar, date, inclusive = false) { return this.request("/v1/business-days/previous", { calendar: cal(calendar), date, inclusive }); }
  roll(calendar, date, convention = "following") { return this.request("/v1/business-days/roll", { calendar: cal(calendar), date, convention }); }
  listBusinessDays(calendar, start, end) { return this.request("/v1/business-days", { calendar: cal(calendar), start, end }); }
  holidays(calendar, opts = {}) { return this.request("/v1/holidays", { calendar: cal(calendar), year: opts.year, start: opts.start, end: opts.end }); }
  fxSpot(pair, tradeDate) { return this.request("/v1/fx/spot", { pair, trade_date: tradeDate }); }
  achSettlement(opts = {}) { return this.request("/v1/ach/settlement", { submitted_at: opts.submittedAt, type: opts.type, amount: opts.amount }); }
  payrollSchedule(calendar, frequency, opts = {}) { return this.request("/v1/payroll/schedule", { calendar: cal(calendar), frequency, year: opts.year, start: opts.start, end: opts.end, anchor: opts.anchor, days: opts.days, day: opts.day, adjust: opts.adjust, lead_days: opts.leadDays }); }
  calendars(opts = {}) { return this.request("/v1/calendars", { type: opts.type, q: opts.q }); }
  calendar(id) { return this.request(`/v1/calendars/${encodeURIComponent(id)}`); }
  account() { return this.request("/v1/account"); }
}

export default Bankday;
