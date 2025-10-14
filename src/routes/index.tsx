// src/routes/index.tsx
import React, { Suspense } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";

// src/routes/index.tsx
import PageFallback from "@/components/fallbacks/PageFallback";
import HowItWorks from "@/pages/marketing/HowItWorks";
import Faq from "@/pages/marketing/Faq";

const Fallback = ({ title }: { title?: string }) => (
  <PageFallback
    title={title ?? "Loading…"}
    hint="Fetching page module…"
    variant="app"
  />
);
const suspense = (node: React.ReactNode, title?: string) => (
  <Suspense fallback={<Fallback title={title} />}>{node}</Suspense>
);

// ===== Base / Public =====
const Index = React.lazy(() => import("@/pages/base/Index"));
const Notification = React.lazy(() => import("@/pages/base/Notification"));
const NotFoundPage = React.lazy(() => import("@/pages/error/NotFoundPage"));

const Login = React.lazy(() => import("@/pages/auth/Login"));
const Signup = React.lazy(() => import("@/pages/auth/Signup"));

const Landing = React.lazy(() => import("@/pages/marketing/Landing"));
const Features = React.lazy(() => import("@/pages/marketing/Features"));
const Pricing = React.lazy(() => import("@/pages/marketing/Pricing"));

const About = React.lazy(() => import("@/pages/company/About"));
const Contact = React.lazy(() => import("@/pages/company/Contact"));

const BlogIndex = React.lazy(() => import("@/pages/blog/BlogIndex"));
const BlogPost = React.lazy(() => import("@/pages/blog/BlogPost"));

const Terms = React.lazy(() => import("@/pages/policies/Terms"));
const Privacy = React.lazy(() => import("@/pages/policies/Privacy"));
const RefundPolicy = React.lazy(() => import("@/pages/policies/RefundPolicy"));
const CookiePolicy = React.lazy(() => import("@/pages/policies/CookiePolicy"));

const Changelog = React.lazy(() => import("@/pages/updates/Changelog"));
const Status = React.lazy(() => import("@/pages/updates/Status"));

// ===== Shared App (if you use it elsewhere) =====
const AppDashboard = React.lazy(() => import("@/pages/app/Dashboard"));
const AppActivity = React.lazy(() => import("@/pages/app/Activity"));

const AppInbox = React.lazy(() => import("@/pages/app/Inbox"));
const AppNotifications = React.lazy(() => import("@/pages/app/Notifications"));

// ===== Mentor (under /dashboard) =====

const M_Dashboard = React.lazy(() => import("@/pages/app/mentor/Dashboard"));

const M_Calendar = React.lazy(() => import("@/pages/app/mentor/Calendar"));
const M_Availability = React.lazy(
  () => import("@/pages/app/mentor/Availability")
);
const M_Messages = React.lazy(() => import("@/pages/app/mentor/Messages"));
const M_Reviews = React.lazy(() => import("@/pages/app/mentor/Reviews"));
const M_Profile = React.lazy(() => import("@/pages/app/mentor/Profile"));
const M_KYC = React.lazy(() => import("@/pages/app/mentor/KYC"));
const M_Settings = React.lazy(() => import("@/pages/app/mentor/Settings"));

// Mentor → Sessions
const M_SessionsList = React.lazy(
  () => import("@/pages/app/mentor/sessions/SessionsList")
);
const M_SessionDetail = React.lazy(
  () => import("@/pages/app/mentor/sessions/SessionDetail")
);
const M_SessionsRequests = React.lazy(
  () => import("@/pages/app/mentor/sessions/Requests")
);
const M_SessionsUpcoming = React.lazy(
  () => import("@/pages/app/mentor/sessions/Upcoming")
);
const M_SessionsPast = React.lazy(
  () => import("@/pages/app/mentor/sessions/Past")
);

// Mentor → Finance
const M_Earnings = React.lazy(
  () => import("@/pages/app/mentor/finance/Earnings")
);
const M_Payouts = React.lazy(
  () => import("@/pages/app/mentor/finance/Payouts")
);
const M_Taxes = React.lazy(() => import("@/pages/app/mentor/finance/Taxes"));
const M_Invoices = React.lazy(
  () => import("@/pages/app/mentor/finance/Invoices")
);

// Mentor → Offers
const M_OffersList = React.lazy(
  () => import("@/pages/app/mentor/offers/OffersList")
);
const M_OfferDetail = React.lazy(
  () => import("@/pages/app/mentor/offers/OfferDetail")
);
const M_NewOffer = React.lazy(
  () => import("@/pages/app/mentor/offers/NewOffer")
);
const M_Packages = React.lazy(
  () => import("@/pages/app/mentor/offers/Packages")
);
const M_GroupSessions = React.lazy(
  () => import("@/pages/app/mentor/offers/GroupSessions")
);
const M_Coupons = React.lazy(() => import("@/pages/app/mentor/offers/Coupons"));

// Mentor → Mentees management (mentor-side)
const M_MenteesList = React.lazy(
  () => import("@/pages/app/mentor/mentees/MenteesList")
);
const M_MenteeDetail = React.lazy(
  () => import("@/pages/app/mentor/mentees/MenteeDetail")
);

// Mentor → Settings subsections
const M_SettingsIntegrations = React.lazy(
  () => import("@/pages/app/mentor/settings/Integrations")
);
const M_SettingsNotifications = React.lazy(
  () => import("@/pages/app/mentor/settings/Notifications")
);
const M_SettingsSecurity = React.lazy(
  () => import("@/pages/app/mentor/settings/Security")
);

// ===== Mentee (under /mentee) =====
const ME_Dashboard = React.lazy(() => import("@/pages/app/mentee/Dashboard"));
const ME_Discover = React.lazy(() => import("@/pages/app/mentee/Discover"));
const ME_MentorDetail = React.lazy(
  () => import("@/pages/app/mentee/MentorDetail")
);
const ME_Messages = React.lazy(() => import("@/pages/app/mentee/Messages"));
const ME_Favorites = React.lazy(() => import("@/pages/app/mentee/Favorites"));
const ME_Reviews = React.lazy(() => import("@/pages/app/mentee/Reviews"));
const ME_Settings = React.lazy(() => import("@/pages/app/mentee/Settings"));

// Mentee → Booking
const ME_SelectSlot = React.lazy(
  () => import("@/pages/app/mentee/booking/SelectSlot")
);
const ME_Checkout = React.lazy(
  () => import("@/pages/app/mentee/booking/Checkout")
);
const ME_Confirm = React.lazy(
  () => import("@/pages/app/mentee/booking/Confirm")
);

// Mentee → Sessions
const ME_SessionsList = React.lazy(
  () => import("@/pages/app/mentee/sessions/SessionsList")
);
const ME_SessionDetail = React.lazy(
  () => import("@/pages/app/mentee/sessions/SessionDetail")
);

// Mentee → Billing
const ME_Invoices = React.lazy(
  () => import("@/pages/app/mentee/billing/Invoices")
);
const ME_PaymentMethods = React.lazy(
  () => import("@/pages/app/mentee/billing/PaymentMethods")
);
const ME_Subscriptions = React.lazy(
  () => import("@/pages/app/mentee/billing/Subscriptions")
);
const ME_Credits = React.lazy(
  () => import("@/pages/app/mentee/billing/Credits")
);

// Mentee → Settings subsections
const ME_Profile = React.lazy(
  () => import("@/pages/app/mentee/settings/Profile")
);
// const ME_Integrations = React.lazy(
//   () => import("@/pages/app/mentee/settings/Integrations")
// );
// const ME_Notifications = React.lazy(
//   () => import("@/pages/app/mentee/settings/Notifications")
// );
// const ME_Security = React.lazy(
//   () => import("@/pages/app/mentee/settings/Security")
// );

// Mentee → Support
const ME_HelpCenter = React.lazy(
  () => import("@/pages/app/mentee/support/HelpCenter")
);
const ME_Tickets = React.lazy(
  () => import("@/pages/app/mentee/support/Tickets")
);
const ME_TicketDetail = React.lazy(
  () => import("@/pages/app/mentee/support/TicketDetail")
);

export const routes: RouteObject[] = [
  // Public shell (index + public pages)
  {
    path: "/",
    errorElement: suspense(<NotFoundPage />),
    children: [
      { index: true, element: suspense(<Index />) },
      // marketing
      { path: "landing", element: suspense(<Landing />) },
      { path: "features", element: suspense(<Features />) },
      { path: "pricing", element: suspense(<Pricing />) },
      { path: "howitworks", element: suspense(<HowItWorks />) },
      { path: "faq", element: suspense(<Faq />) },
      // company
      { path: "about", element: suspense(<About />) },
      { path: "contact", element: suspense(<Contact />) },
      // blog
      { path: "blog", element: suspense(<BlogIndex />) },
      { path: "blog/:slug", element: suspense(<BlogPost />) },
      // policies
      { path: "terms", element: suspense(<Terms />) },
      { path: "privacy", element: suspense(<Privacy />) },
      { path: "refund-policy", element: suspense(<RefundPolicy />) },
      { path: "cookie-policy", element: suspense(<CookiePolicy />) },
      // updates
      { path: "changelog", element: suspense(<Changelog />) },
      { path: "status", element: suspense(<Status />) },
      // base utilities
      { path: "notification", element: suspense(<Notification />) },
    ],
  },

  // Auth
  { path: "/login", element: suspense(<Login />) },
  { path: "/signup", element: suspense(<Signup />) },

  // Optional shared app routes (if used)
  {
    path: "/app",
    children: [
      { index: true, element: suspense(<AppDashboard />) },
      { path: "activity", element: suspense(<AppActivity />) },

      { path: "inbox", element: suspense(<AppInbox />) },
      { path: "notifications", element: suspense(<AppNotifications />) },
    ],
  },

  // ===== Mentor app (primary: /dashboard) =====
  {
    path: "/dashboard",
    children: [
      { index: true, element: suspense(<M_Dashboard />) },

      { path: "calendar", element: suspense(<M_Calendar />) },
      { path: "availability", element: suspense(<M_Availability />) },
      { path: "messages", element: suspense(<M_Messages />) },
      { path: "reviews", element: suspense(<M_Reviews />) },
      { path: "profile", element: suspense(<M_Profile />) },
      { path: "kyc", element: suspense(<M_KYC />) },
      { path: "settings", element: suspense(<M_Settings />) },

      // Mentor → Sessions
      {
        path: "sessions",
        children: [
          { index: true, element: suspense(<M_SessionsList />) },
          { path: "requests", element: suspense(<M_SessionsRequests />) },
          { path: "upcoming", element: suspense(<M_SessionsUpcoming />) },
          { path: "past", element: suspense(<M_SessionsPast />) },
          { path: ":id", element: suspense(<M_SessionDetail />) },
        ],
      },

      // Mentor → Finance
      {
        path: "finance",
        children: [
          { index: true, element: suspense(<M_Earnings />) }, // index = Earnings
          { path: "earnings", element: suspense(<M_Earnings />) },
          { path: "payouts", element: suspense(<M_Payouts />) },
          { path: "taxes", element: suspense(<M_Taxes />) },
          { path: "invoices", element: suspense(<M_Invoices />) },
        ],
      },

      // Mentor → Offers
      {
        path: "offers",
        children: [
          { index: true, element: suspense(<M_OffersList />) },
          { path: "new", element: suspense(<M_NewOffer />) },
          { path: ":id", element: suspense(<M_OfferDetail />) },
          { path: "packages", element: suspense(<M_Packages />) },
          { path: "group-sessions", element: suspense(<M_GroupSessions />) },
          { path: "coupons", element: suspense(<M_Coupons />) },
        ],
      },

      // Mentor → Mentees
      {
        path: "mentees",
        children: [
          { index: true, element: suspense(<M_MenteesList />) },
          { path: ":id", element: suspense(<M_MenteeDetail />) },
        ],
      },

      // Mentor → Settings subsections
      {
        path: "settings",
        children: [
          {
            path: "integrations",
            element: suspense(<M_SettingsIntegrations />),
          },
          {
            path: "notifications",
            element: suspense(<M_SettingsNotifications />),
          },
          { path: "security", element: suspense(<M_SettingsSecurity />) },
        ],
      },
    ],
  },

  // ===== Mentee app (/mentee) =====
  {
    path: "/mentee",
    children: [
      { index: true, element: suspense(<ME_Dashboard />) },
      { path: "discover", element: suspense(<ME_Discover />) },
      { path: "mentor/:id", element: suspense(<ME_MentorDetail />) },
      { path: "messages", element: suspense(<ME_Messages />) },
      { path: "favorites", element: suspense(<ME_Favorites />) },
      { path: "reviews", element: suspense(<ME_Reviews />) },
      { path: "settings", element: suspense(<ME_Settings />) },

      // Mentee → Booking
      {
        path: "booking",
        children: [
          { index: true, element: suspense(<ME_SelectSlot />) },
          { path: "select-slot", element: suspense(<ME_SelectSlot />) },
          { path: "checkout", element: suspense(<ME_Checkout />) },
          { path: "confirm", element: suspense(<ME_Confirm />) },
        ],
      },

      // Mentee → Sessions
      {
        path: "sessions",
        children: [
          { index: true, element: suspense(<ME_SessionsList />) },
          { path: ":id", element: suspense(<ME_SessionDetail />) },
        ],
      },

      // Mentee → Billing
      {
        path: "billing",
        children: [
          { index: true, element: suspense(<ME_Invoices />) },
          { path: "invoices", element: suspense(<ME_Invoices />) },
          { path: "payment-methods", element: suspense(<ME_PaymentMethods />) },
          { path: "subscriptions", element: suspense(<ME_Subscriptions />) },
          { path: "credits", element: suspense(<ME_Credits />) },
        ],
      },

      // Mentee → Settings subpages
      {
        path: "settings",
        children: [
          { path: "profile", element: suspense(<ME_Profile />) },
            // { path: "integrations", element: suspense(<ME_Integrations />) },
            // { path: "notifications", element: suspense(<ME_Notifications />) },
            // { path: "security", element: suspense(<ME_Security />) },
        ],
      },

      // Mentee → Support
      {
        path: "support",
        children: [
          { index: true, element: suspense(<ME_HelpCenter />) },
          { path: "tickets", element: suspense(<ME_Tickets />) },
          { path: "tickets/:id", element: suspense(<ME_TicketDetail />) },
        ],
      },
    ],
  },

  // Catch-all
  { path: "*", element: suspense(<NotFoundPage />) },
];

export const router = createBrowserRouter(routes);
