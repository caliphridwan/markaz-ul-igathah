import { requireUser } from "@/lib/auth";
import { date, fullName } from "@/lib/format";
import { PortalHeader } from "@/components/PortalNav";
import { StatusBadge } from "@/components/StatusBadge";
import { PasswordForm, PhotoForm, ProfileForm } from "./forms";

export default async function ProfilePage() {
  const user = await requireUser();
  const dob = user.dateOfBirth ? user.dateOfBirth.toISOString().slice(0, 10) : "";
  return (
    <>
      <PortalHeader title="Profile" arabic="الملف الشخصي" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-1">
          <section className="card p-6">
            <h2 className="text-2xl">Passport photo</h2>
            <p className="mt-1 text-[13.5px] text-ink-muted">A clear, front-facing photo on a plain background. It appears on your ID card.</p>
            <PhotoForm current={user.photo} />
          </section>
          <section className="card p-6">
            <h2 className="text-2xl">Registry record</h2>
            <dl className="mt-4 space-y-3 text-[14px]">
              {[
                ["Name", fullName(user)],
                ["Matric no.", user.matricNo ?? "—"],
                ["Email", user.email],
                ["Programme", user.programme?.title ?? "—"],
                ["Session", user.session ?? "—"],
                ["Registered", date(user.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-sand/70 pb-2.5">
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Status</dt>
                <dd><StatusBadge status={user.status} /></dd>
              </div>
            </dl>
            <p className="mt-4 text-[12.5px] text-ink-muted">To correct your name, email or programme, please contact the Registry.</p>
          </section>
        </div>
        <div className="space-y-8 lg:col-span-2">
          <section className="card p-6 sm:p-8">
            <h2 className="text-2xl">Personal & guardian details</h2>
            <ProfileForm
              defaults={{
                phone: user.phone,
                arabicName: user.arabicName ?? "",
                dateOfBirth: dob,
                stateOfOrigin: user.stateOfOrigin ?? "",
                address: user.address ?? "",
                guardianName: user.guardianName ?? "",
                guardianPhone: user.guardianPhone ?? "",
              }}
            />
          </section>
          <section className="card p-6 sm:p-8">
            <h2 className="text-2xl">Change password</h2>
            <PasswordForm />
          </section>
        </div>
      </div>
    </>
  );
}
