import { TOOL_MAP } from '@/lib/tools';
import ToolPageLayout from '@/components/layout/ToolPageLayout';
import PasswordGenerator from '@/components/tools/PasswordGenerator';

const tool = TOOL_MAP['password-generator'];

export const metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: tool.href },
  openGraph: { title: tool.name, description: tool.description, url: tool.href },
};

export default function PasswordPage() {
  return (
    <ToolPageLayout tool={tool}>
      <PasswordGenerator />
    </ToolPageLayout>
  );
}
