// src/components/ContentSection.jsx
import { dangerouslySetInnerHTML } from 'next/dynamic'; // Note: Use dangerouslySetInnerHTML for HTML content

export default function ContentSection({ content }) {
  return (
    <div className="px-4 pb-12">
      <div className="rounded-xl p-6">
        <div className='content' dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}