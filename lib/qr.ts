import "server-only";
import QRCode from "qrcode";

export function qrDataUrl(text: string) {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 240,
    color: { dark: "#1E140E", light: "#FFFFFF" },
  });
}
