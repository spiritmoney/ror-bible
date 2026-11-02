// src/utils/scrollToHash.ts
export function scrollToHash(
  hash: string | null,
  opts?: { headerOffset?: number; behavior?: ScrollBehavior; maxAttempts?: number; retryDelay?: number }
) {
  if (!hash) return false;
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const headerOffset = opts?.headerOffset ?? 0;
  const behavior = opts?.behavior ?? "smooth";
  const maxAttempts = opts?.maxAttempts ?? 12;
  const retryDelay = opts?.retryDelay ?? 80;

  let attempts = 0;

  function tryScroll(): boolean {
    const el = document.getElementById(id);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const target = Math.max(0, absoluteTop - headerOffset);
    window.scrollTo({ top: target, behavior });
    return true;
  }

  return new Promise<boolean>((resolve) => {
    if (tryScroll()) {
      resolve(true);
      return;
    }
    const iv = window.setInterval(() => {
      attempts += 1;
      if (tryScroll() || attempts >= maxAttempts) {
        window.clearInterval(iv);
        resolve(tryScroll());
      }
    }, retryDelay);
  });
}
