// Groups 3-hour forecast list into 5 daily entries (pick midday when possible)
export function toDaily(list = []) {
  const byDate = {};
  list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(item);
  });

  const days = Object.keys(byDate)
    .slice(0, 6) // includes today → we’ll skip today in UI, show next 5
    .map((date) => {
      const slots = byDate[date];
      // Pick the slot closest to 12:00 for icon/description; compute min/max temps
      const target = slots.reduce((best, cur) => {
        const hour = +cur.dt_txt.split(' ')[1].split(':')[0];
        const dist = Math.abs(12 - hour);
        return dist < best.dist ? { item: cur, dist } : best;
      }, { item: slots[0], dist: 99 }).item;

      const temps = slots.map(s => s.main.temp);
      const tMin = Math.min(...temps);
      const tMax = Math.max(...temps);

      return {
        date,
        icon: target.weather[0].icon,
        desc: target.weather[0].description,
        tMin, tMax
      };
    });

  // drop day 0 (today) for a forward-looking 5-day forecast
  return days.slice(1, 6);
}
