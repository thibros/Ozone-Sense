"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import { SimulationPoint } from "@/lib/ozone-logic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

interface ConcentrationChartProps {
  data: SimulationPoint[];
  safeLimit: number;
  dangerousLimit: number;
}

export function ConcentrationChart({ data, safeLimit, dangerousLimit }: ConcentrationChartProps) {
  const [isLogScale, setIsLogScale] = useState(false);

  const { chartData, ticks } = useMemo(() => {
    const formattedData = data.map((d) => ({
      timeHours: d.time / 60,
      // For log scale, values <= 0 are problematic. We use a tiny epsilon.
      concentration: parseFloat(Math.max(0.001, d.concentration).toFixed(3)),
      active: d.active ? 1 : 0,
    }));

    const maxHour = formattedData.length > 0 ? formattedData[formattedData.length - 1].timeHours : 0;
    const tickArray = [];
    // Generate ticks every 0.5 hours
    for (let t = 0; t <= Math.ceil(maxHour * 2) / 2; t += 0.5) {
      tickArray.push(t);
    }

    return { chartData: formattedData, ticks: tickArray };
  }, [data]);

  return (
    <Card className="shadow-lg border-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-primary font-headline">
          <TrendingUp className="w-5 h-5 text-accent" />
          Concentration Trend
        </CardTitle>
        <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-primary/5">
          <Switch 
            id="log-scale" 
            checked={isLogScale} 
            onCheckedChange={setIsLogScale}
            className="data-[state=checked]:bg-accent"
          />
          <Label htmlFor="log-scale" className="text-xs font-semibold text-primary/70 cursor-pointer">
            Log Scale
          </Label>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="timeHours" 
                type="number"
                domain={[0, 'auto']}
                ticks={ticks}
                tickFormatter={(value) => `${value.toFixed(1)}h`}
                label={{ value: 'Time (h)', position: 'insideBottomRight', offset: -10 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                scale={isLogScale ? "log" : "auto"}
                domain={isLogScale ? [0.01, 'auto'] : [0, 'auto']}
                label={{ value: 'mg/m³', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
                allowDataOverflow={true}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} mg/m³`, 'Concentration']}
                labelFormatter={(label: number) => `Time: ${label.toFixed(2)} h`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <ReferenceLine 
                y={safeLimit} 
                label={{ value: `Safe (${safeLimit})`, position: "right", fontSize: 10, fill: "hsl(var(--accent))" }} 
                stroke="hsl(var(--accent))" 
                strokeDasharray="3 3" 
              />
              <ReferenceLine 
                y={dangerousLimit} 
                label={{ value: `Danger (${dangerousLimit})`, position: "right", fontSize: 10, fill: "hsl(var(--destructive))" }} 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="concentration"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorConc)"
                animationDuration={1500}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
