const MAX_EDGE = 1200;
const JPEG_QUALITY = 0.82;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Invalid image"));
    img.src = dataUrl;
  });
}

async function resizeImage(file: File): Promise<Blob> {
  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not compress image"));
      },
      "image/jpeg",
      JPEG_QUALITY
    );
  });
}

export type ReviewPhotoPayload = {
  data: string;
  mime: string;
  name: string;
};

export async function encodeReviewPhotos(files: File[]): Promise<ReviewPhotoPayload[]> {
  const out: ReviewPhotoPayload[] = [];
  for (const file of files) {
    const blob = await resizeImage(file);
    const dataUrl = await readFileAsDataUrl(
      new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" })
    );
    const base64 = dataUrl.split(",")[1] ?? "";
    out.push({
      data: base64,
      mime: "image/jpeg",
      name: file.name.replace(/\.\w+$/, ".jpg"),
    });
  }
  return out;
}
