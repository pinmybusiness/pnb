import { TOOL_MAP } from '@/lib/tools';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import InvoiceGenerator from '@/components/tools/InvoiceGenerator';

const tool = TOOL_MAP['invoice-generator'];

export const metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: tool.href },
  openGraph: { title: tool.name, description: tool.description, url: tool.href },
};

export default function InvoicePage() {
  return (
    <ToolPageLayout tool={tool}>
      <InvoiceGenerator />
    </ToolPageLayout>
  );
}
