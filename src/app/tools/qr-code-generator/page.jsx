import { TOOL_MAP } from '@/lib/tools';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import QRCodeGenerator from '@/components/tools/QRCodeGenerator';

const tool = TOOL_MAP['qr-code-generator'];

export const metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: tool.href },
  openGraph: { title: tool.name, description: tool.description, url: tool.href },
};

export default function QRCodePage() {
  return (
    <ToolPageLayout tool={tool}>
      <QRCodeGenerator />
    </ToolPageLayout>
  );
}
