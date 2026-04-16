import { TOOL_MAP } from '@/lib/tools';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import EmailSignatureGenerator from '@/components/tools/EmailSignatureGenerator';

const tool = TOOL_MAP['email-signature-generator'];

export const metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: tool.href },
  openGraph: { title: tool.name, description: tool.description, url: tool.href },
};

export default function EmailSignaturePage() {
  return (
    <ToolPageLayout tool={tool}>
      <EmailSignatureGenerator />
    </ToolPageLayout>
  );
}
