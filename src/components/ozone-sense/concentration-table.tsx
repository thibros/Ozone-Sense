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
  dangerousLimit: number;
}

export function ConcentrationTable({ data, safeLimit, dangerousLimit }: ConcentrationTableProps) {
  // Use 30-minute intervals (0.5 hours)
  const intervals = getIntervalPoints(data, 30);
  
  // If we have a final point that's not a multiple of 30, add it
  if (data.length > 0) {
    const lastDataPoint = data[data.length - 1];
    const lastIntervalPoint = intervals[intervals.length - 1];
    if (lastDataPoint.time !== lastIntervalPoint.time) {
      intervals.push(lastDataPoint);
    }
  }

  // Split the intervals into two lists for side-by-side display to maximize space
  const midIndex = Math.ceil(intervals.length / 2);
  const leftColumn = intervals.slice(0, midIndex);
  const rightColumn = intervals.slice(midIndex);

  const StatusBadge = ({ concentration }: { concentration: number }) => {
    if (concentration >= dangerousLimit) {
      return (
        <Badge variant="destructive" className="bg-destructive text-destructive-foreground animate-pulse">
          Danger
        </Badge>
      );
    }
    if (concentration > safeLimit) {
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
          Elevated
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-accent/50 text-accent font-medium">
        Safe
      </Badge>
    );
  };

  const TableColumn = ({ items }: { items: SimulationPoint[] }) => (
    <div className="rounded-md border border-muted-foreground/10 overflow-hidden h-full">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-semibold text-primary">Time (h)</TableHead>
            <TableHead className="font-semibold text-primary">mg/m³</TableHead>
            <TableHead className="font-semibold text-primary">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((point) => (
            <TableRow key={point.time} className="hover:bg-primary/5 transition-colors">
              <TableCell className="font-medium text-muted-foreground">
                {(point.time / 60).toFixed(1)}h
              </TableCell>
              <TableCell className="font-mono text-primary">
                {point.concentration.toFixed(3)}
              </TableCell>
              <TableCell>
                <StatusBadge concentration={point.concentration} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card className="shadow-lg border-none bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-headline">
          <TableIcon className="w-5 h-5 text-accent" />
          Simulation Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <TableColumn items={leftColumn} />
          {rightColumn.length > 0 ? (
            <TableColumn items={rightColumn} />
          ) : (
            <div className="hidden md:flex items-center justify-center p-8 bg-muted/20 rounded-lg border border-dashed text-muted-foreground text-sm italic">
              Simulation completed in first column
            </div>
          )}
        </div>
        
        <div className="flex items-start gap-2 p-3 bg-muted/40 rounded-lg">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Logs display status at 0.5-hour intervals until environment returns to safe level ({safeLimit} mg/m³).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
