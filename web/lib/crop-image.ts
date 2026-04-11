import type { Area } from "react-easy-crop";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = src;
  });
}

/** Square JPEG data URL from react-easy-crop pixel crop. */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputSize = 480,
): Promise<string> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const side = Math.min(outputSize, pixelCrop.width, pixelCrop.height);
  canvas.width = side;
  canvas.height = side;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    side,
    side,
  );

  let quality = 0.88;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  while (dataUrl.length > 450_000 && quality > 0.45) {
    quality -= 0.06;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  return dataUrl;
}
