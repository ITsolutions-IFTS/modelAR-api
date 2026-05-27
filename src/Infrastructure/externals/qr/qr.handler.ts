import QRCode from 'qrcode';

/**
 * Generates a QR code as a base64 data URL (PNG).
 * The resulting string can be used directly as: <img src={qrValue} />
 */
export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
}
