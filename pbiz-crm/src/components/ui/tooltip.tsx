"use client";

import * as React from "react";
import { Tooltip as RadixTooltip } from "radix-ui";
import { cn } from "@/lib/utils";

const { Provider, Root, Trigger, Content } = RadixTooltip;

function TooltipProvider({ children, ...props }: React.ComponentProps<typeof Provider>) {
  return <Provider data-slot="tooltip-provider" {...props}>{children}</Provider>;
}

function Tooltip({ ...props }: React.ComponentProps<typeof Root>) {
  return <Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof Trigger>) {
  return <Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({ className, sideOffset = 4, children, ...props }: React.ComponentProps<typeof Content>) {
  return (
    <Content
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 z-50 w-fit rounded-md px-3 py-1.5 text-xs",
        className
      )}
      {...props}
    >
      {children}
    </Content>
  );
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
