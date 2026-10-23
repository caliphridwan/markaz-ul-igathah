import "server-only";
import { prisma } from "./db";

/** Fee items that apply to a student, each marked with its successful payment (if any). */
export async function feesForUser(user: { id: string; programmeId: string | null }) {
  const [items, paid] = await Promise.all([
    prisma.feeItem.findMany({
      where: { active: true, OR: [{ programmeId: null }, ...(user.programmeId ? [{ programmeId: user.programmeId }] : [])] },
      orderBy: [{ activatesAccount: "desc" }, { amount: "asc" }],
    }),
    prisma.payment.findMany({ where: { userId: user.id, status: "SUCCESS" }, select: { id: true, feeItemId: true } }),
  ]);
  const paidMap = new Map(paid.filter((p) => p.feeItemId).map((p) => [p.feeItemId as string, p.id]));
  return items.map((f) => ({ ...f, paymentId: paidMap.get(f.id) ?? null }));
}
