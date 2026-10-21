/**
 * Prepares user-provided HTML with an ESM import map shim and baseline reset
 * allowing Three.js, GSAP, and Tailwind CDN scripts to execute seamlessly
 * inside a strictly sandboxed iframe.
 */
export function buildSandboxedHtml(rawHtml: string): string {
  // If user already included a full <!DOCTYPE html> document, inject importmap into <head>
  const importMap = `
  <base target="_blank">
  <script type="importmap">
  {
    "imports": {
      "three": "https://esm.sh/three@0.170.0",
      "three/addons/": "https://esm.sh/three@0.170.0/examples/jsm/",
      "three/examples/jsm/": "https://esm.sh/three@0.170.0/examples/jsm/",
      "gsap": "https://esm.sh/gsap@3.12.5",
      "lucide": "https://esm.sh/lucide@0.460.0"
    }
  }
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Prevent iframe white-flash and provide dark canvas default */
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: #090a0f;
      color: #f1f5f9;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  </style>
  `;

  if (rawHtml.includes("<head>")) {
    return rawHtml.replace("<head>", `<head>${importMap}`);
  }

  if (rawHtml.includes("<html>")) {
    return rawHtml.replace("<html>", `<html><head>${importMap}</head>`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${importMap}
</head>
<body>
  ${rawHtml}
</body>
</html>`;
}
