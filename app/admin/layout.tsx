import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fullName, initials } from "@/lib/format";
import { PortalNav, type NavItem } from "@/components/PortalNav";
import { Motion } from "@/components/Motion";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const [pending, pendingMembers, unread] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT", status: "PENDING" } }),
    prisma.user.count({ where: { role: "MEMBER", status: "PENDING" } }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);
  const items: NavItem[] = [
    { href: "/admin", label: "Overview", icon: "overview" },
    { href: "/admin/students", label: "Students", icon: "students", badge: pending },
    { href: "/admin/members", label: "Members", icon: "students", badge: pendingMembers },
    { href: "/admin/payments", label: "Payments", icon: "payments" },
    { href: "/admin/donations", label: "Donations", icon: "donations" },
    { href: "/admin/fees", label: "Fees", icon: "fees" },
    { href: "/admin/announcements", label: "Announcements", icon: "announcements" },
    { href: "/admin/messages", label: "Messages", icon: "messages", badge: unread },
  ];
  return (
    <div className="min-h-screen bg-ivory">
      <Motion />
      <PortalNav items={items} user={{ name: fullName(admin), sub: "Registry administrator", photo: admin.photo, initials: initials(admin) }} />
      <div className="lg:pl-[272px] print:!pl-0">
        <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12 print:!p-0">{children}</main>
      </div>
    </div>
  );
}
