export function getBrowserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatDateTime(
  value: string | Date,
  timeZone?: string,
  options?: Intl.DateTimeFormatOptions
) {
  const date = typeof value === "string" ? new Date(value) : value;
  const hasCustomParts = Boolean(options && Object.keys(options).length > 0);
  const formatterOptions: Intl.DateTimeFormatOptions = hasCustomParts
    ? {
        timeZone,
        ...options
      }
    : {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone
      };

  return new Intl.DateTimeFormat("en-US", formatterOptions).format(date);
}

export function formatTimeRange(start: string, end: string, timeZone?: string) {
  return `${formatDateTime(start, timeZone, {
    hour: "numeric",
    minute: "2-digit"
  })} - ${formatDateTime(end, timeZone, {
    hour: "numeric",
    minute: "2-digit"
  })}`;
}

function getTimeZoneOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);

  const map = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  ) as Record<string, string>;

  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );

  return asUtc - date.getTime();
}

export function zonedDateTimeToUtc(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  const offset = getTimeZoneOffset(utcGuess, timeZone);

  return new Date(utcGuess.getTime() - offset);
}

export function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}
