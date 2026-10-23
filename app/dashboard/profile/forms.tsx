"use client";

import { useActionState, useState } from "react";
import { Camera } from "lucide-react";
import { changePasswordAction, updatePhotoAction, updateProfileAction } from "@/app/actions/student";
import { initialState } from "@/app/actions/types";
import { Field, FormMessage, SubmitButton } from "@/components/forms";

export function ProfileForm({ defaults }: { defaults: Record<string, string> }) {
  const [state, action] = useActionState(updateProfileAction, initialState);
  return (
    <form action={action} className="mt-6 grid gap-5 sm:grid-cols-2">
      <Field label="Phone number" name="phone" type="tel" required defaultValue={defaults.phone} state={state} />
      <Field label="Name in Arabic (optional)" name="arabicName" dir="rtl" lang="ar" defaultValue={defaults.arabicName} state={state} hint="Shown on your ID card" />
      <Field label="Date of birth" name="dateOfBirth" type="date" defaultValue={defaults.dateOfBirth} state={state} />
      <Field label="State of origin" name="stateOfOrigin" defaultValue={defaults.stateOfOrigin} state={state} />
      <Field label="Residential address" name="address" defaultValue={defaults.address} state={state} className="sm:col-span-2" />
      <Field label="Guardian's name" name="guardianName" defaultValue={defaults.guardianName} state={state} />
      <Field label="Guardian's phone" name="guardianPhone" type="tel" defaultValue={defaults.guardianPhone} state={state} />
      <div className="sm:col-span-2"><FormMessage state={state} /></div>
      <div className="sm:col-span-2"><SubmitButton pendingText="Saving…">Save changes</SubmitButton></div>
    </form>
  );
}

/** Resize to 300×360 (passport ratio) JPEG in the browser before upload. */
function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const W = 300, H = 360;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas unsupported"));
      const scale = Math.max(W / img.width, H / img.height);
      const w = img.width * scale, h = img.height * scale;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = URL.createObjectURL(file);
  });
}

export function PhotoForm({ current }: { current: string | null }) {
  const [state, action] = useActionState(updatePhotoAction, initialState);
  const [preview, setPreview] = useState<string | null>(current);
  const [err, setErr] = useState<string | null>(null);
  const [photo, setPhoto] = useState(""); // resized data URL, held in state so re-renders never wipe it

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr(null);
    e.target.value = ""; // allow re-picking the same file
    if (f.type && !f.type.startsWith("image/")) return setErr("Please choose an image file (JPG or PNG).");
    try {
      const data = await resizeImage(f);
      setPreview(data);
      setPhoto(data);
    } catch {
      setErr("Your browser couldn't read that image (iPhone HEIC photos often fail). Please use a JPG or PNG.");
    }
  }

  return (
    <form action={action} className="mt-5">
      <div className="flex items-center gap-5">
        <div className="arch h-[120px] w-[100px] shrink-0 overflow-hidden border-2 border-gold bg-parchment">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Passport preview" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-sand-dark"><Camera size={28} /></div>
          )}
        </div>
        <div className="space-y-2">
          <label className="btn-ghost btn-sm cursor-pointer">
            <Camera size={15} /> Choose photo
            <input type="file" accept="image/*" onChange={onPick} className="sr-only" />
          </label>
          <input type="hidden" name="photo" value={photo} readOnly />
          {photo ? (
            <SubmitButton className="btn-primary btn-sm block" pendingText="Uploading…">Save photo</SubmitButton>
          ) : (
            <p className="text-[12.5px] text-ink-muted">Choose a photo, then save.</p>
          )}
        </div>
      </div>
      {err && <p className="mt-3 text-[13px] text-red-600">{err}</p>}
      <div className="mt-3"><FormMessage state={state} /></div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState(changePasswordAction, initialState);
  return (
    <form action={action} className="mt-6 grid gap-5 sm:grid-cols-3">
      <Field label="Current password" name="current" type="password" required autoComplete="current-password" state={state} />
      <Field label="New password" name="password" type="password" required autoComplete="new-password" state={state} />
      <Field label="Confirm new password" name="confirm" type="password" required autoComplete="new-password" state={state} />
      <div className="sm:col-span-3"><FormMessage state={state} /></div>
      <div className="sm:col-span-3"><SubmitButton pendingText="Updating…">Update password</SubmitButton></div>
    </form>
  );
}
