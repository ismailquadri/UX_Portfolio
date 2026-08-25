import Image from "next/image";

type CaseStudyImageProps = {
  src?: string;
  alt: string;
  label: string;
  className?: string;
  sizes?: string;
};

const DEFAULT_SIZES = "(min-width: 640px) 45vw, calc(100vw - 48px)";

export default function CaseStudyImage({
  src,
  alt,
  label,
  className = "",
  sizes = DEFAULT_SIZES,
}: CaseStudyImageProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-md border border-dashed border-border-subtle bg-surface ${className}`}
      >
        <p className="px-4 text-center font-body text-[14px] text-[#555]">{label}</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-md ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
