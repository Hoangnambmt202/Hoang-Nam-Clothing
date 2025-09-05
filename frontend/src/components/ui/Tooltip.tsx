"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side="top"
          sideOffset={5}
          className="rounded-md bg-black px-2 py-1 text-sm text-white shadow-md"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-black" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
