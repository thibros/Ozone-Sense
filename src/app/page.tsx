"use client";

import { useState, useMemo } from "react";
import { ParameterForm } from "@/components/ozone-sense/parameter-form";
import { ScheduleManager } from "@/components/ozone-sense/schedule-manager";
import { ConcentrationChart } from "@/components/ozone-sense/concentration-chart";
import { ConcentrationTable } from "@/components/ozone-sense/concentration-table";
import { simulateOzone, ScheduleItem } from "@/lib/ozone-logic";
import { Shield, Info } from "lucide-react";

export default function Home() {
  const [volume, setVolume] = useState(50);
  const [rate, setRate] = useState(15000);
  const [halfLife, setHalfLife] = useState(30);
  const [safeLimit, setSafeLimit] = useState(0.2);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  const results = useMemo(() => {
    return simulateOzone(volume, rate, halfLife, safeLimit, schedule);
  }, [volume, rate, halfLife, safeLimit, schedule]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/10 pb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-primary font-headline flex items-center gap-3">
              <Shield className="w-10 h-10 text-accent" />
              OzoneSense
            </h1>
            <p className="text-muted-foreground text-lg">
              Precise environmental ozone concentration modeling
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-primary/5">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-primary/80">Active Simulation Engine</span>
          </div>
        </header>

        {/* Inputs section */}
        <section className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ParameterForm
              volume={volume}
              setVolume={setVolume}
              rate={rate}
              setRate={setRate}
              halfLife={halfLife}
              setHalfLife={setHalfLife}
              safeLimit={safeLimit}
              setSafeLimit={setSafeLimit}
            />
          </div>
          <div className="lg:col-span-4">
            <ScheduleManager 
              schedule={schedule} 
              setSchedule={setSchedule} 
            />
          </div>
        </section>

        {/* Visualization section */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-2 mb-2">
             <div className="h-px bg-primary/10 flex-1" />
             <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">Analysis Results</span>
             <div className="h-px bg-primary/10 flex-1" />
          </div>

          <section className="grid gap-6 lg:grid-cols-2">
            <ConcentrationChart data={results} safeLimit={safeLimit} />
            <ConcentrationTable data={results} safeLimit={safeLimit} />
          </section>
        </div>

        {/* Footer / Info */}
        <footer className="pt-12 text-center border-t border-primary/5">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-1.5">
            <Info className="w-4 h-4" />
            Ozone calculation assumes uniform distribution in the specified volume.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            © {new Date().getFullYear()} OzoneSense Environmental Analytics
          </p>
        </footer>
      </div>
    </div>
  );
}