"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wind, Box, Clock, ShieldCheck, AlertTriangle } from "lucide-react";

interface ParameterFormProps {
  volume: number;
  setVolume: (v: number) => void;
  rate: number;
  setRate: (r: number) => void;
  halfLife: number;
  setHalfLife: (h: number) => void;
  safeLimit: number;
  setSafeLimit: (s: number) => void;
  dangerousLimit: number;
  setDangerousLimit: (d: number) => void;
}

// Ozone (O3) Molecular weight = 48
// PPM = (mg/m3 * 24.45) / 48 at 25 degrees Celsius
const mgToPpm = (mg: number) => ((mg * 24.45) / 48).toFixed(3);

export function ParameterForm({
  volume,
  setVolume,
  rate,
  setRate,
  halfLife,
  setHalfLife,
  safeLimit,
  setSafeLimit,
  dangerousLimit,
  setDangerousLimit,
}: ParameterFormProps) {
  return (
    <Card className="shadow-lg border-none bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-headline">
          <Wind className="w-5 h-5 text-accent" />
          Environment Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Box className="w-4 h-4 text-primary/70" />
            Space Volume (m³)
          </Label>
          <Input
            type="number"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="border-primary/20 focus:ring-accent"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-primary/70" />
            Ozonator Rate (mg/h)
          </Label>
          <div className="flex items-center gap-4 h-10 px-3 border border-primary/20 rounded-md bg-white">
            <span className={`text-sm ${rate === 15000 ? 'font-bold text-primary' : 'text-muted-foreground'}`}>15k</span>
            <Switch
              checked={rate === 30000}
              onCheckedChange={(checked) => setRate(checked ? 30000 : 15000)}
            />
            <span className={`text-sm ${rate === 30000 ? 'font-bold text-primary' : 'text-muted-foreground'}`}>30k</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary/70" />
            Half-life (min)
          </Label>
          <Input
            type="number"
            value={halfLife}
            onChange={(e) => setHalfLife(Number(e.target.value))}
            className="border-primary/20 focus:ring-accent"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary/70" />
            Safe Limit (mg/m³)
          </Label>
          <Input
            type="number"
            step="0.01"
            value={safeLimit}
            onChange={(e) => setSafeLimit(Number(e.target.value))}
            className="border-primary/20 focus:ring-accent"
          />
          <p className="text-[10px] text-muted-foreground font-medium pl-1 italic">
            Reference: {mgToPpm(safeLimit)} ppm @ 25°C
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            Dangerous Level (mg/m³)
          </Label>
          <Input
            type="number"
            step="0.1"
            value={dangerousLimit}
            onChange={(e) => setDangerousLimit(Number(e.target.value))}
            className="border-destructive/20 focus:ring-destructive"
          />
          <p className="text-[10px] text-muted-foreground font-medium pl-1 italic">
            Reference: {mgToPpm(dangerousLimit)} ppm @ 25°C
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
