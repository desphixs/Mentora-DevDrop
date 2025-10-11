perfect—here’s a tight, copy-pasteable checklist for **every single page** you scaffolded. Use it to prompt your AI/codegen so it knows exactly what to include. I kept it consistent: **Purpose → UI → Data/State → API → Actions → Edge cases**. First, a tiny baseline you can assume for all pages, then specifics per component.

---

# Baseline (assume on every page)

-   Purpose: what this page is for in one line
-   UI: page title, breadcrumbs, primary CTA, secondary CTA, table/form/chart as needed
-   Data/State: loading/empty/error states, pagination, filters, local form state
-   API: list GET/POST/PATCH/DELETE endpoints + params
-   Actions: create/update/delete/export/navigate
-   Edge: no data, permission denied, network fail, long lists (virtualize), slow actions (optimistic UI/toasts)

---

# Marketing

### marketing/Landing.tsx

-   Purpose: hero + social proof + CTA
-   UI: hero (headline, sub), product shots, features grid (3–6), testimonials, logos, CTA section, FAQ, footer
-   Data/State: A/B flag for headline, pricing highlight toggle
-   API: GET `/public/metrics` (users, reviews)
-   Actions: “Get Started”, “Request Demo”
-   Edge: low-bandwidth images (responsive), dark mode

### marketing/Features.tsx

-   UI: feature cards with icons, deep dives, comparison table, CTA
-   API: GET `/public/features`
-   Actions: “Try it”, “View Pricing”

### marketing/Pricing.tsx

-   UI: monthly/annual toggle, tier cards, feature matrix, FAQ, CTA
-   State: selected billing cycle, coupon input
-   API: GET `/public/plans`, POST `/billing/checkout-session`
-   Actions: “Start trial”, “Contact sales”
-   Edge: currency formatting, region-based pricing

---

# Company (About/Contact)

### company/About.tsx

-   UI: mission, timeline, team, investors/press, CTA
-   API: GET `/public/about`

### company/Contact.tsx

-   UI: contact form (name, email, message, topic), socials, map
-   State: form validation, success state
-   API: POST `/public/contact`
-   Edge: spam prevention (honeypot)

---

# Blog

### blog/BlogIndex.tsx

-   UI: search, tag filter, card grid, pagination
-   API: GET `/public/blog?search=&tag=&page=`
-   Actions: open post

### blog/BlogPost.tsx

-   UI: title, byline, TOC, content, share, next/prev, comments (optional)
-   API: GET `/public/blog/:slug`
-   Actions: copy link, subscribe
-   Edge: 404 if slug missing

---

# Updates

### updates/Changelog.tsx

-   UI: releases list (version, date, tags), filter by tag
-   API: GET `/public/changelog`
-   Actions: subscribe to updates

### updates/Status.tsx

-   UI: current status banner, component uptime, incident history
-   API: GET `/public/status`
-   Edge: cache aggressively

---

# Policies

### policies/Terms.tsx / Privacy.tsx / RefundPolicy.tsx / CookiePolicy.tsx

-   UI: legal doc with sidebar nav + last updated date
-   Actions: print/download PDF
-   API: GET `/public/policies/:type`

---

# Admin (Superadmin)

### admin/AdminLayout.tsx

-   UI: sidebar (Dashboard, Landlords, Agencies, Plans, Usage, Payouts), org switcher, search
-   State: active route, role gate
-   Actions: sign out, switch theme

### admin/Dashboard.tsx

-   UI: KPIs (orgs, active users, MRR, ARPU), charts (growth, usage), recent signups table
-   API: GET `/admin/metrics`, `/admin/recent-signups`

### admin/LandlordsList.tsx

-   UI: table (Name, Email, Properties, Status, CreatedAt), filters (status/date), pagination, bulk actions
-   API: GET `/admin/landlords`
-   Actions: view, disable, impersonate, export CSV

### admin/LandlordDetail.tsx

-   UI: profile header, stats, tabs (Overview, Billing, Activity, Properties)
-   API: GET `/admin/landlords/:id`, GET `/admin/landlords/:id/properties`
-   Actions: reset password, toggle status, adjust plan

### admin/AgenciesList.tsx

-   Same as LandlordsList but for agencies
-   Columns: Name, Team Size, Managers, Status, CreatedAt
-   API: GET `/admin/agencies`

### admin/AgencyDetail.tsx

-   Tabs: Overview, Members, Billing, Activity, Properties
-   API: GET `/admin/agencies/:id`, `/admin/agencies/:id/members`
-   Actions: invite member, revoke

### admin/Plans.tsx

-   UI: plan cards + editable features, price inputs, region toggles
-   API: GET/PUT `/admin/plans`
-   Actions: create/clone/deprecate plan

### admin/Usage.tsx

-   UI: usage charts, top orgs by consumption, filters by range
-   API: GET `/admin/usage?range=`
-   Actions: export CSV

### admin/Payouts.tsx

-   UI: table (Org, Period, Amount, Status), balance summary
-   API: GET `/admin/payouts`
-   Actions: trigger payout, mark paid, export

---

# Owner (Landlord)

### owner/OwnerLayout.tsx

-   UI: sidebar (Dashboard, Properties, Units, Leases, Tenants, Invoices, Payments, Tickets, Vendors, Reports, Settings)
-   State: org picker, role guard

### owner/Dashboard.tsx

-   KPIs: MRR, Occupancy, Overdue Rent, Open Tickets, Upcoming Renewals
-   Charts: Occupancy trend, Arrears trend
-   API: GET `/owner/metrics`, `/owner/renewals?range=`

### owner/PropertiesList.tsx

-   Table: Name, Units, Occupancy, City, CreatedAt, Actions
-   Filters: city, occupancy range
-   API: GET `/owner/properties`
-   Actions: create/edit/archive, export

### owner/PropertyDetail.tsx

-   Header: photos, address, tags
-   Tabs: Overview, Units, Documents, Activity
-   API: GET `/owner/properties/:id`, `/owner/properties/:id/units`

### owner/UnitsList.tsx

-   Table: Unit #, Beds/Baths, Rent, Status (Vacant/Occupied), Tenant
-   API: GET `/owner/units`

### owner/UnitDetail.tsx

-   Card: unit info, current lease, rent, meter, notes
-   API: GET `/owner/units/:id`

### owner/LeasesList.tsx

-   Table: Lease #, Unit, Tenant, Start, End, Status, Balance
-   Filters: status, end within N days
-   API: GET `/owner/leases`

### owner/LeaseDetail.tsx

-   Sections: lease terms, rent schedule, deposits, addendums, renew/end buttons
-   API: GET `/owner/leases/:id`
-   Actions: renew, terminate, generate PDF

### owner/TenantsList.tsx

-   Table: Name, Email, Phone, Unit, Balance, Tickets
-   API: GET `/owner/tenants`

### owner/TenantDetail.tsx

-   Profile, ledger, documents, tickets
-   API: GET `/owner/tenants/:id`

### owner/InvoicesList.tsx

-   Table: #, Period, Tenant, Amount, Status, DueDate
-   Filters: status/date
-   API: GET `/owner/invoices`

### owner/InvoiceDetail.tsx

-   Invoice header, line items, payment timeline, download PDF
-   API: GET `/owner/invoices/:id`
-   Actions: send reminder, add payment

### owner/PaymentsList.tsx

-   Table: #, Method, Amount, Date, Tenant, Status
-   API: GET `/owner/payments`

### owner/PaymentDetail.tsx

-   Receipt view, gateway ref, refunds
-   API: GET `/owner/payments/:id`
-   Actions: refund

### owner/TicketsList.tsx

-   Table: #, Property/Unit, Category, Priority, Status, Assignee, UpdatedAt
-   Filters: status/priority/property
-   API: GET `/owner/tickets`

### owner/TicketDetail.tsx

-   Timeline, comments, attachments, SLA badge, assign vendor
-   API: GET `/owner/tickets/:id`, POST comment
-   Actions: change status, add work order

### owner/VendorsList.tsx

-   Table: Name, Services, Rating, Jobs, Status
-   API: GET `/owner/vendors`

### owner/VendorDetail.tsx

-   Profile, insurance, service areas, past work orders
-   API: GET `/owner/vendors/:id`

### owner/Reports.tsx

-   Builder: report type (Revenue, Occupancy, Overdue), range, group by
-   API: GET `/owner/reports?type=&range=`
-   Actions: export CSV/PDF, schedule

### owner/Settings.tsx

-   Sections: Profile, Bank/Payouts, Notifications, Organization, Branding
-   API: GET/PUT `/owner/settings`, `/owner/bank`

---

# Manager (Agency)

### manager/ManagerLayout.tsx

-   Sidebar: Dashboard, Properties, Units, Leases, Tenants, Work Orders, Vendors, Calendar, Messaging, Reports, Settings

### manager/Dashboard.tsx

-   KPIs: Active WorkOrders, Avg SLA, Units Managed, Overdue Tickets
-   Charts: SLA trend, workload by assignee
-   API: GET `/manager/metrics`

### manager/PropertiesList.tsx / PropertyDetail.tsx

-   Same as Owner but scoped to agency portfolio
-   API: `/manager/properties`, `/manager/properties/:id`

### manager/UnitsList.tsx / UnitDetail.tsx

-   API: `/manager/units`, `/manager/units/:id`

### manager/LeasesList.tsx / LeaseDetail.tsx

-   API: `/manager/leases`, `/manager/leases/:id`

### manager/TenantsList.tsx / TenantDetail.tsx

-   API: `/manager/tenants`, `/manager/tenants/:id`

### manager/WorkOrdersList.tsx

-   Table: #, Ticket, Vendor, Priority, Status, ScheduledFor, Cost
-   Filters: status/assignee/date
-   API: GET `/manager/work-orders`
-   Actions: assign vendor, schedule, close

### manager/WorkOrderDetail.tsx

-   Timeline, labor/materials, approvals, final invoice
-   API: GET `/manager/work-orders/:id`

### manager/VendorsList.tsx / VendorDetail.tsx

-   API: `/manager/vendors`, `/manager/vendors/:id`

### manager/Calendar.tsx

-   Views: month/week/day, items: inspections, move-ins, vendor visits
-   API: GET `/manager/calendar?range=`
-   Actions: create event, drag-reschedule

### manager/Messaging.tsx

-   UI: inbox list + thread pane (WhatsApp/Email), templates sidebar
-   API: GET `/manager/messages?folder=`, GET `/manager/threads/:id`, POST send
-   Actions: reply, template insert, attach files

### manager/Reports.tsx / Settings.tsx

-   Similar to Owner equivalents but agency-wide
-   APIs: `/manager/reports`, `/manager/settings`

---

# Tenant

### tenant/TenantLayout.tsx

-   Sidebar: Dashboard, My Lease, Pay Rent, Payments, Tickets, Documents, Profile

### tenant/Dashboard.tsx

-   Cards: Next rent due, Balance, Open tickets, Announcements
-   API: GET `/tenant/metrics`

### tenant/MyLease.tsx

-   Lease summary, terms, rent schedule, landlord/manager info
-   API: GET `/tenant/lease`

### tenant/PayRent.tsx

-   UI: amount due, methods, Pay button, saved cards/accounts
-   API: GET `/tenant/invoice/current`, POST `/tenant/payments`
-   Edge: duplicate payment guard, 3DS flow

### tenant/PaymentHistory.tsx

-   Table: #, Amount, Method, Date, Status; filters
-   API: GET `/tenant/payments`

### tenant/TicketsList.tsx / TicketDetail.tsx

-   Create ticket (category, priority, photos), view status and thread
-   APIs: `/tenant/tickets`, `/tenant/tickets/:id`

### tenant/Documents.tsx

-   List: lease PDF, receipts, policy docs; download
-   API: GET `/tenant/documents`

### tenant/Profile.tsx

-   Fields: name, phone, emergency contact, notification prefs
-   API: GET/PUT `/tenant/profile`

---

# Vendor

### vendor/VendorLayout.tsx

-   Tabs: Dashboard, Work Orders, Invoices

### vendor/Dashboard.tsx

-   KPIs: Open WOs, Upcoming visits, Avg rating
-   API: GET `/vendor/metrics`

### vendor/WorkOrdersList.tsx / WorkOrderDetail.tsx

-   List filters by status/date; detail shows tasks, photos, client info
-   APIs: `/vendor/work-orders`, `/vendor/work-orders/:id`
-   Actions: accept/decline, upload proof, mark complete

### vendor/Invoices.tsx

-   Table: #, WO, Amount, Status, PaidAt; create/send invoice
-   APIs: GET `/vendor/invoices`, POST `/vendor/invoices`

---

## Bonus: prompt template you can reuse

Copy this and fill in per page:

```
Generate a React + TypeScript page for <PAGE_NAME> located at src/pages/<PATH>/<FILE>.tsx.

Purpose:
- <what this page does in one line>

UI requirements:
- <sections/components (tables/forms/charts/cards)>
- Include: title, breadcrumbs, primary CTA "<Label>"

Data & State:
- Loading, empty, error states
- Local state: <list>
- Filters/pagination: <list>

API:
- GET <endpoint>?<params> → list
- GET <endpoint/:id> → detail
- POST <endpoint> → create
- PATCH <endpoint/:id> → update
- DELETE <endpoint/:id> → delete

Actions:
- <create/edit/delete/export/navigate>
- Toasts for success/error, confirm modals for destructive actions

Edge cases:
- <no data, permission denied, network fail, etc.>
- Accessibility: focus traps, keyboard nav
```

If you want, I can turn this entire spec into **JSON blueprints** the script can read to auto-build tables/forms (columns, fields, validators, endpoints) and drop ready-made pages with CRUD and shadcn modals.
