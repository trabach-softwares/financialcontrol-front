/**
 * API Financial Control - Central Aggregator
 * Reexports domain modules and provides a default aggregate export.
 */

// Named re-exports (tree-shakable)
export { FINANCIAL_ROUTES } from "./routes";
export * from "./errors";
export * from "./auth";
export * from "./user";
export * from "./transactions";
export * from "./plans";
export * from "./dashboard";
export * from "./admin";
export * from "./categories";

// Default aggregate export for backwards compatibility
import * as auth from "./auth";
import * as user from "./user";
import * as transactions from "./transactions";
import * as plans from "./plans";
import * as dashboard from "./dashboard";
import * as admin from "./admin";
import * as categories from "./categories";
import { FINANCIAL_ROUTES as ROUTES } from "./routes";

const api = {
  ...auth,
  ...user,
  ...transactions,
  ...plans,
  ...dashboard,
  ...admin,
  ...categories,
  FINANCIAL_ROUTES: ROUTES,
};

export default api;
