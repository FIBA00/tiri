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
    <div className="card-surface max-w-4xl mx-auto p-6 md:p-10 flex flex-col gap-8">
      <WizardSteps currentStep={3} />

      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Email Template</h2>
          <p className="text-sm text-muted">Select a default email template or convert an image design with Gemini AI.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={HandleSaveDraft}
          className="inline-flex items-center gap-1.5 rounded-xl border-hairline text-xs font-medium text-muted hover:text-ink"
        >
          <Bookmark className="h-4 w-4 text-seal" />
          Save Draft & Exit
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-base font-semibold text-ink">Select Base Template</h3>

            <button
              type="button"
              onClick={HandleSelectDefault}
              className={`w-full p-4 rounded-2xl border text-left transition-all ${
                selectedId === null
                  ? "border-seal bg-seal/10 ring-2 ring-seal/20"
                  : "border-hairline bg-paper hover:border-seal/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">Default Beautiful Email Template</span>
                {selectedId === null && <CheckCircle2 className="h-5 w-5 text-seal" />}
              </div>
              <p className="text-xs text-muted mt-1">Clean, responsive invitation design with passcode and QR code.</p>
            </button>

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

          <div className="card-surface p-5 rounded-2xl border border-dashed border-seal/30 bg-seal/5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-seal text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-display text-sm font-semibold text-ink">Convert Image to HTML with Gemini AI</h4>
                <p className="text-xs text-muted">Upload an invitation card design to generate custom email HTML.</p>
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
                Click to upload design image (PNG, JPG)
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
                  placeholder="Template Name (e.g. Elegant Gold Theme)"
                  className="rounded-xl text-xs bg-paper border-hairline"
                />

                <Button
                  type="button"
                  onClick={HandleGenerateWithGemini}
                  disabled={isGenerating}
                  className="btn-seal w-full py-2.5 text-xs inline-flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isGenerating ? "Generating HTML with Gemini AI..." : "Generate HTML Template"}
                </Button>
              </div>
            )}

            {errorMsg ? <p className="font-mono text-xs text-seal">{errorMsg}</p> : null}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-display text-base font-semibold text-ink">Live Template Preview</h3>
          <TemplatePreview
            html={selectedHtml}
            eventName={event?.name}
            date={event?.date ? new Date(event.date).toLocaleString() : undefined}
            location={event?.venueName || event?.address}
            description={event?.description}
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-hairline pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/events/new/guests")}
          className="inline-flex items-center gap-2 text-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Guest List
        </Button>
        <Button type="button" onClick={HandleContinue} className="btn-seal inline-flex items-center gap-2 px-8">
          Continue to Preview
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
