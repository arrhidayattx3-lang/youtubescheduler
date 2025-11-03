"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PlayCircle,
  Video,
  LayoutDashboard,
  CalendarDays,
  GalleryHorizontal,
  Image as ImageIcon,
  KeyRound,
  Bot,
  Activity,
  HardDrive,
  Gauge,
  Wifi,
  Settings2,
  Clock3,
  UserCircle,
  Zap
} from "lucide-react";

// ===== Komponen kecil =====
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const formatted = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return { formatted, date };
}

function Donut({ value, size = 160, stroke = 14, label, sublabel, accent = "#22d3ee" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.max(0.01, (value / 100) * c);
  const gap = c - dash;
  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#0f172a" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={accent}
          strokeLinecap="round"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${gap}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="-mt-20 text-center">
        <div className="text-3xl font-semibold text-slate-50">{value.toFixed(1)}%</div>
        {sublabel && <div className="text-xs text-slate-400 mt-1">{sublabel}</div>}
        {label && <div className="text-sm text-slate-300 mt-1">{label}</div>}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, badge }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 hover:bg-slate-800 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-slate-300 text-xs">{label}</div>
          <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
        </div>
        <div className="h-10 w-10 rounded-xl bg-slate-700/70 flex items-center justify-center">
          <Icon className="h-5 w-5 text-slate-200" />
        </div>
      </div>
      {badge && <div className="mt-2 text-[11px] text-slate-400">{badge}</div>}
    </div>
  );
}

// ===== Tampilan utama =====
export default function Page() {
  const { formatted, date } = useClock();
  const [metrics, setMetrics] = useState({ cpu: 47.1, mem: 91.8, disk: 90.4, down: 2.25, up: 1.28 });

  useEffect(() => {
    const id = setInterval(() => {
      setMetrics((m) => ({
        cpu: clamp(jitter(m.cpu, 0.9), 5, 98),
        mem: clamp(jitter(m.mem, 0.6), 10, 99),
        disk: clamp(jitter(m.disk, 0.5), 5, 99),
        down: Math.max(0.1, jitter(m.down, 0.1)),
        up: Math.max(0.05, jitter(m.up, 0.06)),
      }));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const menu = useMemo(
    () => [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Jadwal", icon: CalendarDays },
      { label: "Live Streaming", icon: PlayCircle },
      { label: "Video Gallery", icon: GalleryHorizontal },
      { label: "Thumbnails", icon: ImageIcon },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-red-600 flex items-center justify-center">
            <PlayCircle className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold">Private YouTube Scheduler</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold">{formatted}</div>
            <div className="text-xs text-slate-400">{date}</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {menu.map((m) => (
          <button
            key={m.label}
            className="flex flex-col items-center justify-center bg-slate-800/60 border border-slate-700 rounded-xl p-3 hover:bg-slate-800 transition"
          >
            <m.icon className="h-5 w-5 mb-1 text-slate-200" />
            <span className="text-xs">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Stat icon={CalendarDays} label="Total Jadwal" value={1} />
        <Stat icon={Activity} label="Live Sekarang" value={0} />
        <Stat icon={Video} label="Video Library" value={1} />
        <Stat icon={Clock3} label="Durasi Hari Ini" value="7 min" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Donut value={metrics.cpu} label="CPU Usage" accent="#38bdf8" />
        <Donut value={metrics.mem} label="Memory Usage" accent="#f472b6" />
        <Donut value={metrics.disk} label="Disk Usage" accent="#22d3ee" />
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
            <Wifi className="h-4 w-4" /> Network Speed
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-semibold">{metrics.down.toFixed(2)} KB/s</div>
              <div className="text-xs text-slate-400">Download</div>
            </div>
            <div>
              <div className="text-3xl font-semibold">{metrics.up.toFixed(2)} KB/s</div>
              <div className="text-xs text-slate-400">Upload</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function jitter(value, spread = 0.5) {
  return value + (Math.random() - 0.5) * spread * 2;
}
function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
