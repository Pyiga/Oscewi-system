"use client"

import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({
  config,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={className}
      style={
        {
          "--color-male": config.male.color,
          "--color-female": config.female.color,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

interface ChartTooltipProps {
  children: React.ReactNode
  content?: React.ReactNode
  cursor?: boolean
}

export function ChartTooltip({
  children,
  content,
  cursor = true,
  ...props
}: ChartTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface ChartTooltipContentProps {
  hideLabel?: boolean
}

export function ChartTooltipContent({
  hideLabel = false,
}: ChartTooltipContentProps) {
  return null
} 