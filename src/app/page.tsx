"use client";

import { useState, useMemo, useEffect } from "react";
import { ParameterForm } from "@/components/ozone-sense/parameter-form";
import { ScheduleManager } from "@/components/ozone-sense/schedule-manager";
import { ConcentrationChart } from "@/components/ozone-sense/concentration-chart";
import { ConcentrationTable } from "@/components/ozone-sense/concentration-table";
import { simulateOzone, ScheduleItem } from "@/lib/ozone-logic";
import { Shield, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULTS = {
  volume: 50,
  rate: 15000,
  halfLife: 30,
  safeLimit: 0.2,
  dangerousLimit: 5.0,
  schedule: [] as ScheduleItem[],
};

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [volume, setVolume] = useState(DEFAULTS.volume);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [halfLife, setHalfLife] = useState(DEFAULTS.halfLife);
  const [safeLimit, setSafeLimit] = useState(DEFAULTS.safeLimit);
  const [dangerousLimit, setDangerousLimit] = useState(DEFAULTS.dangerousLimit);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULTS.schedule);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ozonesense-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.volume !== undefined) setVolume(parsed.volume);
        if (parsed.rate !== undefined) setRate(parsed.rate);
        if (parsed.halfLife !== undefined) setHalfLife(parsed.halfLife);
        if (parsed.safeLimit !== undefined) setSafeLimit(parsed.safeLimit);
        if (parsed.dangerousLimit !== undefined) setDangerousLimit(parsed.dangerousLimit);
        if (parsed.schedule !== undefined) setSchedule(parsed.schedule);
      } catch (e) {
        console.error("Failed to parse saved settings", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever values change
  useEffect(() => {
    if (!isInitialized) return;
    const settings = { volume, rate, halfLife, safeLimit, dangerousLimit, schedule };
    localStorage.setItem("ozonesense-settings", JSON.stringify(settings));
  }, [volume, rate, halfLife, safeLimit, dangerousLimit, schedule, isInitialized]);

  const handleReset = () => {
    setVolume(DEFAULTS.volume);
    setRate(DEFAULTS.rate);
    setHalfLife(DEFAULTS.halfLife);
    setSafeLimit(DEFAULTS.safeLimit);
    setDangerousLimit(DEFAULTS.dangerousLimit);
    setSchedule(DEFAULTS.schedule);
  };

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
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="rounded-full border-primary/20 hover:bg-primary/5 text-primary/70"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Defaults
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-primary/5">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-primary/80">Simulation Active</span>
            </div>
          </div>
        </header>

        {/* Inputs section */}
        <section className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ParameterForm
              volume={volume}
              setVolume={setVolume}
              rate={rate}
              setRate={setRate}
              halfLife={halfLife}
              setHalfLife={setHalfLife}
              safeLimit={safeLimit}
              setSafeLimit={setSafeLimit}
              dangerousLimit={dangerousLimit}
              setDangerousLimit={setDangerousLimit}
              onReset={handleReset}
            />
          </div>
          <div className="lg:col-span-5">
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

          <section className="space-y-8">
            <ConcentrationChart 
              data={results} 
              safeLimit={safeLimit} 
              dangerousLimit={dangerousLimit}
            />
            <ConcentrationTable 
              data={results} 
              safeLimit={safeLimit} 
              dangerousLimit={dangerousLimit}
            />
          </section>
        </div>

        {/* Footer / Info */}
        <footer className="pt-12 text-center border-t border-primary/5">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-1.5">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 shrink-0" />
              Ozone calculation assumes uniform distribution in the specified volume.
            </span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            © {new Date().getFullYear()} OzoneSense Environmental Analytics
          </p>
        </footer>
      </div>
    </div>
  );
}
