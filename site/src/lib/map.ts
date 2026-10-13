// The website packages the existing static map under its own /mapa route.
// An explicit environment override remains available for separate map previews.
export const MAP_URL = process.env.NEXT_PUBLIC_MAP_URL || "/mapa";
