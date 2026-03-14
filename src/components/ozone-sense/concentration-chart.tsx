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
import { TrendingUp } from "lucide-react";

interface ConcentrationChartProps {
  data: SimulationPoint[];
  safeLimit: number;
}

export function ConcentrationChart({ data, safeLimit }: ConcentrationChartProps) {
  const chartData = data.map((d) => ({
    timeHours: parseFloat((d.time / 60).toFixed(2)),
    concentration: parseFloat(d.concentration.toFixed(3)),
    active: d.active ? 1 : 0,
  }));

  return (
    <Card className="shadow-lg border-none bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-headline">
          <TrendingUp className="w-5 h-5 text-accent" />
          Concentration Trend
        </CardTitle>
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
                label={{ value: 'Time (hours)', position: 'insideBottomRight', offset: -10 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ value: 'mg/m³', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} mg/m³`, 'Concentration']}
                labelFormatter={(label) => `Time: ${label} h`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <ReferenceLine y={safeLimit} label="Safe Limit" stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="concentration"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorConc)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
