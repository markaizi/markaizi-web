import Link from "next/link";

export interface BreadcrumbLink {
  name: string;
  path?: string; // son adımda path verilmez (mevcut sayfa)
}

export default function Breadcrumb({ items, className = "" }: { items: BreadcrumbLink[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-[13px] text-[#8a8a9a] mb-6 ${className}`}>
      {items.map((item, i) => (
        <span key={item.name} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden="true" className="opacity-40">/</span>}
          {item.path ? (
            <Link href={item.path} className="hover:text-white transition-colors">
              {item.name}
            </Link>
          ) : (
            <span className="text-white" aria-current="page">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
