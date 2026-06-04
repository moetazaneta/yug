import { Text, View } from "react-native";

import { withAlpha } from "../entries/entries-utils";

const CHART_LABELS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

export function MonthlyAreaChart({
  accent,
  counts,
  width,
}: {
  accent: string;
  counts: number[];
  width: number;
}) {
  const height = 126;
  const maxValue = Math.max(...counts, 1);
  const step = width / (counts.length - 1);
  const points = counts.map((count, index) => ({
    x: index * step,
    y: height - (count / maxValue) * (height - 10),
  }));

  return (
    <View>
      <View style={{ height, width }}>
        {Array.from({ length: 7 }).map((_, rowIndex) =>
          Array.from({ length: 12 }).map((__, columnIndex) => (
            <View
              key={`${rowIndex}-${columnIndex}`}
              className="absolute size-1 rounded-full bg-neutral-200 dark:bg-neutral-800"
              style={{
                left: columnIndex * (width / 11),
                top: rowIndex * (height / 6),
              }}
            />
          )),
        )}
        {points.map((point, index) => (
          <View
            key={`area-${index}`}
            className="absolute bottom-0"
            style={{
              backgroundColor: withAlpha(accent, "20"),
              height: height - point.y,
              left: Math.max(point.x - step / 2, 0),
              width: index === 0 || index === points.length - 1 ? step / 2 : step,
            }}
          />
        ))}
        {points.map((point, index) => {
          const nextPoint = points[index + 1];

          if (!nextPoint) {
            return null;
          }

          const lineWidth = Math.hypot(nextPoint.x - point.x, nextPoint.y - point.y);
          const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);

          return (
            <View
              key={`line-${index}`}
              className="absolute h-[3px] rounded-full"
              style={{
                backgroundColor: accent,
                left: point.x,
                top: point.y,
                transform: [{ rotateZ: `${angle}rad` }],
                transformOrigin: "left center",
                width: lineWidth,
              }}
            />
          );
        })}
      </View>
      <View className="mt-1 flex-row justify-between" style={{ width }}>
        {CHART_LABELS.map((label) => (
          <Text key={label} className="text-xs text-neutral-500 dark:text-neutral-400">
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
