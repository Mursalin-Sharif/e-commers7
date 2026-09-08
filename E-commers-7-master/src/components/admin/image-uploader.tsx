"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import type { UploadFolder } from "@/lib/upload";
import { resolveImageUrl } from "@/lib/product-images";
import { AdminInput, AdminLabel } from "@/components/admin/ui/admin-ui";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  name?: string;
  folder: UploadFolder;
  label?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (url: string) => void;
  required?: boolean;
  hint?: string;
};

async function uploadFile(file: File, folder: UploadFolder): Promise<string> {
  const body = new FormData();
  body.set("file", file);
  body.set("folder", folder);

  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok) throw new Error(data.error || "Upload failed");
  if (!data.url) throw new Error("Upload failed");
  return data.url;
}

export function ImageUploader({
  name,
  folder,
  label = "Image",
  defaultValue = "",
  value,
  onChange,
  required,
  hint,
}: ImageUploaderProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = controlled ? value : internal;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const setUrl = useCallback(
    (url: string) => {
      const normalized = resolveImageUrl(url) || url.trim();
      if (!controlled) setInternal(normalized);
      onChange?.(normalized);
      setError("");
    },
    [controlled, onChange],
  );

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadFile(file, folder);
      setUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <AdminLabel required={required}>{label}</AdminLabel>}

      <div
        className={cn(
          "relative overflow-hidden rounded-xl border-2 border-dashed transition",
          dragOver ? "border-indigo-400 bg-indigo-50/50" : "border-slate-200 bg-slate-50/50",
          uploading && "pointer-events-none opacity-70",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
      >
        {current ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current}
              alt="Preview"
              className="h-44 w-full object-cover"
              onError={() => setError("Image failed to load — check URL or re-upload")}
            />
            <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/50 to-transparent p-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-800 shadow hover:bg-white"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => setUrl("")}
                className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 px-4 py-10 text-center"
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            ) : (
              <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200">
                <ImagePlus className="h-6 w-6 text-slate-500" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-700">
                {uploading ? "Uploading..." : "Click or drag image here"}
              </p>
              <p className="mt-1 text-xs text-slate-400">JPG, PNG, WebP, GIF · Max 5MB</p>
            </div>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {name && <input type="hidden" name={name} value={current} required={required && !current} />}

      <div className="mt-2 flex items-center gap-2">
        <Upload className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <AdminInput
          value={current}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Or paste image URL"
          className="h-9 text-xs"
        />
      </div>

      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

type MultiImageUploaderProps = {
  name: string;
  folder: UploadFolder;
  label?: string;
  defaultValue?: string[];
  required?: boolean;
};

export function MultiImageUploader({
  name,
  folder,
  label = "Images",
  defaultValue = [],
  required,
}: MultiImageUploaderProps) {
  const [images, setImages] = useState<string[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadFile(file, folder));
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <AdminLabel required={required}>{label}</AdminLabel>
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((src, index) => (
          <div key={`${src}-${index}`} className="group relative overflow-hidden rounded-lg border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="aspect-square w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute right-1 top-1 rounded-md bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50/40"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <ImagePlus className="h-5 w-5" />
              <span className="text-[11px] font-medium">Add</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => void addFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-slate-400">Upload multiple product images. First image is the main photo.</p>
    </div>
  );
}
