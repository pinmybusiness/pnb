import { TOOL_MAP } from '@/lib/tools';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import WhatsAppGenerator from '@/components/tools/WhatsAppGenerator';

const tool = TOOL_MAP['whatsapp-link-generator'];

export const metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: tool.href },
  openGraph: {
    title: tool.name,
    description: tool.description,
    url: tool.href,
  },
};

export default function WhatsAppPage() {
  return (
    <ToolPageLayout tool={tool}>
      <WhatsAppGenerator />
    </ToolPageLayout>
  );
}
