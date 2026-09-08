"use client";

import { useActionState, useCallback, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  Eye,
  EyeOff,
  GripVertical,
  Layers,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  createSection,
  SECTION_LABELS,
  SECTION_TYPES,
  type LandingSection,
  type SectionType,
  str,
} from "@/lib/landing-pages";
import {
  publishLandingPageAction,
  saveLandingPageMetaAction,
  saveLandingPageSectionsAction,
  setHomepageAction,
  unpublishLandingPageAction,
} from "@/app/actions/landing-pages";
import { AdminBadge, AdminButton, AdminInput, AdminTextarea } from "@/components/admin/ui/admin-ui";
import { ImageUploader } from "@/components/admin/image-uploader";
import { cn } from "@/lib/utils";

type PageData = {
  id: string;
  title: string;
  slug: string;
  status: string;
  isHomepage: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  featuredImage: string | null;
  sections: LandingSection[];
};

export function LandingPageBuilder({ page }: { page: PageData }) {
  const [sections, setSections] = useState<LandingSection[]>(page.sections);
  const [selectedId, setSelectedId] = useState<string | null>(sections[0]?.id ?? null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [saveState, saveAction, savePending] = useActionState(saveLandingPageSectionsAction, {});
  const [metaState, metaAction, metaPending] = useActionState(saveLandingPageMetaAction, {});
  const [publishing, startPublish] = useTransition();

  const selected = sections.find((s) => s.id === selectedId) ?? null;

  const updateSection = useCallback((id: string, patch: Partial<LandingSection>) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const updateContent = useCallback((id: string, key: string, value: unknown) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, content: { ...s.content, [key]: value } } : s,
      ),
    );
  }, []);

  const moveSection = (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= sections.length) return;
    setSections((prev) => {
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  };

  const removeSection = (id: string) => {
    if (!confirm("Remove this section?")) return;
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const addSection = (type: SectionType) => {
    const section = createSection(type);
    setSections((prev) => [...prev, section]);
    setSelectedId(section.id);
    setShowAddMenu(false);
  };

  const handleSave = () => {
    const fd = new FormData();
    fd.set("id", page.id);
    fd.set("sections", JSON.stringify(sections));
    saveAction(fd);
  };

  const previewUrl = page.status === "published" ? `/page/${page.slug}` : `/page/${page.slug}?preview=1`;

  return (
    <div className="flex h-screen flex-col bg-[#eef2f7]">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200/90 bg-white/90 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/landing-pages"
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Pages
          </Link>
          <span className="text-slate-300">|</span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{page.title}</p>
            <p className="text-xs text-slate-400">/page/{page.slug}</p>
          </div>
          <AdminBadge tone={page.status === "published" ? "success" : "warning"}>
            {page.status}
          </AdminBadge>
          {page.isHomepage && <AdminBadge tone="info">Homepage</AdminBadge>}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <Eye className="h-4 w-4" />
            Preview
          </a>
          <AdminButton variant="secondary" onClick={handleSave} disabled={savePending}>
            <Save className="h-4 w-4" />
            {savePending ? "Saving..." : "Save"}
          </AdminButton>
          {page.status === "published" ? (
            <form action={unpublishLandingPageAction}>
              <input type="hidden" name="id" value={page.id} />
              <AdminButton variant="secondary" type="submit" disabled={publishing}>
                Unpublish
              </AdminButton>
            </form>
          ) : (
            <form action={publishLandingPageAction} onSubmit={() => startPublish(() => {})}>
              <input type="hidden" name="id" value={page.id} />
              <input type="hidden" name="sections" value={JSON.stringify(sections)} />
              <AdminButton type="submit" disabled={publishing}>
                Publish
              </AdminButton>
            </form>
          )}
          {!page.isHomepage && page.status === "published" && (
            <form action={setHomepageAction}>
              <input type="hidden" name="id" value={page.id} />
              <AdminButton variant="secondary" type="submit">
                Set as Homepage
              </AdminButton>
            </form>
          )}
        </div>
      </header>

      {(saveState.success || saveState.error || metaState.success || metaState.error) && (
        <div
          className={cn(
            "px-4 py-2 text-center text-sm",
            saveState.error || metaState.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700",
          )}
        >
          {saveState.error || metaState.error || saveState.success || metaState.success}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Left: sections */}
        <aside className="flex w-64 shrink-0 flex-col border-r border-white/5 bg-[#0b1220] text-slate-300">
          <div className="flex items-center justify-between border-b border-white/5 px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Layers className="h-3.5 w-3.5" />
              Sections
            </span>
            <span className="text-xs text-slate-400">{sections.length}</span>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto p-2">
            {sections.length === 0 && (
              <p className="p-3 text-center text-xs text-slate-400">No sections yet. Add one below.</p>
            )}
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={cn(
                  "group flex items-center gap-1 rounded-lg border px-2 py-1.5 transition",
                  selectedId === section.id
                    ? "border-indigo-500/40 bg-white/[0.08] text-white"
                    : "border-transparent hover:border-white/10 hover:bg-white/[0.04]",
                )}
              >
                <GripVertical className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                <button
                  type="button"
                  onClick={() => setSelectedId(section.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-xs font-medium text-slate-200">
                    {SECTION_LABELS[section.type]}
                  </p>
                  {!section.isVisible && (
                    <p className="text-[10px] text-slate-400">Hidden</p>
                  )}
                </button>
                <div className="flex shrink-0 flex-col opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => moveSection(index, -1)}
                    className="rounded p-0.5 text-slate-400 hover:bg-slate-200"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(index, 1)}
                    className="rounded p-0.5 text-slate-400 hover:bg-slate-200"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="relative border-t border-slate-100 p-2">
            <AdminButton
              variant="secondary"
              className="w-full"
              onClick={() => setShowAddMenu((v) => !v)}
            >
              <Plus className="h-4 w-4" />
              Add Section
            </AdminButton>
            {showAddMenu && (
              <div className="absolute bottom-full left-2 right-2 mb-1 max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                {SECTION_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addSection(type)}
                    className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {SECTION_LABELS[type]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Center: preview */}
        <div className="min-w-0 flex-1 overflow-y-auto bg-slate-200/60 p-4">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg">
            <div className="border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-center text-[10px] text-slate-400">
              Live Preview
            </div>
            {sections.filter((s) => s.isVisible).length === 0 ? (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400">
                Add sections to see preview
              </div>
            ) : (
              sections
                .filter((s) => s.isVisible)
                .map((section) => (
                  <SectionPreview key={section.id} section={section} active={selectedId === section.id} />
                ))
            )}
          </div>
        </div>

        {/* Right: properties */}
        <aside className="flex w-80 shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white">
          {selected ? (
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">{SECTION_LABELS[selected.type]}</h3>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => updateSection(selected.id, { isVisible: !selected.isVisible })}
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100"
                    title={selected.isVisible ? "Hide" : "Show"}
                  >
                    {selected.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSection(selected.id)}
                    className="rounded p-1.5 text-red-400 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <SectionEditor
                section={selected}
                onContentChange={(key, value) => updateContent(selected.id, key, value)}
              />
            </div>
          ) : (
            <div className="p-4 text-sm text-slate-400">Select a section to edit</div>
          )}

          <div className="mt-auto border-t border-slate-100 p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Page Settings</h3>
            <form action={metaAction} className="space-y-3">
              <input type="hidden" name="id" value={page.id} />
              <Field label="Title">
                <AdminInput name="title" defaultValue={page.title} />
              </Field>
              <Field label="Slug">
                <AdminInput name="slug" defaultValue={page.slug} />
              </Field>
              <Field label="SEO Title">
                <AdminInput name="seoTitle" defaultValue={page.seoTitle || ""} />
              </Field>
              <Field label="SEO Description">
                <AdminTextarea name="seoDescription" defaultValue={page.seoDescription || ""} rows={2} />
              </Field>
              <ImageUploader
                name="featuredImage"
                folder="landing"
                label="Featured Image"
                defaultValue={page.featuredImage || ""}
              />
              <AdminButton type="submit" variant="secondary" className="w-full" disabled={metaPending}>
                Save Page Details
              </AdminButton>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function SectionPreview({ section, active }: { section: LandingSection; active: boolean }) {
  const c = section.content;
  return (
    <div
      className={cn(
        "border-b border-slate-100 transition",
        active && "ring-2 ring-inset ring-slate-900/20",
      )}
    >
      {section.type === "hero" && (
        <div
          className="relative flex h-36 items-center justify-center bg-cover bg-center text-white"
          style={{ backgroundImage: `url(${str(c.backgroundImage, "/images/banners/banner-1.jpg")})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative text-center">
            <h2 className="text-lg font-bold">{str(c.title)}</h2>
            <p className="text-xs opacity-90">{str(c.subtitle)}</p>
          </div>
        </div>
      )}
      {section.type === "banner_carousel" && (
        <div className="flex h-24 items-center justify-center bg-slate-800 text-xs text-white">
          Admin Banners Carousel
        </div>
      )}
      {section.type === "banner" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={str(c.image)} alt="" className="h-24 w-full object-cover" />
      )}
      {section.type === "text" && (
        <div className="p-4 text-center">
          <h3 className="font-bold">{str(c.heading)}</h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{str(c.body)}</p>
        </div>
      )}
      {section.type === "cta" && (
        <div className="bg-[#4caf50] p-6 text-center text-white">
          <p className="font-bold">{str(c.title)}</p>
          <span className="mt-2 inline-block rounded bg-white px-3 py-1 text-xs text-slate-800">
            {str(c.buttonText)}
          </span>
        </div>
      )}
      {(section.type === "category_grid" ||
        section.type === "banner_carousel" ||
        section.type === "product_slider" ||
        section.type === "featured_products" ||
        section.type === "product_grid") && (
        <div className="p-4">
          <p className="text-sm font-semibold">{str(c.title, "Products")}</p>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 w-16 rounded bg-slate-100" />
            ))}
          </div>
        </div>
      )}
      {section.type === "faq" && (
        <div className="p-4">
          <p className="text-sm font-semibold">{str(c.title, "FAQ")}</p>
          <div className="mt-2 space-y-1">
            <div className="h-8 rounded bg-slate-100" />
            <div className="h-8 rounded bg-slate-100" />
          </div>
        </div>
      )}
      {section.type === "testimonials" && (
        <div className="bg-[#ebf4ff] p-4">
          <p className="text-center text-sm font-semibold">{str(c.title)}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="h-16 rounded bg-white" />
            <div className="h-16 rounded bg-white" />
          </div>
        </div>
      )}
      {section.type === "countdown" && (
        <div className="bg-slate-900 p-4 text-center text-white">
          <p className="text-sm font-bold">{str(c.title)}</p>
        </div>
      )}
      {section.type === "spacer" && (
        <div className="flex items-center justify-center bg-slate-50 text-[10px] text-slate-300" style={{ height: Number(c.height) || 32 }}>
          spacer
        </div>
      )}
      {section.type === "custom_html" && (
        <div className="p-4 text-xs text-slate-400">Custom HTML block</div>
      )}
    </div>
  );
}

function SectionEditor({
  section,
  onContentChange,
}: {
  section: LandingSection;
  onContentChange: (key: string, value: unknown) => void;
}) {
  const c = section.content;

  const imageField = (label: string, key: string) => (
    <ImageUploader
      folder="landing"
      label={label}
      value={str(c[key])}
      onChange={(url) => onContentChange(key, url)}
    />
  );

  const field = (label: string, key: string, type: "text" | "textarea" | "number" = "text") => (
    <Field label={label}>
      {type === "textarea" ? (
        <AdminTextarea
          value={str(c[key])}
          onChange={(e) => onContentChange(key, e.target.value)}
          rows={3}
        />
      ) : (
        <AdminInput
          type={type === "number" ? "number" : "text"}
          value={type === "number" ? String(c[key] ?? "") : str(c[key])}
          onChange={(e) =>
            onContentChange(key, type === "number" ? Number(e.target.value) : e.target.value)
          }
        />
      )}
    </Field>
  );

  switch (section.type) {
    case "hero":
      return (
        <div className="space-y-3">
          {field("Title", "title")}
          {field("Subtitle", "subtitle")}
          {field("CTA Text", "ctaText")}
          {field("CTA Link", "ctaLink")}
          {imageField("Background Image", "backgroundImage")}
        </div>
      );
    case "banner_carousel":
      return (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          This section shows active banners from <strong>Admin → Banners</strong>. Add or edit banners there and they update here automatically.
        </div>
      );
    case "banner":
      return (
        <div className="space-y-3">
          {field("Title", "title")}
          {imageField("Banner Image", "image")}
          {field("Link", "link")}
        </div>
      );
    case "text":
      return (
        <div className="space-y-3">
          {field("Heading", "heading")}
          {field("Body", "body", "textarea")}
          {field("Alignment (left/center/right)", "alignment")}
        </div>
      );
    case "cta":
      return (
        <div className="space-y-3">
          {field("Title", "title")}
          {field("Subtitle", "subtitle")}
          {field("Button Text", "buttonText")}
          {field("Button Link", "buttonLink")}
          {field("Background Color", "backgroundColor")}
        </div>
      );
    case "category_grid":
      return (
        <div className="space-y-3">
          {field("Title", "title")}
          {field("Limit", "limit", "number")}
        </div>
      );
    case "product_slider":
    case "featured_products":
    case "product_grid":
      return (
        <div className="space-y-3">
          {field("Title", "title")}
          {field("Limit", "limit", "number")}
          {section.type !== "featured_products" && field("Category Slug (optional)", "categorySlug")}
          {field("View More Link", "viewMoreHref")}
        </div>
      );
    case "faq":
      return (
        <div className="space-y-3">
          {field("Title", "title")}
          <FaqEditor
            items={(Array.isArray(c.items) ? c.items : []) as { question?: string; answer?: string }[]}
            onChange={(items) => onContentChange("items", items)}
          />
        </div>
      );
    case "testimonials":
      return (
        <div className="space-y-3">
          {field("Title", "title")}
          <TestimonialEditor
            items={(Array.isArray(c.items) ? c.items : []) as { name?: string; text?: string; rating?: number; avatar?: string }[]}
            onChange={(items) => onContentChange("items", items)}
          />
        </div>
      );
    case "countdown":
      return (
        <div className="space-y-3">
          {field("Title", "title")}
          {field("End Date (ISO)", "endDate")}
          {field("CTA Text", "ctaText")}
          {field("CTA Link", "ctaLink")}
        </div>
      );
    case "spacer":
      return <div className="space-y-3">{field("Height (px)", "height", "number")}</div>;
    case "custom_html":
      return <div className="space-y-3">{field("HTML", "html", "textarea")}</div>;
    default:
      return null;
  }
}

function FaqEditor({
  items,
  onChange,
}: {
  items: { question?: string; answer?: string }[];
  onChange: (items: { question?: string; answer?: string }[]) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-slate-600">Questions</p>
      {items.map((item, i) => (
        <div key={i} className="space-y-1 rounded border border-slate-100 p-2">
          <AdminInput
            placeholder="Question"
            value={item.question || ""}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], question: e.target.value };
              onChange(next);
            }}
          />
          <AdminTextarea
            placeholder="Answer"
            rows={2}
            value={item.answer || ""}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], answer: e.target.value };
              onChange(next);
            }}
          />
          <button
            type="button"
            className="text-xs text-red-500"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            Remove
          </button>
        </div>
      ))}
      <AdminButton
        type="button"
        variant="secondary"
        className="w-full text-xs"
        onClick={() => onChange([...items, { question: "", answer: "" }])}
      >
        Add Question
      </AdminButton>
    </div>
  );
}

function TestimonialEditor({
  items,
  onChange,
}: {
  items: { name?: string; text?: string; rating?: number; avatar?: string }[];
  onChange: (items: { name?: string; text?: string; rating?: number; avatar?: string }[]) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded border border-slate-100 p-2">
          <ImageUploader
            folder="landing"
            label="Avatar"
            value={item.avatar || ""}
            onChange={(url) => {
              const next = [...items];
              next[i] = { ...next[i], avatar: url };
              onChange(next);
            }}
          />
          <AdminInput
            placeholder="Name"
            value={item.name || ""}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], name: e.target.value };
              onChange(next);
            }}
          />
          <AdminTextarea
            placeholder="Review text"
            rows={2}
            value={item.text || ""}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], text: e.target.value };
              onChange(next);
            }}
          />
          <button
            type="button"
            className="text-xs text-red-500"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            Remove
          </button>
        </div>
      ))}
      <AdminButton
        type="button"
        variant="secondary"
        className="w-full text-xs"
        onClick={() => onChange([...items, { name: "", text: "", rating: 5 }])}
      >
        Add Testimonial
      </AdminButton>
    </div>
  );
}
