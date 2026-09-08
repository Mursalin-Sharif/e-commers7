"use client";

import { useState } from "react";
import { AdminInput, AdminLabel } from "@/components/admin/ui/admin-ui";
import { cn } from "@/lib/utils";

function normalizeHex(value: string) {
  const cleaned = value.trim().replace(/[^#0-9a-fA-F]/g, "");
  if (!cleaned) return "";
  const hex = cleaned.startsWith("#") ? cleaned : `#${cleaned}`;
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex.toUpperCase();
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    const [, r, g, b] = hex;
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return hex.toUpperCase();
}

type ColorPickerFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export function ColorPickerField({ label, name, defaultValue = "#E85D04", onChange }: ColorPickerFieldProps) {
  const initial = normalizeHex(defaultValue || "#E85D04") || "#E85D04";
  const [color, setColor] = useState(initial);

  const updateColor = (value: string) => {
    const next = normalizeHex(value) || initial;
    setColor(next);
    onChange?.(next);
  };

  const pickerValue = /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#E85D04";

  return (
    <div>
      <AdminLabel>{label}</AdminLabel>
      <div className="mt-1 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-3">
          <div
            className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 shadow-inner"
            style={{ backgroundColor: pickerValue }}
            aria-hidden
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={pickerValue}
                onChange={(e) => updateColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                aria-label={`${label} picker`}
              />
              <AdminInput
                name={name}
                value={color}
                onChange={(e) => updateColor(e.target.value)}
                placeholder="#E85D04"
                className="font-mono uppercase"
              />
            </div>
            <p className="text-xs text-slate-500">
              Color code: <span className="font-mono font-semibold text-slate-700">{color}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ThemePreview({ primary, secondary }: { primary: string; secondary: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Live Preview</p>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-24 text-xs text-slate-500">Primary</span>
          <div className="h-8 flex-1 rounded-lg" style={{ backgroundColor: primary }} />
          <code className="text-xs font-mono text-slate-600">{primary}</code>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-24 text-xs text-slate-500">Secondary</span>
          <div className="h-8 flex-1 rounded-lg" style={{ backgroundColor: secondary }} />
          <code className="text-xs font-mono text-slate-600">{secondary}</code>
        </div>
        <div className="rounded-lg p-3 text-sm text-white" style={{ backgroundColor: secondary }}>
          Footer / Header preview
          <button type="button" className={cn("ml-3 rounded-md px-3 py-1 text-xs font-semibold text-white")} style={{ backgroundColor: primary }}>
            Button
          </button>
        </div>
      </div>
    </div>
  );
}
