import { useMemo } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaFire } from "react-icons/fa";
import { getAllActivities } from "../utils/activityTracker";

const DAYS_TO_SHOW = 91; // ~13 weeks

export default function ActivityCalendar({ interviews = [] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Merge interview records + localStorage aptitude/coding activities
  const activityMap = useMemo(() => {
    const map = {};

    // ── Mock Interviews (from backend) ──
    interviews.forEach((iv) => {
      const d = new Date(iv.createdAt);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      map[key] = (map[key] || 0) + 1;
    });

    // ── Aptitude & Coding (from localStorage) ──
    getAllActivities().forEach((act) => {
      const d = new Date(act.createdAt);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      map[key] = (map[key] || 0) + 1;
    });

    return map;
  }, [interviews]);

  // Build grid of last DAYS_TO_SHOW days
  const days = useMemo(() => {
    return Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (DAYS_TO_SHOW - 1 - i));
      const key = d.toISOString().slice(0, 10);
      return { date: d, key, count: activityMap[key] || 0 };
    });
  }, [activityMap]);

  const totalSessions = days.reduce((s, d) => s + d.count, 0);
  const activeDays = days.filter((d) => d.count > 0).length;

  // ── Calculate Current Streak ──
  const currentStreak = useMemo(() => {
    let streak = 0;
    // Walk backwards from today
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [days]);

  const getCellColor = (count) => {
    if (count === 0) return "bg-slate-100 dark:bg-white/5 border-slate-200/60 dark:border-white/5";
    if (count === 1) return "bg-violet-200 dark:bg-violet-900/60 border-violet-300/60 dark:border-violet-700/40";
    if (count === 2) return "bg-violet-400 dark:bg-violet-700/80 border-violet-400/60 dark:border-violet-600/60";
    return "bg-violet-600 dark:bg-violet-500 border-violet-600/60 dark:border-violet-400/60";
  };

  // Group into weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, wIdx) => {
      const month = week[0]?.date.getMonth();
      if (month !== lastMonth) {
        labels.push({ wIdx, label: week[0].date.toLocaleString("default", { month: "short" }) });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FaCalendarAlt className="text-violet-500" /> Activity
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Last 13 weeks · Interviews, Aptitude & Coding</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span><span className="text-slate-900 dark:text-white font-black">{totalSessions}</span> sessions</span>
          <span><span className="text-slate-900 dark:text-white font-black">{activeDays}</span> active days</span>
          {/* Streak badge */}
          {currentStreak > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400">
              <FaFire className="text-orange-500" />
              <span className="font-black">{currentStreak}</span> day streak
            </span>
          )}
        </div>
      </div>

      {/* Month labels */}
      <div className="flex gap-1 mb-1 ml-0.5">
        {weeks.map((_, wIdx) => {
          const label = monthLabels.find((m) => m.wIdx === wIdx);
          return (
            <div key={wIdx} className="w-4 text-[9px] text-slate-400 dark:text-slate-500 font-bold leading-none">
              {label ? label.label : ""}
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex gap-1">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map((day, dIdx) => (
              <motion.div
                key={day.key}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (wIdx * 7 + dIdx) * 0.0015 }}
                title={`${day.date.toLocaleDateString("default", { month: "short", day: "numeric" })}: ${day.count} session${day.count !== 1 ? "s" : ""}`}
                className={`w-4 h-4 rounded-[3px] border cursor-default transition-all hover:scale-125 ${getCellColor(day.count)}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 dark:text-slate-500 font-bold">
        <span>Less</span>
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className={`w-4 h-4 rounded-[3px] border ${getCellColor(n)}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
