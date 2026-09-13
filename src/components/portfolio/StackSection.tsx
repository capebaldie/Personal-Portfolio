import { stack } from "@/data/content";
import { BrandMark, hasMark } from "@/components/BrandMark";
import { Stagger } from "@/components/Stagger";
import { Meta } from "./PortfolioUI";

export function StackSection() {
  return (
    <div className="space-y-8">
      {stack.map((group) => (
        <div key={group.group}>
          <Meta>{group.group}</Meta>
          <Stagger
            className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 xl:grid-cols-4"
            itemClassName="stack-item raised flex items-center gap-2.5 border border-line p-2.5 text-sm"
            items={group.items.map((item) => ({
              key: item,
              mark: hasMark(item) ? <BrandMark name={item} size={18} /> : undefined,
              node: <span className={hasMark(item) ? "" : "pl-7"}>{item}</span>,
            }))}
          />
        </div>
      ))}
    </div>
  );
}
