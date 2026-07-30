"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  period?: string
  icon: React.ElementType
  iconColor?: string
  sparklineData?: number[]
  description?: string
}

export function KpiCard({
  title,
  value,
  change,
  trend = "up",
  period = "ce mois",
  icon: Icon,
  iconColor = "text-indigo-500 bg-indigo-500/10",
  sparklineData = [12, 18, 15, 24, 30, 28, 36],
  description,
}: KpiCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
    >
      {/* Top row: Icon & Trend */}
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconColor} border border-current/10 shrink-0`}>
          <Icon className="h-5 w-5" />
        </div>

        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
              trend === "up"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : trend === "down"
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : trend === "down" ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Title & Large Value */}
      <div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1 tracking-tight">
          {value}
        </h3>
      </div>

      {/* Bottom Sparkline & Subtext */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
        <span className="text-[11px] text-zinc-400 font-medium truncate">
          {description || `vs. ${period}`}
        </span>

        {/* Mini SVG Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-16 h-5 shrink-0 opacity-80">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 60 20">
              <path
                d={sparklineData.reduce(
                  (acc, val, idx) =>
                    `${acc} ${idx === 0 ? "M" : "L"} ${(idx / (sparklineData.length - 1)) * 60} ${
                      20 - (val / Math.max(...sparklineData, 1)) * 16
                    }`,
                  ""
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={trend === "up" ? "text-emerald-500" : "text-indigo-500"}
              />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  )
}
