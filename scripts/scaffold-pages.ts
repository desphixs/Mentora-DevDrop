/*

For this stock pilot inventory management system, what pages do I need for robust inventory management? 
The page files .tsx that are needed, include it in this script, filders and folde with sub folders to 
organize files should be added in the tree dictionary, all files should be created in the pages folder, let's go

*/

/* 


*/

// scripts/scaffold-pages.mjs
// Usage:
//   node scripts/scaffold-pages.mjs
//   node scripts/scaffold-pages.mjs --base=src/pages --overwrite
//
// It creates the folders/files under the base directory (default: src/pages).
// Add --overwrite to replace existing files.
// scripts/scaffold-pages.ts

// scripts/scaffold-pages.ts


import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- cli args ----
const args = process.argv.slice(2);
const baseArg = args.find((a) => a.startsWith("--base="));
const overwrite = args.includes("--overwrite");

const BASE_DIR = baseArg ? baseArg.split("=")[1] : "src/pages";

// Make sure paths are normalized
const B = (...p) => path.join(BASE_DIR, ...p);

// ---- helpers ----
function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

function pascalFromFilename(filename) {
    // "mentor-detail.tsx" -> "MentorDetail"
    const base = filename.replace(/\.tsx$/i, "");
    return base
        .split(/[^a-zA-Z0-9]/g)
        .filter(Boolean)
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join("");
}

function importPath(fromFile, toFile) {
    let rel = path.relative(path.dirname(fromFile), toFile).replace(/\\/g, "/");
    rel = rel.replace(/\.tsx$/i, "");
    if (!rel.startsWith(".")) rel = "./" + rel;
    return rel;
}

// ---- component templates ----
function componentTemplatePlain(name) {
    return `import React from 'react';

const ${name}: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">${name}</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300/80">Scaffolded page. Build your UI here.</p>
    </div>
  );
};

export default ${name};
`;
}

function componentTemplateWithLayout(name, layoutImport, layoutName) {
    return `import React from 'react';
import ${layoutName} from '${layoutImport}';

const ${name}: React.FC = () => {
  return (
    <${layoutName}>
      <main className="min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#312E81] dark:text-[#E0E7FF]">${name}</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300/80">Scaffolded page. Build your UI here.</p>
        </div>
      </main>
    </${layoutName}>
  );
};

export default ${name};
`;
}

function writePage(filePath) {
    const compName = pascalFromFilename(path.basename(filePath));

    // decide layout wrapper
    const rel = path.relative(BASE_DIR, filePath).replace(/\\/g, "/");
    let content;

    if (rel.startsWith("app/mentor/")) {
        const layoutFile = B("app", "mentor", "MentorAppLayout.tsx");
        const importTo = importPath(filePath, layoutFile);
        content = componentTemplateWithLayout(compName, importTo, "MentorAppLayout");
    } else if (rel.startsWith("app/mentee/")) {
        const layoutFile = B("app", "mentee", "MenteeAppLayout.tsx");
        const importTo = importPath(filePath, layoutFile);
        content = componentTemplateWithLayout(compName, importTo, "MenteeAppLayout");
    } else if (rel.startsWith("app/")) {
        const layoutFile = B("app", "AppLayout.tsx");
        const importTo = importPath(filePath, layoutFile);
        content = componentTemplateWithLayout(compName, importTo, "AppLayout");
    } else {
        content = componentTemplatePlain(compName);
    }

    const existed = fs.existsSync(filePath);
    if (existed && !overwrite) {
        console.log(`SKIP (exists): ${filePath}`);
        return;
    }
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`${existed ? "UPDATED" : "CREATED"}: ${filePath}`);
}

// ---- tree definition (Mentora mentorship system) ----
// All paths are relative to BASE_DIR (default: src/pages)
const tree = {
    // ===== Shared App Shell (tenant/common space) =====
    app: ["AppLayout.tsx", "Dashboard.tsx", "Inbox.tsx", "Notifications.tsx"],

    // ===== Mentor Space (own layout) =====
    "app/mentor": ["MentorAppLayout.tsx", "Dashboard.tsx", "Calendar.tsx", "Availability.tsx", "Messages.tsx", "Reviews.tsx", "Profile.tsx", "KYC.tsx", "Settings.tsx"],

    // Sessions management (mentor)
    "app/mentor/sessions": ["SessionsList.tsx", "SessionDetail.tsx", "Requests.tsx", "Upcoming.tsx", "Past.tsx"],

    // Earnings & payouts (mentor)
    "app/mentor/finance": ["Earnings.tsx", "Payouts.tsx", "Taxes.tsx", "Invoices.tsx"],

    // Offers & products (mentor)
    "app/mentor/offers": ["OffersList.tsx", "OfferDetail.tsx", "NewOffer.tsx", "Packages.tsx", "GroupSessions.tsx", "Coupons.tsx"],

    // Manage mentees (mentor-side visibility)
    "app/mentor/mentees": ["MenteesList.tsx", "MenteeDetail.tsx"],

    // Settings subpages (mentor)
    "app/mentor/settings": ["Integrations.tsx", "Notifications.tsx", "Security.tsx"],

    // ===== Mentee Space (own layout) =====
    "app/mentee": ["MenteeAppLayout.tsx", "Dashboard.tsx", "Discover.tsx", "MentorDetail.tsx", "Messages.tsx", "Favorites.tsx", "Reviews.tsx", "Settings.tsx"],

    // Booking flow (mentee)
    "app/mentee/booking": ["SelectSlot.tsx", "Checkout.tsx", "Confirm.tsx"],

    // Sessions (mentee)
    "app/mentee/sessions": ["SessionsList.tsx", "SessionDetail.tsx"],

    // Billing (mentee)
    "app/mentee/billing": ["Invoices.tsx", "PaymentMethods.tsx", "Subscriptions.tsx", "Credits.tsx"],

    // Settings subpages (mentee)
    "app/mentee/settings": ["Profile.tsx", "Integrations.tsx", "Notifications.tsx", "Security.tsx"],

    // Support (mentee)
    "app/mentee/support": ["HelpCenter.tsx", "Tickets.tsx", "TicketDetail.tsx"],
};

// ---- execute ----
(function run() {
    console.log(`Scaffolding pages into: ${path.resolve(BASE_DIR)}${overwrite ? " (overwrite ON)" : ""}`);

    ensureDir(BASE_DIR);

    Object.entries(tree).forEach(([folder, files]) => {
        const dir = B(folder);
        ensureDir(dir);
        files.forEach((f) => writePage(path.join(dir, f)));
    });

    console.log("Done.");
})();
