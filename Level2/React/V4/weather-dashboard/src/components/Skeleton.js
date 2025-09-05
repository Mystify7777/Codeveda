export default function Skeleton({ height = 16, radius = 10, style }) {
  return (
    <div
      className="skeleton"
      style={{ height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}
