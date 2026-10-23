import type { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;

/** Atomically increment a named counter and return the new value. */
export async function nextValue(tx: Tx, id: string) {
  const c = await tx.counter.upsert({
    where: { id },
    update: { value: { increment: 1 } },
    create: { id, value: 1 },
  });
  return c.value;
}

export async function nextMatricNo(tx: Tx) {
  const year = new Date().getFullYear();
  const n = await nextValue(tx, `matric-${year}`);
  return `MUI/${year}/${String(n).padStart(4, "0")}`;
}

export async function nextReceiptNo(tx: Tx) {
  const year = new Date().getFullYear();
  const n = await nextValue(tx, `receipt-${year}`);
  return `MUI-RCP-${year}-${String(n).padStart(6, "0")}`;
}

/** Membership number, e.g. MUI/IBR/2026/0007 — one sequence per segment per year. */
export async function nextMemberNo(tx: Tx, code: string) {
  const year = new Date().getFullYear();
  const n = await nextValue(tx, `member-${code}-${year}`);
  return `MUI/${code}/${year}/${String(n).padStart(4, "0")}`;
}

export async function nextDonationReceiptNo(tx: Tx) {
  const year = new Date().getFullYear();
  const n = await nextValue(tx, `donation-${year}`);
  return `MUI-DON-${year}-${String(n).padStart(6, "0")}`;
}
