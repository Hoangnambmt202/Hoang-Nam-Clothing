"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { BREADCRUMB_MAP } from "@/config/breadcrumb.config";

type BreadcrumbItem = {
  label: string;
  href: string;
};

// function resolveLabel(segment: string): string | null {
//   // UUID / ObjectId / number
//   if (/^[0-9a-fA-F-]{8,}$/.test(segment)) return null;
//   return BREADCRUMB_MAP[segment] ?? segment;
// }

export default function Breadcrumbs() {
  const segments = useSelectedLayoutSegments();

  const fullSegments = ["admin", ...segments];
  const breadcrumbs = fullSegments
    .map((segment, index) => {
      // Bỏ qua UUID / id
      if (/^[0-9a-fA-F-]{8,}$/.test(segment)) return null;

      const label = BREADCRUMB_MAP[segment] ?? segment;

      const href = "/" + fullSegments.slice(0, index + 1).join("/");

      return { label, href };
    })
    .filter((item): item is { label: string; href: string } => Boolean(item));

  return (
    <nav className="flex items-center text-sm mb-4">
      <Link href="/admin" className="text-gray-500 hover:text-gray-700">
        Home
      </Link>

      {breadcrumbs.map((item, index) => (
        <span key={item.href} className="flex items-center">
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          {index === breadcrumbs.length - 1 ? (
            <span className="font-semibold text-gray-900">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-gray-700"
            >
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
