"use client"

import { STACK_ITEMS } from "@/lib/stack"

/**
 * One-click chips for the technologies of the public stack (lib/stack.ts).
 * Works on the comma-separated string used by the project forms.
 */
export function TechSuggestions({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const current = value.split(",").map((t) => t.trim()).filter(Boolean)
  const has = (name: string) => current.some((t) => t.toLowerCase() === name.toLowerCase())

  const toggle = (name: string) => {
    const next = has(name) ? current.filter((t) => t.toLowerCase() !== name.toLowerCase()) : [...current, name]
    onChange(next.join(", "))
  }

  return (
    <div className="flex flex-wrap gap-1.5 pt-2">
      {STACK_ITEMS.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => toggle(name)}
          aria-pressed={has(name)}
          className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
            has(name)
              ? "border-transparent bg-zinc-900 text-white dark:bg-white dark:text-[#0e0e0e]"
              : "border-zinc-200 text-zinc-500 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
