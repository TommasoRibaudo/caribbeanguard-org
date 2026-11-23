/* Caribbean Guard's standing danger scale and a regional thunderstorm adjustment. */
(function (root) {
  "use strict";
  const beaches = Object.freeze({
    "cg:zone/playa-negra": 3, "cg:zone/salsa-brava": 2, "cg:zone/cocles": 4,
    "cg:zone/chiquita": 5, "cg:zone/punta-uva": 2,
    "cg:beach/playa-grande": 4, "cg:beach/manzanillo": 3
  });
  const colors = Object.freeze(["#247462", "#497329", "#875900", "#b14b1d", "#ad2439"]);
  const storms = new Set([95, 96, 97, 99]);
  const weatherCodes = new Set([0,1,2,3,45,48,51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,...storms]);
  const dayKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Costa_Rica", year: "numeric", month: "2-digit", day: "2-digit"
  });
  function outlook(hourly, fetchedAt, now = Date.now() / 1000, current) {
    const fresh = fetchedAt > 0 && fetchedAt <= now && now - fetchedAt <= 10800;
    const start = Math.floor(now / 3600) * 3600;
    const buckets = new Map();
    if (fresh && Array.isArray(hourly?.time)) {
      hourly.time.forEach((time, index) => {
        if (!Number.isFinite(time) || time < start || time >= start + 48 * 3600) return;
        const codes = buckets.get(time) || [];
        codes.push(hourly.weather_code?.[index]);
        buckets.set(time, codes);
      });
    }
    const currentStorm = fresh && current?.time <= now && now - current.time <= 3600
      && storms.has(current.weather_code);
    return [now, now + 86400].map((time, index) => {
      const key = dayKey.format(time * 1000);
      const slots = Array.from({length: 48}, (_, i) => start + i * 3600)
        .filter(hour => dayKey.format(hour * 1000) === key);
      const storm = (index === 0 && currentStorm)
        || slots.some(hour => buckets.get(hour)?.some(code => storms.has(code)));
      const complete = slots.length > 0 && slots.every(hour => {
        const codes = buckets.get(hour);
        return codes?.length === 1 && weatherCodes.has(codes[0]);
      });
      return {time, status: storm ? "storm" : complete ? "baseline" : "unknown"};
    });
  }
  function score(id, status) {
    const base = beaches[id];
    return base == null ? null : Math.min(5, base + (status === "storm" ? 1 : 0));
  }
  root.CGDanger = Object.freeze({beaches, colors, outlook, score});
})(globalThis);
