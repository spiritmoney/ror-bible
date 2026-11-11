import { useEffect } from 'react';

type WebsitePageMetaProps = {
  title: string;
  description: string;
};

export default function WebsitePageMeta({
  title,
  description,
}: WebsitePageMetaProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let meta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    const created = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    const previousDescription = meta.getAttribute('content') ?? '';
    meta.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      if (created && meta?.parentNode) {
        meta.parentNode.removeChild(meta);
      } else if (meta) {
        meta.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);

  return null;
}
