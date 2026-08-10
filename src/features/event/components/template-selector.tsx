"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWizard } from "@/lib/wizard-context";
import { WizardSteps } from "./wizard-steps";
import { TemplatePreview } from "./template-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { generateTemplateFromImageAction, listTemplatesAction } from "../actions/template.actions";
import { Sparkles, Upload, CheckCircle2, Bookmark, ArrowRight, ArrowLeft } from "lucide-react";

export function TemplateSelector() {
  const router = useRouter();
  const { event, setTemplate, templateId, templateHtml, resetWizard } = useWizard();

  const [templatesList, setTemplatesList] = useState<Array<{ id: string; name: string; html: string }>>([]);
  const [selectedId, setSelectedId] = useState<string | null>(templateId);
  const [selectedHtml, setSelectedHtml] = useState<string | null>(templateHtml);
  const [templateName, setTemplateName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const generateAction = useAction(generateTemplateFromImageAction);
  const listAction = useAction(listTemplatesAction);

  useEffect(() => {
    async function FetchTemplates() {
      const res = await listAction.executeAsync({});
      if (res?.data?.success && res.data.data) {
        setTemplatesList(res.data.data);
        if (!selectedId && res.data.data.length > 0) {
          const first = res.data.data.find(t => t.name === "Default Minimal Template") || res.data.data[0];
          setSelectedId(first.id);
          setSelectedHtml(first.html);
          setTemplate(first.id, first.html);
        }
      }
    }
    FetchTemplates();
  }, []);

  function HandleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }

    setImageFile(file);
    setErrorMsg("");

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function HandleGenerateWithGemini() {
    if (!imagePreview) {
      setErrorMsg("Please upload an image design first.");
      return;
    }

    setIsGenerating(true);
    setErrorMsg("");

    const name = templateName.trim() || `AI Template ${new Date().toLocaleDateString()}`;

    const res = await generateAction.executeAsync({
      name,
      imageBase64: imagePreview,
      mimeType: imageFile?.type || "image/png",
    });

    setIsGenerating(false);

    if (res?.data?.success && res.data.data) {
      const newTpl = res.data.data;
      setTemplatesList((prev) => [newTpl, ...prev]);
      setSelectedId(newTpl.id);
      setSelectedHtml(newTpl.html);
      setTemplate(newTpl.id, newTpl.html);
      setImageFile(null);
      setImagePreview(null);
      setTemplateName("");
    } else {
      setErrorMsg(res?.data?.error || "Gemini AI generation failed. Please try again.");
    }
  }

  function HandleSelectDefault() {
    setSelectedId(null);
    setSelectedHtml(null);
    setTemplate(null, null);
  }

  function HandleSelectSaved(tpl: { id: string; html: string }) {
    setSelectedId(tpl.id);
    setSelectedHtml(tpl.html);
    setTemplate(tpl.id, tpl.html);
  }

  function HandleContinue() {
    setTemplate(selectedId, selectedHtml);
    router.push("/events/new/preview");
  }

  function HandleSaveDraft() {
    setTemplate(selectedId, selectedHtml);
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col gap-12 max-w-6xl w-full mx-auto pb-20">
      <div className="flex flex-col gap-4 items-center mb-4">
        <WizardSteps currentStep={3} />
        <h1 className="font-display text-4xl font-bold text-ink tracking-tight mt-6">Email Template</h1>
        <p className="text-muted text-center max-w-xl">
          Select a default email template or convert an image design with Gemini AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 pb-12">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Choose Design</h2>
            <p className="text-sm text-muted mt-2">
              Select an existing template or generate a new one from an image.
            </p>
          </div>
          
          <div className="card-surface p-5 rounded-2xl border border-dashed border-seal/30 bg-seal/5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-seal text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold text-ink">Generate with Gemini AI</h4>
                <p className="text-xs text-muted">Upload a design to convert to HTML.</p>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={HandleImageSelect}
              className="hidden"
            />

            {!imagePreview ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                className="w-full py-6 border-dashed border-hairline rounded-xl flex flex-col gap-1 items-center justify-center text-xs text-muted hover:border-seal"
              >
                <Upload className="h-5 w-5 text-seal" />
                Upload design image (PNG, JPG)
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative rounded-xl overflow-hidden border border-hairline aspect-[16/9]">
                  <img src={imagePreview} alt="Upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>

                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template Name"
                  className="rounded-xl text-xs bg-paper border-hairline"
                />

                <Button
                  type="button"
                  onClick={HandleGenerateWithGemini}
                  disabled={isGenerating}
                  className="btn-seal w-full py-2.5 text-xs inline-flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate HTML Template"}
                </Button>
              </div>
            )}

            {errorMsg ? <p className="font-mono text-xs text-seal">{errorMsg}</p> : null}
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold text-ink mt-2">Saved Templates</h3>
            


            {templatesList.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => HandleSelectSaved(tpl)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  selectedId === tpl.id
                    ? "border-seal bg-seal/10 ring-2 ring-seal/20"
                    : "border-hairline bg-paper hover:border-seal/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">{tpl.name}</span>
                  {selectedId === tpl.id && <CheckCircle2 className="h-5 w-5 text-seal" />}
                </div>
                <p className="text-xs text-muted mt-1">Saved HTML Email Template</p>
              </button>
            ))}
          </div>
        </div>

        <div className="card-surface p-6 md:p-8 flex flex-col gap-6 rounded-2xl border border-hairline bg-paper">
          <h3 className="font-display text-lg font-semibold text-ink">Live Preview</h3>
          <div className="w-full h-full min-h-[400px]">
            <TemplatePreview
              html={selectedHtml}
              eventName={event?.name}
              date={event?.date ? new Date(event.date).toLocaleString() : undefined}
              location={event?.venueName || event?.address}
              description={event?.description}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-paper-raised border border-hairline p-3 md:p-4 rounded-2xl shadow-2xl flex items-center justify-between z-50">
        <Button type="button" variant="ghost" onClick={() => router.push("/events/new/guests")} className="text-muted hover:text-ink hover:bg-seal/5 rounded-xl px-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" onClick={HandleSaveDraft} className="text-muted hover:text-ink hover:bg-seal/5 rounded-xl px-4">
            <Bookmark className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button type="button" onClick={HandleContinue} className="btn-seal rounded-xl px-8 shadow-md">
            Continue to Preview
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
