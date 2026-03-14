export type ScheduleItem = {
  type: 'on' | 'off';
  duration: number;
};

export type SimulationPoint = {
  time: number; // minutes
  concentration: number; // mg/m3
  active: boolean;
};

export function simulateOzone(
  volume: number,
  ozonatorRate: number,
  halfLife: number,
  safeConcentration: number,
  schedule: ScheduleItem[]
): SimulationPoint[] {
  const points: SimulationPoint[] = [];
  const decayConstant = Math.log(2) / halfLife;
  const productionRatePerMin = ozonatorRate / 60; // mg/min

  let currentConcentration = 0;
  let currentTime = 0;

  // 1. Process the schedule (1-minute steps for precision)
  for (const item of schedule) {
    for (let i = 0; i < item.duration; i++) {
      points.push({
        time: currentTime,
        concentration: currentConcentration,
        active: item.type === 'on',
      });

      const production = item.type === 'on' ? productionRatePerMin / volume : 0;
      const decay = decayConstant * currentConcentration;
      
      currentConcentration = Math.max(0, currentConcentration + production - decay);
      currentTime++;
    }
  }

  // 2. Continue simulation until safe level is reached (up to a reasonable limit)
  const maxTime = 1440; // Max 24 hours to prevent infinite loop
  while (currentConcentration > safeConcentration && currentTime < maxTime) {
    points.push({
      time: currentTime,
      concentration: currentConcentration,
      active: false,
    });

    const decay = decayConstant * currentConcentration;
    currentConcentration = Math.max(0, currentConcentration - decay);
    currentTime++;
    
    // Safety break for very low half-lives or edge cases
    if (currentTime > 10000) break;
  }

  // Add the final point where it just hit the safe level or limit
  points.push({
    time: currentTime,
    concentration: currentConcentration,
    active: false,
  });

  return points;
}

export function getIntervalPoints(points: SimulationPoint[], interval: number = 30): SimulationPoint[] {
  return points.filter((p, index) => p.time % interval === 0);
}