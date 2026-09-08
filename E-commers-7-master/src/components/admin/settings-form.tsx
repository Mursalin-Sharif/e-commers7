"use client";

import { useActionState, useState } from "react";
import { saveSettingsAction, type AdminState } from "@/app/actions/admin";
import { ColorPickerField, ThemePreview } from "@/components/admin/color-picker-field";
import {
  AdminAlert,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminLabel,
} from "@/components/admin/ui/admin-ui";

type SettingsMap = Record<string, string>;

export function SettingsForm({ settings }: { settings: SettingsMap }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(saveSettingsAction, {});
  const [primaryColor, setPrimaryColor] = useState(settings.primary_color || "#E85D04");
  const [secondaryColor, setSecondaryColor] = useState(settings.secondary_color || "#1A1A2E");

  return (
    <AdminCard className="max-w-3xl">
      <form action={action} className="space-y-8">
        {state.success && <AdminAlert tone="success">{state.success}</AdminAlert>}
        {state.error && <AdminAlert tone="error">{state.error}</AdminAlert>}

        <section>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">General</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Site Name" name="site_name" defaultValue={settings.site_name} />
            <Field label="Tagline" name="tagline" defaultValue={settings.tagline} />
            <Field label="Phone" name="phone" defaultValue={settings.phone} />
            <Field label="Email" name="email" defaultValue={settings.email} />
            <div className="sm:col-span-2">
              <Field label="Address" name="address" defaultValue={settings.address} />
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Theme Colors</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorPickerField
              label="Primary Color"
              name="primary_color"
              defaultValue={settings.primary_color || "#E85D04"}
              onChange={setPrimaryColor}
            />
            <ColorPickerField
              label="Secondary Color"
              name="secondary_color"
              defaultValue={settings.secondary_color || "#1A1A2E"}
              onChange={setSecondaryColor}
            />
          </div>
          <div className="mt-4">
            <ThemePreview primary={primaryColor} secondary={secondaryColor} />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Primary = buttons & links. Secondary = footer & dark sections. Color code (hex) is saved with the swatch.
          </p>
        </section>

        <section>
          <h3 className="mb-4 text-sm font-semibold text-slate-900">Shipping (৳)</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Dhaka Inside" name="dhaka_inside" type="number" defaultValue={settings.dhaka_inside} />
            <Field label="Outside Dhaka" name="dhaka_outside" type="number" defaultValue={settings.dhaka_outside} />
          </div>
        </section>

        <div className="sticky bottom-0 -mx-5 border-t border-slate-100 bg-white/95 px-5 py-4 backdrop-blur-sm lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <AdminButton type="submit" disabled={pending} className="w-full lg:w-auto">
            {pending ? "Saving..." : "Save Settings"}
          </AdminButton>
        </div>
      </form>
    </AdminCard>
  );
}

function Field({ label, name, type = "text", defaultValue }: {
  label: string; name: string; type?: string; defaultValue?: string;
}) {
  return (
    <div>
      <AdminLabel>{label}</AdminLabel>
      <AdminInput name={name} type={type} defaultValue={defaultValue ?? ""} />
    </div>
  );
}
