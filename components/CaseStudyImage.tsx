import Image from "next/image";

type CaseStudyImageProps = {
  src?: string;
  alt: string;
  label: string;
  className?: string;
};

export default function CaseStudyImage({
  src,
  alt,
  label,
  className = "",
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
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
