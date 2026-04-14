import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UploadPage } from "./pages/UploadPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { ProcessingStatusPage } from "./pages/ProcessingStatusPage";
import { ReviewWorkbenchPage } from "./pages/ReviewWorkbenchPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AdminPage } from "./pages/AdminPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "upload", Component: UploadPage },
      { path: "documents", Component: DocumentsPage },
      { path: "processing/:id", Component: ProcessingStatusPage },
      { path: "review/:id", Component: ReviewWorkbenchPage },
      { path: "history", Component: HistoryPage },
      { path: "admin", Component: AdminPage },
      { path: "analytics", Component: AnalyticsPage },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);