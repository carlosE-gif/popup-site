"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/content";

const TABS = ["Hero", "About", "Services", "Portfolio", "Testimonials", "Contact"] as const;
type Tab = typeof TABS[number];

const FIELD = "bg-transparent border-b border-white/10 py-2.5 text-white text-sm font-sans placeholder:text-white/20 focus:border-white/50 focus:outline-none transition-colors w-full";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Hero");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return null; }
        if (!r.ok) throw new Error(`Failed to load content: ${r.status}`);
        return r.json();
      })
      .then((data) => { if (data) setContent(data); })
      .catch((err) => console.error("Failed to load content:", err));
  }, [router]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const save = useCallback(async () => {
    if (!content) return;
    setSaving(true);
    setSaveFailed(false);
    try {
      const r = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (r.ok) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setSaved(false), 2500);
        setSaved(true);
      } else {
        console.error("Failed to save content:", r.status);
        setSaveFailed(true);
      }
    } catch (err) {
      console.error("Failed to save content:", err);
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  }, [content]);

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const set = (path: string, value: unknown) => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev) as unknown as Record<string, unknown>;
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return next as unknown as SiteContent;
    });
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white/30 text-xs tracking-widest font-mono">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/08 px-8 py-4 flex items-center justify-between">
        <img src="/logo.png" alt="PopUp" className="h-8 w-auto" style={{ filter: "brightness(0) invert(1)" }} />
        <div className="flex items-center gap-6">
          <a
            href="/"
            target="_blank"
            className="text-[10px] tracking-[0.15em] text-white/30 hover:text-white/60 uppercase transition-colors"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            View Site ↗
          </a>
          <button
            onClick={save}
            disabled={saving}
            className="text-[10px] tracking-[0.2em] uppercase px-6 py-2.5 bg-white text-[#0A0A0A] hover:bg-white/85 transition-colors disabled:opacity-50"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : saveFailed ? "Save failed, retry" : "Save Changes"}
          </button>
          <button
            onClick={logout}
            className="text-[10px] tracking-[0.15em] text-white/20 hover:text-white/50 uppercase transition-colors"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            Log out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-48 border-r border-white/08 py-8 px-4 flex-shrink-0">
          <nav className="flex flex-col gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-left text-[11px] tracking-[0.15em] uppercase px-3 py-2.5 transition-colors ${
                  tab === t
                    ? "bg-white/08 text-white"
                    : "text-white/30 hover:text-white/60"
                }`}
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {t}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-10">

          {/* ── HERO ── */}
          {tab === "Hero" && (
            <Section title="Hero">
              <Field label="Headline Line 1">
                <input className={FIELD} value={content.hero.lines[0]} onChange={(e) => set("hero.lines", [e.target.value, content.hero.lines[1], content.hero.lines[2]])} />
              </Field>
              <Field label="Headline Line 2">
                <input className={FIELD} value={content.hero.lines[1]} onChange={(e) => set("hero.lines", [content.hero.lines[0], e.target.value, content.hero.lines[2]])} />
              </Field>
              <Field label="Headline Line 3">
                <input className={FIELD} value={content.hero.lines[2]} onChange={(e) => set("hero.lines", [content.hero.lines[0], content.hero.lines[1], e.target.value])} />
              </Field>
              <Field label="Descriptor">
                <textarea className={FIELD} rows={3} value={content.hero.descriptor} onChange={(e) => set("hero.descriptor", e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-6">
                <Field label="CTA — View Work">
                  <input className={FIELD} value={content.hero.ctaWork} onChange={(e) => set("hero.ctaWork", e.target.value)} />
                </Field>
                <Field label="CTA — Book">
                  <input className={FIELD} value={content.hero.ctaBook} onChange={(e) => set("hero.ctaBook", e.target.value)} />
                </Field>
              </div>
            </Section>
          )}

          {/* ── ABOUT ── */}
          {tab === "About" && (
            <Section title="About">
              {content.about.headlineLines.map((line, i) => (
                <Field key={i} label={`Headline Line ${i + 1}`}>
                  <input className={FIELD} value={line} onChange={(e) => {
                    const next = [...content.about.headlineLines];
                    next[i] = e.target.value;
                    set("about.headlineLines", next);
                  }} />
                </Field>
              ))}
              <Field label="Paragraph 1">
                <textarea className={FIELD} rows={4} value={content.about.body1} onChange={(e) => set("about.body1", e.target.value)} />
              </Field>
              <Field label="Paragraph 2">
                <textarea className={FIELD} rows={4} value={content.about.body2} onChange={(e) => set("about.body2", e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-6">
                <Field label="Tagline">
                  <input className={FIELD} value={content.about.tagline} onChange={(e) => set("about.tagline", e.target.value)} />
                </Field>
                <Field label="Founded">
                  <input className={FIELD} value={content.about.founded} onChange={(e) => set("about.founded", e.target.value)} />
                </Field>
              </div>
              <Divider label="Stats" />
              {content.about.stats.map((stat, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 mb-4">
                  <Field label="Number">
                    <input className={FIELD} type="number" value={stat.to} onChange={(e) => {
                      const next = content.about.stats.map((s, j) => j === i ? { ...s, to: Number(e.target.value) } : s);
                      set("about.stats", next);
                    }} />
                  </Field>
                  <Field label="Suffix">
                    <input className={FIELD} value={stat.suffix} onChange={(e) => {
                      const next = content.about.stats.map((s, j) => j === i ? { ...s, suffix: e.target.value } : s);
                      set("about.stats", next);
                    }} />
                  </Field>
                  <Field label="Label">
                    <input className={FIELD} value={stat.label} onChange={(e) => {
                      const next = content.about.stats.map((s, j) => j === i ? { ...s, label: e.target.value } : s);
                      set("about.stats", next);
                    }} />
                  </Field>
                  <Field label="Description">
                    <input className={FIELD} value={stat.desc} onChange={(e) => {
                      const next = content.about.stats.map((s, j) => j === i ? { ...s, desc: e.target.value } : s);
                      set("about.stats", next);
                    }} />
                  </Field>
                </div>
              ))}
            </Section>
          )}

          {/* ── SERVICES ── */}
          {tab === "Services" && (
            <Section title="Services">
              {content.services.map((svc, i) => (
                <div key={i} className="mb-8 pb-8 border-b border-white/06 last:border-0">
                  <p className="text-[9px] tracking-widest text-white/20 uppercase mb-4" style={{ fontFamily: "var(--font-space-mono)" }}>{svc.num}</p>
                  <div className="grid grid-cols-2 gap-6">
                    <Field label="Title">
                      <input className={FIELD} value={svc.title} onChange={(e) => {
                        const next = content.services.map((s, j) => j === i ? { ...s, title: e.target.value } : s);
                        set("services", next);
                      }} />
                    </Field>
                    <Field label="Description">
                      <input className={FIELD} value={svc.desc} onChange={(e) => {
                        const next = content.services.map((s, j) => j === i ? { ...s, desc: e.target.value } : s);
                        set("services", next);
                      }} />
                    </Field>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ── PORTFOLIO ── */}
          {tab === "Portfolio" && (
            <Section title="Portfolio">
              {content.portfolio.map((event, i) => (
                <div key={event.id} className="mb-10 pb-10 border-b border-white/06 last:border-0">
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    <Field label="Event Name">
                      <input className={FIELD} value={event.name} onChange={(e) => {
                        const next = content.portfolio.map((ev, j) => j === i ? { ...ev, name: e.target.value } : ev);
                        set("portfolio", next);
                      }} />
                    </Field>
                    <Field label="City">
                      <input className={FIELD} value={event.city} onChange={(e) => {
                        const next = content.portfolio.map((ev, j) => j === i ? { ...ev, city: e.target.value } : ev);
                        set("portfolio", next);
                      }} />
                    </Field>
                    <Field label="Year">
                      <input className={FIELD} value={event.year} onChange={(e) => {
                        const next = content.portfolio.map((ev, j) => j === i ? { ...ev, year: e.target.value } : ev);
                        set("portfolio", next);
                      }} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-5">
                    <Field label="Type">
                      <select
                        className={FIELD + " cursor-pointer"}
                        value={event.type}
                        onChange={(e) => {
                          const next = content.portfolio.map((ev, j) => j === i ? { ...ev, type: e.target.value } : ev);
                          set("portfolio", next);
                        }}
                      >
                        <option value="Club Nights" className="bg-[#0A0A0A]">Club Nights</option>
                        <option value="Private" className="bg-[#0A0A0A]">Private</option>
                        <option value="Brand Events" className="bg-[#0A0A0A]">Brand Events</option>
                      </select>
                    </Field>
                    <Field label="Aspect Ratio">
                      <div className="flex items-center gap-6 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const next = content.portfolio.map((ev, j) => j === i ? { ...ev, tall: false } : ev);
                            set("portfolio", next);
                          }}
                          className={`flex flex-col items-center gap-1.5 transition-opacity ${!event.tall ? "opacity-100" : "opacity-30 hover:opacity-60"}`}
                        >
                          <div className={`border transition-colors ${!event.tall ? "border-white" : "border-white/20"}`} style={{ width: 32, height: 24 }} />
                          <span className="text-[9px] tracking-widest text-white/40 uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>Landscape</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const next = content.portfolio.map((ev, j) => j === i ? { ...ev, tall: true } : ev);
                            set("portfolio", next);
                          }}
                          className={`flex flex-col items-center gap-1.5 transition-opacity ${event.tall ? "opacity-100" : "opacity-30 hover:opacity-60"}`}
                        >
                          <div className={`border transition-colors ${event.tall ? "border-white" : "border-white/20"}`} style={{ width: 24, height: 32 }} />
                          <span className="text-[9px] tracking-widest text-white/40 uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>Portrait</span>
                        </button>
                      </div>
                    </Field>
                  </div>
                  <Field label="Image">
                    <ImageUploader
                      value={event.img}
                      tall={event.tall}
                      onChange={(url) => {
                        const next = content.portfolio.map((ev, j) => j === i ? { ...ev, img: url } : ev);
                        set("portfolio", next);
                      }}
                    />
                  </Field>
                </div>
              ))}
            </Section>
          )}

          {/* ── TESTIMONIALS ── */}
          {tab === "Testimonials" && (
            <Section title="Testimonials">
              {content.testimonials.map((t, i) => (
                <div key={i} className="mb-8 pb-8 border-b border-white/06 last:border-0">
                  <Field label={`Quote ${i + 1}`}>
                    <textarea className={FIELD} rows={3} value={t.quote} onChange={(e) => {
                      const next = content.testimonials.map((q, j) => j === i ? { ...q, quote: e.target.value } : q);
                      set("testimonials", next);
                    }} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Field label="Name">
                      <input className={FIELD} value={t.name} onChange={(e) => {
                        const next = content.testimonials.map((q, j) => j === i ? { ...q, name: e.target.value } : q);
                        set("testimonials", next);
                      }} />
                    </Field>
                    <Field label="Role">
                      <input className={FIELD} value={t.role} onChange={(e) => {
                        const next = content.testimonials.map((q, j) => j === i ? { ...q, role: e.target.value } : q);
                        set("testimonials", next);
                      }} />
                    </Field>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ── CONTACT ── */}
          {tab === "Contact" && (
            <Section title="Contact">
              <Field label="Headline">
                <input className={FIELD} value={content.contact.headline} onChange={(e) => set("contact.headline", e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-6">
                <Field label="Email">
                  <input className={FIELD} value={content.contact.email} onChange={(e) => set("contact.email", e.target.value)} />
                </Field>
                <Field label="Phone">
                  <input className={FIELD} value={content.contact.phone} onChange={(e) => set("contact.phone", e.target.value)} />
                </Field>
                <Field label="Tagline">
                  <input className={FIELD} value={content.contact.tagline} onChange={(e) => set("contact.tagline", e.target.value)} />
                </Field>
              </div>
              <Divider label="Social Links" />
              {content.contact.socials.map((s, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 mb-4">
                  <Field label="Label (IG / TK / WA)">
                    <input className={FIELD} value={s.label} onChange={(e) => {
                      const next = content.contact.socials.map((sl, j) => j === i ? { ...sl, label: e.target.value } : sl);
                      set("contact.socials", next);
                    }} />
                  </Field>
                  <Field label="Full Name">
                    <input className={FIELD} value={s.full} onChange={(e) => {
                      const next = content.contact.socials.map((sl, j) => j === i ? { ...sl, full: e.target.value } : sl);
                      set("contact.socials", next);
                    }} />
                  </Field>
                  <Field label="URL">
                    <input className={FIELD} value={s.href} onChange={(e) => {
                      const next = content.contact.socials.map((sl, j) => j === i ? { ...sl, href: e.target.value } : sl);
                      set("contact.socials", next);
                    }} />
                  </Field>
                </div>
              ))}
            </Section>
          )}

        </main>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="font-playfair font-bold italic text-3xl text-white mb-10"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-6 max-w-3xl">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className="text-[9px] tracking-[0.2em] text-white/30 uppercase"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-2">
      <span className="h-px flex-1 bg-white/08" />
      <span
        className="text-[9px] tracking-[0.2em] text-white/20 uppercase"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        {label}
      </span>
    </div>
  );
}

function ImageUploader({
  value,
  tall,
  onChange,
}: {
  value: string;
  tall: boolean;
  onChange: (url: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    // Bigger bodies are rejected by Vercel before reaching the API route, so check here too
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("File too large. Max 4MB.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const r = await fetch("/api/upload", { method: "POST", body: form });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  return (
    <div className="flex gap-6 items-start">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex-shrink-0 cursor-pointer border overflow-hidden transition-colors duration-200 ${
          dragging ? "border-white/60 bg-white/05" : "border-white/15 hover:border-white/40"
        } ${uploading ? "cursor-wait" : ""}`}
        style={{ width: tall ? 100 : 133, height: tall ? 133 : 100 }}
      >
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              {uploading ? (
                <span className="text-[9px] tracking-widest text-white uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>Uploading…</span>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                  <span className="text-[9px] tracking-widest text-white uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>Replace</span>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <span className="text-[9px] tracking-widest text-white/40 uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>Uploading…</span>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span className="text-[9px] tracking-widest text-white/20 uppercase text-center px-2" style={{ fontFamily: "var(--font-space-mono)" }}>
                  {dragging ? "Drop here" : "Drag & drop"}
                </span>
              </>
            )}
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFile} />
      </div>

      {/* Right side: URL input + browse button + error */}
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] tracking-[0.2em] text-white/20 uppercase" style={{ fontFamily: "var(--font-space-mono)" }}>
            Image URL
          </span>
          <input
            className={FIELD}
            value={value}
            placeholder="https://... or upload a file"
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="self-start text-[9px] tracking-[0.15em] uppercase px-4 py-2 border border-white/20 text-white/40 hover:border-white/50 hover:text-white/70 transition-colors disabled:opacity-30"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {uploading ? "Uploading…" : "Browse File"}
        </button>
        {uploadError && (
          <p className="text-[9px] text-red-400" style={{ fontFamily: "var(--font-space-mono)" }}>{uploadError}</p>
        )}
        <p className="text-[9px] text-white/15" style={{ fontFamily: "var(--font-space-mono)" }}>
          JPG, PNG, WebP, GIF — max 10 MB
        </p>
      </div>
    </div>
  );
}
