import CaseStudyImage from "@/components/CaseStudyImage";
import ProseHtml from "@/components/case-study/ProseHtml";
import type { CaseStudySolutionItem } from "@/lib/case-studies";

// Same box the Process section images use — kept as one constant so every
// non-collage image in a case study reads at a consistent size.
const DEFAULT_ASPECT = "video";
const DEFAULT_SIZES = "(min-width: 768px) calc((100vw - 269px) * 0.9), calc(100vw - 48px)";
const GRID_SIZES = "(min-width: 640px) calc((100vw - 269px) * 0.4), calc(100vw - 48px)";

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
          {item.images.length > 1 ? (
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
                      // Paired images sit side by side at equal height and width;
                      // a leftover odd one below drops back to the default size.
                      aspect={isTrailingOdd ? DEFAULT_ASPECT : "square"}
                      className="w-full"
                      sizes={isTrailingOdd ? DEFAULT_SIZES : GRID_SIZES}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <CaseStudyImage
              src={item.images[0]}
              alt={item.heading}
              label={`Solution screenshot — 800×600 (${item.heading})`}
              aspect={DEFAULT_ASPECT}
              parallax
              className="w-full"
              sizes={DEFAULT_SIZES}
            />
          )}
          <ProseHtml html={item.html} />
        </div>
      ))}
    </div>
  );
}
