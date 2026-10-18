export type CalendarId = string;
export type CalendarArg = CalendarId | CalendarId[];
export type Convention = "following" | "preceding" | "modified_following" | "modified_preceding";

export interface Closure { calendar: string; reason: "weekend" | "holiday"; name?: string }
export interface EarlyClose { calendar: string; close_time: string; timezone: string | null; name: string }
export interface DayStatus {
  calendar: string | string[];
  date: string;
  weekday: string;
  business_day: boolean;
  closures: Closure[];
  early_closes?: EarlyClose[];
  next_business_day: string;
  previous_business_day: string;
}

export class BankdayError extends Error {
  status: number;
  code: string;
  details: unknown;
}

export class Bankday {
  constructor(opts?: { apiKey?: string; baseUrl?: string; fetch?: typeof fetch });
  request<T = unknown>(path: string, params?: Record<string, unknown>): Promise<T>;
  isBusinessDay(calendar: CalendarArg, date: string): Promise<DayStatus>;
  today(calendar: CalendarArg, timezone?: string): Promise<DayStatus & { timezone: string; upcoming_holidays: { date: string; name: string; calendar: string }[] }>;
  addBusinessDays(calendar: CalendarArg, date: string, days: number): Promise<{ calendar: string | string[]; date: string; days: number; result: string; result_status: DayStatus }>;
  countBusinessDays(calendar: CalendarArg, start: string, end: string, includeStart?: boolean): Promise<{ business_days: number; calendar_days: number; start: string; end: string }>;
  nextBusinessDay(calendar: CalendarArg, date?: string, inclusive?: boolean): Promise<{ result: string }>;
  previousBusinessDay(calendar: CalendarArg, date?: string, inclusive?: boolean): Promise<{ result: string }>;
  roll(calendar: CalendarArg, date: string, convention?: Convention): Promise<{ result: string; adjusted: boolean }>;
  listBusinessDays(calendar: CalendarArg, start: string, end: string): Promise<{ count: number; business_days: string[] }>;
  holidays(calendar: CalendarArg, opts?: { year?: number; start?: string; end?: string }): Promise<{ count: number; holidays: { date: string; weekday: string; name: string; calendar: string }[]; early_closes?: (EarlyClose & { date: string })[] }>;
  fxSpot(pair: string, tradeDate: string): Promise<{ pair: string; trade_date: string; spot_lag: number; spot_date: string; calendars: Record<string, string> }>;
  achSettlement(opts?: { submittedAt?: string; type?: "standard" | "same_day"; amount?: number }): Promise<{ settlement_date: string; settlement_time_et: string; same_day_window: number | null; notes: string[] }>;
  calendars(opts?: { type?: "rail" | "exchange" | "country"; q?: string }): Promise<{ count: number; calendars: unknown[] }>;
  calendar(id: CalendarId): Promise<unknown>;
  account(): Promise<unknown>;
}
export default Bankday;
