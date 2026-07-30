"use client"

import * as React from "react"
import { ChevronDown, Calendar, Filter, Sparkles, Loader2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const YEARS = [2026, 2025, 2024, 2023, 2022]
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

interface ContributionDay {
  dateStr: string
  formattedDate: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
  dayOfWeek: number
  month: number
  year: number
  inSelectedPeriod: boolean
}

interface MonthLabelPosition {
  name: string
  colIndex: number
}

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}

function getLevelBgColor(level: 0 | 1 | 2 | 3 | 4): string {
  switch (level) {
    case 0:
      return "bg-[#161b22] border border-white/5"
    case 1:
      return "bg-[#0e4429]"
    case 2:
      return "bg-[#006d32]"
    case 3:
      return "bg-[#26a641]"
    case 4:
      return "bg-[#39d353]"
  }
}

interface Props {
  initialYear?: number
  externalData?: Record<string, number>
}

export function GithubContributionGraph({
  initialYear = 2026,
  externalData,
}: Props) {
  const [selectedYear, setSelectedYear] = React.useState<number>(initialYear)
  const [includePrivate, setIncludePrivate] = React.useState(true)
  const [showOverview, setShowOverview] = React.useState(true)
  const [minLevelFilter, setMinLevelFilter] = React.useState<number>(0)
  const [fetchedDataMap, setFetchedDataMap] = React.useState<Record<string, number>>({})
  const [loading, setLoading] = React.useState<boolean>(false)

  // Fetch real GitHub contribution data from API whenever year changes
  React.useEffect(() => {
    setLoading(true)
    fetch(`/api/github?year=${selectedYear}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.contributions && typeof data.contributions === "object") {
          setFetchedDataMap(data.contributions)
        }
      })
      .catch((err) => console.warn("Failed to fetch contribution data:", err))
      .finally(() => setLoading(false))
  }, [selectedYear])

  // Merge externalData with fetchedDataMap
  const activeDataMap = React.useMemo(() => {
    if (Object.keys(fetchedDataMap).length > 0) {
      return fetchedDataMap
    }
    return externalData || {}
  }, [fetchedDataMap, externalData])

  // Generate 53 weeks matrix for the selected year
  const { weeks, monthLabels, totalContributions } = React.useMemo(() => {
    let startDate: Date
    let endDate: Date

    const today = new Date()
    const isCurrentOrLast = selectedYear === 2026

    if (isCurrentOrLast) {
      endDate = new Date(today)
      const dayOffset = 6 - endDate.getDay()
      endDate.setDate(endDate.getDate() + dayOffset)

      startDate = new Date(endDate)
      startDate.setDate(startDate.getDate() - 52 * 7)
      startDate.setDate(startDate.getDate() - startDate.getDay())
    } else {
      startDate = new Date(selectedYear, 0, 1)
      startDate.setDate(startDate.getDate() - startDate.getDay())

      endDate = new Date(selectedYear, 11, 31)
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
    }

    const weeksList: ContributionDay[][] = []
    const months: MonthLabelPosition[] = []
    let totalCount = 0

    let currentDate = new Date(startDate)
    let currentWeek: ContributionDay[] = []
    let colIndex = 0
    let lastMonthSeen = -1

    while (currentDate <= endDate) {
      const yearNum = currentDate.getFullYear()
      const monthNum = currentDate.getMonth()
      const dateNum = currentDate.getDate()
      const dayOfWeek = currentDate.getDay()

      const yyyy = yearNum
      const mm = String(monthNum + 1).padStart(2, "0")
      const dd = String(dateNum).padStart(2, "0")
      const dateStr = `${yyyy}-${mm}-${dd}`

      const formattedDate = currentDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })

      const inSelectedPeriod = isCurrentOrLast
        ? currentDate <= today
        : yearNum === selectedYear

      let count = 0
      if (inSelectedPeriod) {
        count = activeDataMap[dateStr] ?? 0
        if (!includePrivate) {
          count = Math.floor(count * 0.7)
        }
        totalCount += count
      }

      const rawLevel = getLevel(count)
      const effectiveLevel = rawLevel >= minLevelFilter ? rawLevel : 0

      const dayObj: ContributionDay = {
        dateStr,
        formattedDate,
        count: effectiveLevel === 0 && minLevelFilter > 0 ? 0 : count,
        level: effectiveLevel,
        dayOfWeek,
        month: monthNum,
        year: yearNum,
        inSelectedPeriod,
      }

      if (dayOfWeek === 1 || currentWeek.length === 0) {
        if (monthNum !== lastMonthSeen) {
          const lastMonthPos = months[months.length - 1]
          if (!lastMonthPos || colIndex - lastMonthPos.colIndex >= 3) {
            months.push({
              name: MONTH_NAMES[monthNum],
              colIndex,
            })
            lastMonthSeen = monthNum
          }
        }
      }

      currentWeek.push(dayObj)

      if (currentWeek.length === 7) {
        weeksList.push(currentWeek)
        currentWeek = []
        colIndex++
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    if (currentWeek.length > 0) {
      weeksList.push(currentWeek)
    }

    return {
      weeks: weeksList,
      monthLabels: months,
      totalContributions: totalCount,
    }
  }, [selectedYear, activeDataMap, includePrivate, minLevelFilter])

  const headingText =
    selectedYear === 2026
      ? `${totalContributions.toLocaleString("en-US")} contributions in the last year`
      : `${totalContributions.toLocaleString("en-US")} contributions in ${selectedYear}`

  return (
    <TooltipProvider delayDuration={100}>
      <div className="w-full space-y-4 font-sans">
        {/* Top Year Filter Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1117]/80 border border-[#30363d] p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Filtre d'Années :
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {YEARS.map((year) => {
              const isSelected = selectedYear === year
              return (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-[#1f6feb] text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-400/40"
                      : "bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d]"
                  }`}
                >
                  {year === 2026 ? "2026 (Dernière année)" : year}
                </button>
              )
            })}
          </div>
        </div>

        {/* Full Width Main Grid Container with Side Buttons */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full">
          {/* Main Card - Expanded Full Width */}
          <div className="flex-1 w-full bg-[#0d1117] border border-[#30363d] rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl relative">
            {/* Header line inside card */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#21262d]">
              <div className="flex items-center gap-3">
                <h3 className="text-base sm:text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  {headingText}
                </h3>
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Level Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center gap-1.5 text-xs text-zinc-300 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] px-3 py-1.5 rounded-lg transition-all outline-none font-medium">
                      <Filter className="h-3.5 w-3.5 text-blue-400" />
                      Filtre d'intensité
                      <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-[#161b22] border-[#30363d] text-zinc-200"
                  >
                    <DropdownMenuLabel className="text-xs text-zinc-400 font-medium">
                      Seuil de contributions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#30363d]" />
                    <DropdownMenuCheckboxItem
                      checked={minLevelFilter === 0}
                      onCheckedChange={() => setMinLevelFilter(0)}
                      className="text-xs cursor-pointer focus:bg-[#21262d] focus:text-white"
                    >
                      Toutes les contributions
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={minLevelFilter === 2}
                      onCheckedChange={() =>
                        setMinLevelFilter(minLevelFilter === 2 ? 0 : 2)
                      }
                      className="text-xs cursor-pointer focus:bg-[#21262d] focus:text-white"
                    >
                      Moyennes & Fortes (&gt; 3)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={minLevelFilter === 3}
                      onCheckedChange={() =>
                        setMinLevelFilter(minLevelFilter === 3 ? 0 : 3)
                      }
                      className="text-xs cursor-pointer focus:bg-[#21262d] focus:text-white"
                    >
                      Fortes contributions (&gt; 6)
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Contribution settings Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] px-3 py-1.5 rounded-lg transition-all outline-none font-medium">
                      Contribution settings
                      <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-[#161b22] border-[#30363d] text-zinc-200"
                  >
                    <DropdownMenuLabel className="text-xs text-zinc-400 font-medium">
                      Graph preferences
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#30363d]" />
                    <DropdownMenuCheckboxItem
                      checked={includePrivate}
                      onCheckedChange={setIncludePrivate}
                      className="text-xs cursor-pointer focus:bg-[#21262d] focus:text-white"
                    >
                      Private contributions
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={showOverview}
                      onCheckedChange={setShowOverview}
                      className="text-xs cursor-pointer focus:bg-[#21262d] focus:text-white"
                    >
                      Activity overview
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* FULL WIDTH Responsive Heatmap Container */}
            <div className="w-full overflow-x-auto pb-2 pt-2 select-none scrollbar-thin scrollbar-thumb-zinc-800">
              <div className="w-full min-w-[720px]">
                {/* Month Labels Header Row */}
                <div className="relative w-full h-5 text-[11px] text-[#8b949e] pl-8 pr-1 mb-1">
                  {monthLabels.map((m, idx) => {
                    const leftPercent = (m.colIndex / weeks.length) * 100
                    return (
                      <span
                        key={`${m.name}-${idx}`}
                        className="absolute tracking-wider font-medium"
                        style={{ left: `calc(${leftPercent}% + 32px)` }}
                      >
                        {m.name}
                      </span>
                    )
                  })}
                </div>

                {/* Grid layout spanning 100% of container width */}
                <div className="flex items-start w-full">
                  {/* Left Day Labels (Mon, Wed, Fri) */}
                  <div className="grid grid-rows-7 text-[10px] text-[#8b949e] pr-2 text-right font-mono select-none shrink-0 w-8 gap-[3px] py-[1px]">
                    <span className="h-3 sm:h-3.5 leading-3"></span>
                    <span className="h-3 sm:h-3.5 leading-3">Mon</span>
                    <span className="h-3 sm:h-3.5 leading-3"></span>
                    <span className="h-3 sm:h-3.5 leading-3">Wed</span>
                    <span className="h-3 sm:h-3.5 leading-3"></span>
                    <span className="h-3 sm:h-3.5 leading-3">Fri</span>
                    <span className="h-3 sm:h-3.5 leading-3"></span>
                  </div>

                  {/* Weeks columns stretched evenly across 100% width */}
                  <div className="flex-1 flex justify-between gap-[3px] sm:gap-[4px] w-full">
                    {weeks.map((week, wIdx) => (
                      <div
                        key={wIdx}
                        className="flex-1 grid grid-rows-7 gap-[3px] sm:gap-[4px]"
                      >
                        {week.map((day, dIdx) => {
                          const bgClass = getLevelBgColor(day.level)
                          const opacityClass = day.inSelectedPeriod
                            ? "opacity-100"
                            : "opacity-25"

                          const tooltipLabel =
                            day.count === 0
                              ? `No contributions on ${day.formattedDate}`
                              : `${day.count} ${
                                  day.count === 1
                                    ? "contribution"
                                    : "contributions"
                                } on ${day.formattedDate}`

                          return (
                            <Tooltip key={`${day.dateStr}-${dIdx}`}>
                              <TooltipTrigger asChild>
                                <div
                                  className={`w-full aspect-square max-w-[14px] rounded-[2px] ${bgClass} ${opacityClass} transition-all duration-150 hover:ring-2 hover:ring-white hover:z-20 cursor-pointer shadow-sm`}
                                />
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="bg-[#6e7681] text-white border-0 text-[11px] font-medium py-1 px-2.5 rounded shadow-xl z-50"
                              >
                                {tooltipLabel}
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer row inside Card */}
            <div className="flex items-center justify-between pt-3 text-[11px] text-[#8b949e] border-t border-[#21262d]">
              <a
                href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#58a6ff] hover:underline transition-colors flex items-center gap-1 font-medium"
              >
                Learn how we count contributions
              </a>

              <div className="flex items-center gap-2 font-medium">
                <span>Less</span>
                <div className="w-3 h-3 rounded-[2px] bg-[#161b22] border border-white/5" />
                <div className="w-3 h-3 rounded-[2px] bg-[#0e4429]" />
                <div className="w-3 h-3 rounded-[2px] bg-[#006d32]" />
                <div className="w-3 h-3 rounded-[2px] bg-[#26a641]" />
                <div className="w-3 h-3 rounded-[2px] bg-[#39d353]" />
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Side Year selector buttons */}
          <div className="flex flex-row lg:flex-col gap-1.5 w-full lg:w-32 shrink-0 overflow-x-auto">
            {YEARS.map((year) => {
              const isSelected = selectedYear === year
              return (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-center lg:text-left flex items-center justify-between ${
                    isSelected
                      ? "bg-[#1f6feb] text-white shadow-lg shadow-blue-600/30 border border-blue-400/40 translate-x-0 lg:translate-x-1"
                      : "bg-[#0d1117] text-[#8b949e] hover:text-zinc-100 hover:bg-[#161b22] border border-[#30363d]"
                  }`}
                >
                  <span>{year}</span>
                  {isSelected && (
                    <span className="hidden lg:inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
