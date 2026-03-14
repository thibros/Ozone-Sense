"use client";

import { SimulationPoint, getIntervalPoints } from "@/lib/ozone-logic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table as TableIcon, Info } from "lucide-react";

interface ConcentrationTableProps {
  data: SimulationPoint[];
  safeLimit: number;
}

export function ConcentrationTable({ data, safeLimit }: ConcentrationTableProps) {
  const intervals = getIntervalPoints(data, 30);

  return (
    <Card className="shadow-lg border-none bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-headline">
          <TableIcon className="w-5 h-5 text-accent" />
          Simulation Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-muted-foreground/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold text-primary">Time (min)</TableHead>
                <TableHead className="font-semibold text-primary">Concentration (mg/m³)</TableHead>
                <TableHead className="font-semibold text-primary">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intervals.map((point) => (
                <TableRow key={point.time} className="hover:bg-primary/5 transition-colors">
                  <TableCell className="font-medium text-muted-foreground">{point.time}</TableCell>
                  <TableCell className="font-mono text-primary">{point.concentration.toFixed(3)}</TableCell>
                  <TableCell>
                    {point.concentration <= safeLimit ? (
                      <Badge variant="outline" className="border-accent/50 text-accent font-medium">Safe</Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 font-medium">Elevated</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {/* Ensure final point is included if not a multiple of 30 */}
              {data.length > 0 && data[data.length - 1].time % 30 !== 0 && (
                 <TableRow className="bg-accent/5 hover:bg-accent/10 transition-colors">
                 <TableCell className="font-medium text-muted-foreground">{data[data.length - 1].time}</TableCell>
                 <TableCell className="font-mono text-primary">{data[data.length - 1].concentration.toFixed(3)}</TableCell>
                 <TableCell>
                    <Badge variant="outline" className="border-accent/50 text-accent font-medium">Safe Reached</Badge>
                 </TableCell>
               </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex items-start gap-2 p-3 bg-muted/40 rounded-lg">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Concentrations are updated at 1-minute intervals during calculation for high precision. 
            The table displays status at 30-minute intervals until the environment returns to a safe level ({safeLimit} mg/m³).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}