import { prisma } from "@/lib/db";
import { money } from "@/lib/format";
import { site } from "@/lib/site";
import { toggleFeeAction } from "@/app/actions/admin";
import { PortalHeader } from "@/components/PortalNav";
import { FeeForm } from "./FeeForm";

export default async function AdminFees() {
  const [fees, programmes] = await Promise.all([
    prisma.feeItem.findMany({ include: { programme: true, _count: { select: { payments: { where: { status: "SUCCESS" } } } } }, orderBy: [{ session: "desc" }, { createdAt: "asc" }] }),
    prisma.programme.findMany({ orderBy: { order: "asc" } }),
  ]);
  return (
    <>
      <PortalHeader title="Fees" arabic="الرسوم" />
      <div className="grid gap-8 lg:grid-cols-3">
        <section className="card h-fit p-6 lg:order-2">
          <h2 className="text-2xl">New fee item</h2>
          <FeeForm programmes={programmes.map((p) => ({ value: p.id, label: p.title }))} session={site.currentSession} />
        </section>
        <div className="table-wrap lg:col-span-2">
          <table className="table">
            <thead><tr><th>Item</th><th>Applies to</th><th>Amount</th><th>Paid</th><th>State</th></tr></thead>
            <tbody>
              {fees.map((f) => (
                <tr key={f.id} className={f.active ? "" : "opacity-55"}>
                  <td>
                    <p className="font-semibold">{f.name}</p>
                    <p className="text-[12.5px] text-ink-muted">{f.session}{f.activatesAccount && " · activates account"}</p>
                  </td>
                  <td>{f.programme?.title ?? "All students"}</td>
                  <td className="whitespace-nowrap font-semibold">{money(f.amount)}</td>
                  <td>{f._count.payments}</td>
                  <td>
                    <form action={toggleFeeAction}>
                      <input type="hidden" name="id" value={f.id} />
                      <button className={`badge ${f.active ? "bg-jade/10 text-jade ring-jade/30" : "bg-sand text-ink-muted ring-sand-dark"}`}>
                        {f.active ? "active" : "inactive"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {fees.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-ink-muted">No fee items yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
