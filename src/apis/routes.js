// Centralized API routes for Financial Control
export const FINANCIAL_ROUTES = {
  // ========== AUTH ==========
  authLogin: "/auth/login",
  authRegister: "/auth/register",
  authMe: "/auth/me",
  authLogout: "/auth/logout",
  authRefreshToken: "/auth/refresh",

  // ========== USER - PROFILE ==========
  userProfileGet: "/users/profile",
  userProfileUpdate: "/users/profile",
  userProfilePasswordChange: "/users/profile/password",
  userProfileAvatarUpload: "/users/profile/avatar",
  userProfileAvatarRemove: "/users/profile/avatar",
  userSettingsGet: "/users/settings",
  userSettingsUpdate: "/users/settings",
  userAccountDelete: "/users/account",
  userPlanUpdate: "/users/plan",

  // ========== TRANSACTIONS ==========
  transactionsList: "/transactions",
  transactionsCreate: "/transactions",
  transactionsGetById: "/transactions", // + /:id
  transactionsUpdate: "/transactions", // + /:id
  transactionsDelete: "/transactions", // + /:id
  transactionsStats: "/transactions/stats",
  transactionsTimeline: "/transactions/timeline",

  // ========== ACCOUNTS ==========
  accountsList: "/accounts",
  accountsCreate: "/accounts",
  accountsGetById: "/accounts", // + /:id
  accountsUpdate: "/accounts", // + /:id
  accountsDelete: "/accounts", // + /:id
  accountsArchive: "/accounts", // + /:id/archive
  accountsSummary: "/accounts/summary",
  accountStatement: "/accounts", // + /:accountId/statement
  accountStatementExport: "/accounts", // + /:accountId/statement/export
  accountReconciliation: "/accounts", // + /:accountId/reconciliation

  // ========== PLANS ==========
  plansList: "/plans",
  plansGetById: "/plans", // + /:id
  plansCreate: "/plans",
  plansUpdate: "/plans", // + /:id
  plansDelete: "/plans", // + /:id

  // ========== PAYMENTS (Asaas Integration) ==========
  paymentsCreate: "/payments",
  paymentsStatus: "/payments", // + /:id
  paymentsList: "/payments",
  paymentsCancel: "/payments", // + /:id
  paymentsPixQrCode: "/payments", // + /:id/pix
  paymentsLink: "/payments", // + /:id/link

  // ========== DASHBOARD ==========
  dashboardStats: "/dashboard/stats",
  dashboardCharts: "/dashboard/charts",
  dashboardRecentTransactions: "/dashboard/recent",

  // ========== ADMIN ==========
  adminUsersList: "/admin/users",
  adminUsersGetById: "/admin/users", // + /:id
  adminUsersUpdate: "/admin/users", // + /:id
  adminUsersDelete: "/admin/users", // + /:id
  adminStatistics: "/admin/statistics",
};
