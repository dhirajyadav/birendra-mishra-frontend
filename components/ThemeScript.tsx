export default function ThemeScript() {
  const themeInit = `
    (function() {
      try {
        var saved = localStorage.getItem('bm-theme');
        if (saved) {
          document.documentElement.setAttribute('data-theme', saved);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: themeInit }} />;
}

