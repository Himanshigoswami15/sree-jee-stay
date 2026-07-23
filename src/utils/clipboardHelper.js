/**
 * High-reliability Mobile Clipboard Helper
 * Works across iOS Safari, Android Chrome, Samsung Internet, and Desktop browsers.
 * Must be invoked directly within a user gesture event (e.g. button onClick).
 */
export async function copyToMobileClipboard(text) {
  if (!text) return false;

  let success = false;

  // 1. Try modern Navigator Clipboard API
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      success = true;
    } catch (err) {
      console.warn('Modern Clipboard API failed, attempting mobile fallback:', err);
    }
  }

  // 2. iOS Safari / Mobile Android execCommand fallback
  if (!success) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      
      // Prevent scrolling and soft keyboard popup on mobile
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      textarea.style.opacity = '0';
      textarea.setAttribute('readonly', '');

      document.body.appendChild(textarea);
      
      // Select text for iOS Safari & Android
      textarea.select();
      textarea.setSelectionRange(0, 99999); // For iOS devices

      const copySuccess = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (copySuccess) {
        success = true;
      }
    } catch (err) {
      console.error('execCommand copy failed:', err);
    }
  }

  return success;
}
