import { TOOL_MAP, SITE } from '@/lib/tools';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import WhatsAppGenerator from '@/components/tools/WhatsAppGenerator';

const tool = TOOL_MAP['whatsapp-link-generator'];

export const metadata = {
  title: tool.seoTitle || tool.name,
  description: tool.seoDescription || tool.description,
  keywords: tool.keywords,
  alternates: { canonical: tool.href },
  openGraph: {
    type: 'website',
    title: tool.seoTitle || tool.name,
    description: tool.seoDescription || tool.description,
    url: `${SITE.url}${tool.href}`,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: tool.seoTitle || tool.name,
    description: tool.seoDescription || tool.description,
  },
};

export default function WhatsAppPage() {
  return (
    <ToolPageLayout tool={tool}>
      <WhatsAppGenerator />
    </ToolPageLayout>
  );
}
