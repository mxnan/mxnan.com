// components/mdx-image.tsx
import Image, { ImageProps } from 'next/image';

type MDXImageProps = ImageProps & {
  alt: string; // force alt for accessibility
};

export function MDXImage({
  src,
  alt,
  width = 800,
  height = 450,
  className,
  ...props
}: MDXImageProps) {
  return (
    <span className="my-6 block">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        data-cursor="invert"
        className={`rounded-lg ${className ?? ''}`}
        sizes="(max-width: 768px) 100vw, 800px"
        {...props}
      />
    </span>
  );
}