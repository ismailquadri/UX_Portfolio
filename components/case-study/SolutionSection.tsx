import CaseStudyImage from "@/components/CaseStudyImage";
import ProseHtml from "@/components/case-study/ProseHtml";
import type { CaseStudySolutionItem } from "@/lib/case-studies";

export default function SolutionSection({
  items,
}: {
  items: CaseStudySolutionItem[];
}) {
  return (
    <div className="flex flex-col gap-12">
      {items.map((item) => (
        <div key={item.heading} className="flex flex-col gap-6">
          <h3 className="font-body text-[24px] font-semibold text-ink">
            {item.heading}
          </h3>
          {item.images.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {item.images.map((image, index) => {
                const isTrailingOdd =
                  item.images.length % 2 === 1 && index === item.images.length - 1;
                return (
                  <div
                    key={`${image}-${index}`}
                    className={isTrailingOdd ? "flex justify-center sm:col-span-2" : ""}
                  >
                    <CaseStudyImage
                      src={image}
                      alt={`${item.heading} (${index + 1})`}
                      label={`Solution screenshot — 800×600 (${item.heading} ${index + 1})`}
                      className={`aspect-[4/3] w-full ${
                        isTrailingOdd ? "sm:w-1/2" : ""
                      }`}
                      sizes={isTrailingOdd ? "(min-width: 640px) 23vw, calc(100vw - 48px)" : undefined}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex justify-center">
              <CaseStudyImage
                alt={item.heading}
                label={`Solution screenshot — 800×600 (${item.heading})`}
                className="aspect-[4/3] w-full sm:w-1/2"
                sizes="(min-width: 640px) 23vw, calc(100vw - 48px)"
              />
            </div>
          )}
          <ProseHtml html={item.html} />
        </div>
      ))}
    </div>
  );
}
