import { useState, useEffect, useRef } from "react";
import { getOptimizedImageUrl } from "../../utils/imageUtils";

/**
 * High-performance image component with:
 * - Edge-cached WebP CDN via wsrv.nl (~50KB per image instead of 1.5MB)
 * - Immediate rendering without blocking behind opacity-0
 * - Instant check for cached images via img.complete
 * - Automatic seamless fallback to original source
 * - Subtle background shimmer without disruptive spinning wheels
 */
export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  width = 500,
  quality = 75,
  loading = "lazy",
  ...props
}) {
  const [currentSrc, setCurrentSrc] = useState(() => getOptimizedImageUrl(src, width, quality));
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const optimized = getOptimizedImageUrl(src, width, quality);
    setCurrentSrc(optimized);
    setHasError(false);

    // If already in browser memory/cache, mark loaded immediately
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
    }
  }, [src, width, quality]);

  const handleError = () => {
    // If the optimized proxy failed, fallback directly to original raw image
    if (currentSrc !== src && src) {
      setCurrentSrc(src);
    } else {
      setHasError(true);
    }
  };

  if (!src || hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-[#111] ${className}`}>
        <span className="text-4xl opacity-20">🌟</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#111]">
      {/* Subtle background shimmer while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />
      )}

      {/* Image displays immediately as it decodes */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={className}
        {...props}
      />
    </div>
  );
}
