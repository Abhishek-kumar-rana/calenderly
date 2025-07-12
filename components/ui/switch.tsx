"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "data-[state=checked]:bg-black data-[state=unchecked]:bg-blue-300 inline-flex h-[20px] w-[40px] items-center rounded-full transition-colors",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className="block h-[16px] w-[16px] translate-x-1 rounded-full bg-white transition-transform data-[state=checked]:translate-x-5"
      />
    </SwitchPrimitive.Root>
  )
}
