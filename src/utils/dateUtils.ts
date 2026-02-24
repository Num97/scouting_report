export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

export function isOverdue(endTime: string): boolean {
  const now = new Date();
  const end = parseDate(endTime);
  return end < now;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}