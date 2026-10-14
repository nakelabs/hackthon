/**
 * Utility functions for image optimization, progressive loading, and client-side compression.
 */

/**
 * Converts a raw image URL into an optimized, CDN-cached WebP image URL via wsrv.nl.
 * Reduces 1MB-5MB uncompressed PNGs down to ~50KB-80KB WebP images.
 *
 * @param {string} url - Original image URL
 * @param {number} width - Desired maximum width (default: 600px for card view)
 * @param {number} quality - WebP quality 1-100 (default: 80)
 * @returns {string} Optimized image URL
 */
export function getOptimizedImageUrl(url, width = 500, quality = 75) {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) return url;

  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=${quality}`;
}

/**
 * Compresses an image File object before sending it to the server.
 * Resizes huge images (e.g. 3000px PDF exports) to a max width and encodes as WebP.
 *
 * @param {File} file - Original file from <input type="file">
 * @param {number} maxWidth - Maximum width in pixels (default: 1200)
 * @param {number} quality - Quality between 0 and 1 (default: 0.85)
 * @returns {Promise<File>} Compressed File or original if compression fails/unneeded
 */
export async function compressImageForUpload(file, maxWidth = 1200, quality = 0.85) {
  if (!file || !file.type.startsWith("image/")) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }
            const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], newName, {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
