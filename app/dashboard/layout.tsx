import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { fullName, initials } from "@/lib/format";
import { PortalNav, type NavItem } from "@/components/PortalNav";

export const metadata: Metadata = { title: "Student portal", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const items = [
    { href: "/dashboard", label: "Overview", icon: "overview" },
    { href: "/dashboard/payments", label: "Payments", icon: "payments" },
    { href: "/dashboard/receipts", label: "Receipts", icon: "receipts" },
    { href: "/dashboard/id-card", label: "ID card", icon: "idcard" },
    { href: "/dashboard/alumni", label: "Alumni", icon: "alumni" },
    { href: "/dashboard/profile", label: "Profile", icon: "profile" },
    { href: "/donate", label: "Donate", icon: "donations" },
  ].filter((i) => !(user.role === "MEMBER" && i.href === "/dashboard/alumni")) as NavItem[];
  return (
    <div className="min-h-screen bg-ivory">
      <PortalNav items={items} user={{ name: fullName(user), sub: user.matricNo ?? user.email, photo: user.photo, initials: initials(user) }} />
      <div className="lg:pl-[272px] print:!pl-0">
        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12 print:!p-0">{children}</main>
      </div>
    </div>
  );
}
