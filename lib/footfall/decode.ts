// QR decoding for the scanner: the browser's built-in BarcodeDetector where it
// exists (Chrome on Android), jsQR everywhere else (iPhone Safari etc.).

type Source = HTMLVideoElement | HTMLImageElement;

interface Detector {
  detect(source: CanvasImageSource): Promise<{ rawValue: string }[]>;
}

let detector: Detector | null | undefined;
function getDetector(): Detector | null {
  if (detector !== undefined) return detector;
  detector = null;
  try {
    const BD = (window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => Detector }).BarcodeDetector;
    if (BD) detector = new BD({ formats: ["qr_code"] });
  } catch {
    detector = null;
  }
  return detector;
}

let jsqr: typeof import("jsqr").default | null = null;
async function getJsQR() {
  if (!jsqr) jsqr = (await import("jsqr")).default;
  return jsqr;
}

/** Draws the source scaled to `max` px and tries to read a QR from it. */
export async function decodeFrame(src: Source, w: number, h: number, canvas: HTMLCanvasElement, max: number): Promise<string | null> {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx || !w || !h) return null;
  const scale = Math.min(1, max / Math.max(w, h));
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
  const d = getDetector();
  if (d) {
    try {
      const codes = await d.detect(canvas);
      if (codes.length) return codes[0].rawValue;
    } catch {
      /* fall through to jsQR */
    }
  }
  const decode = await getJsQR();
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const r = decode(img.data, img.width, img.height, { inversionAttempts: "attemptBoth" });
  return r ? r.data : null;
}

/** Reads a QR from a photo, trying a few sizes (big photos from phone cameras). */
export async function decodeFile(file: File): Promise<string | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    for (const size of [1000, 1600, 700, 2200]) {
      const t = await decodeFrame(img, img.naturalWidth, img.naturalHeight, canvas, size);
      if (t) return t;
    }
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}
