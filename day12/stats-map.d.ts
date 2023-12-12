declare module 'stats-map' {
  class StatsMap extends Map {
    readonly stats: { hits: number; misses: number };
  }
  export default StatsMap;
}
