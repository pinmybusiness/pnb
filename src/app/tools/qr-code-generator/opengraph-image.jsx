import { TOOL_MAP } from '@/lib/tools';
import { renderToolOgImage, ogSize, ogContentType } from '@/lib/og';

export const dynamic = 'force-static';
export const alt = `${TOOL_MAP['qr-code-generator'].name} — PinMyBusiness`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderToolOgImage(TOOL_MAP['qr-code-generator']);
}
