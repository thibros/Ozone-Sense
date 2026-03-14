"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Trash2, CalendarRange, Power, PowerOff } from "lucide-react";
import { ScheduleItem } from "@/lib/ozone-logic";

interface ScheduleManagerProps {
  schedule: ScheduleItem[];
  setSchedule: (s: ScheduleItem[]) => void;
}

export function ScheduleManager({ schedule, setSchedule }: ScheduleManagerProps) {
  const [nextDuration, setNextDuration] = useState<number>(15);
  const [nextType, setNextType] = useState<'on' | 'off'>('on');

  const totalDuration = schedule.reduce((acc, item) => acc + item.duration, 0);

  const addItem = () => {
    if (totalDuration + nextDuration > 180) {
      alert("Maximum schedule duration is 180 minutes.");
      return;
    }
    setSchedule([...schedule, { type: nextType, duration: nextDuration }]);
  };

  const removeItem = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  return (
    <Card className="shadow-lg border-none bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-primary font-headline">
          <div className="flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-accent" />
            Ozonator Schedule
          </div>
          <span className="text-sm font-normal text-muted-foreground">
            {totalDuration} / 180 min
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2 w-full">
            <Label>Duration (min)</Label>
            <Input
              type="number"
              min={1}
              max={180 - totalDuration}
              value={nextDuration}
              onChange={(e) => setNextDuration(Number(e.target.value))}
              className="border-primary/20"
            />
          </div>
          <div className="flex-1 space-y-2 w-full">
            <Label>State</Label>
            <div className="flex gap-2 p-1 bg-muted rounded-md h-10">
              <Button
                variant={nextType === 'on' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setNextType('on')}
                className="flex-1"
              >
                ON
              </Button>
              <Button
                variant={nextType === 'off' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setNextType('off')}
                className="flex-1"
              >
                OFF
              </Button>
            </div>
          </div>
          <Button 
            onClick={addItem} 
            disabled={totalDuration >= 180}
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add State
          </Button>
        </div>

        <div className="space-y-2">
          {schedule.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg bg-muted/30">
              No states added. Ozonator is off by default.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 pl-3 pr-2 py-2 rounded-full border shadow-sm transition-all animate-in fade-in slide-in-from-left-2 ${
                    item.type === 'on' 
                      ? 'bg-primary/10 border-primary/20 text-primary' 
                      : 'bg-muted border-border text-muted-foreground'
                  }`}
                >
                  {item.type === 'on' ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                  <span className="text-sm font-medium">{item.duration}m</span>
                  <button
                    onClick={() => removeItem(index)}
                    className="p-1 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}