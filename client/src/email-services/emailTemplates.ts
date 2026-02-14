// import { render } from "@react-email/render";
import type { UserStats } from "../services/userData";
import {
  // LoginNotificationEmail,
  // PeriodReportEmail,
  // TestResultEmail,
  type TestDetails,
} from "./templates/EmailTemplates";

export type { TestDetails }; // Re-export for other files using it

export const emailTemplates = {
  getLoginNotificationHtml: async (_name: string) => {
    // return await render(LoginNotificationEmail({ name }));
    return "";
  },

  getPeriodReportHtml: async (
    _name: string,
    _period: "Weekly" | "Monthly",
    _stats: UserStats,
  ) => {
    // return await render(PeriodReportEmail({ name, period, stats }));
    return "";
  },

  getTestResultHtml: async (_name: string, _details: TestDetails) => {
    // return await render(TestResultEmail({ name, details }));
    return "";
  },
};
