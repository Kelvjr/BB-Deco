"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/crop-image";
import { Button } from "@/components/ui/button";

type ImageCropModalProps = {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onComplete: (dataUrl: string) => void;
};

export function ImageCropModal({
  open,
  imageSrc,
  onClose,
  onComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onCropComplete = useCallback((_area: Area, croppedPixels: Area) => {
    setPixels(croppedPixels);
  }, []);

  async function confirm() {
    if (!imageSrc || !pixels) return;
    setBusy(true);
    try {
      const dataUrl = await getCroppedImg(imageSrc, pixels);
      onComplete(dataUrl);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  if (!open || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-2xl bg-white p-5 shadow-2xl">
        <h3 id="crop-title" className="text-lg font-semibold text-zinc-900">
          Fit your portrait (square)
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          Move and zoom so your face is centered. We&apos;ll save a square photo
          for your student record.
        </p>
        <div className="relative mt-4 h-72 w-full overflow-hidden rounded-xl bg-zinc-100">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="rect"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <label className="mt-4 text-xs font-medium text-zinc-600">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="mt-1 block w-full accent-[#089735]"
          />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={busy}
            className="bg-[#089735] text-white hover:bg-[#067d2d]"
            onClick={confirm}
          >
            {busy ? "Saving…" : "Use this photo"}
          </Button>
        </div>
      </div>
    </div>
  );
}
