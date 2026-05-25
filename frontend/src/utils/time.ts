// utils/time.ts
export function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  const intervals: [number, string][] = [
    [60, "giây"],
    [3600, "phút"],
    [86400, "giờ"],
    [604800, "ngày"],
  ];

  if (seconds < 60) return `${seconds} giây trước`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;

  return `${Math.floor(seconds / 86400)} ngày trước`;
}
