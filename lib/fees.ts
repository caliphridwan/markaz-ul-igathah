import "server-only";
import type { Prisma, Segment } from "@prisma/client";
import { prisma } from "./db";

type FeeUser = { id: string; role: string; programmeId: string | null; segment: string | null };

/** Where-clause for fee items that apply to this user (students by programme, members by segment). */
export function feeScope(user: FeeUser): Prisma.FeeItemWhereInput {
  if (user.role === "MEMBER") {
    return { active: true, audience: "MEMBER", OR: [{ segment: null }, ...(user.segment ? [{ segment: user.segment as Segment }] : [])] };
  }
  return { active: true, audience: "STUDENT", OR: [{ programmeId: null }, ...(user.programmeId ? [{ programmeId: user.programmeId }] : [])] };
}

/** Fee items that apply to a user, each marked with its successful payment (if any). */
export async function feesForUser(user: FeeUser) {
  const [items, paid] = await Promise.all([
    prisma.feeItem.findMany({
      where: feeScope(user),
      orderBy: [{ activatesAccount: "desc" }, { amount: "asc" }],
    }),
    prisma.payment.findMany({ where: { userId: user.id, status: "SUCCESS" }, select: { id: true, feeItemId: true } }),
  ]);
  const paidMap = new Map(paid.filter((p) => p.feeItemId).map((p) => [p.feeItemId as string, p.id]));
  return items.map((f) => ({ ...f, paymentId: paidMap.get(f.id) ?? null }));
}
