export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return dateString;
  }
}

export function formatFullDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatScore(score: number): {
  percent: string;
  label: 'Very High' | 'High' | 'Moderate' | 'Low';
  color: string;
  bgColor: string;
} {
  const clamped = Math.min(100, Math.max(0, Math.round(score)));
  if (clamped >= 85) {
    return {
      percent: `${clamped}%`,
      label: 'Very High',
      color: '#10B981',
      bgColor: '#D1FAE5',
    };
  }
  if (clamped >= 70) {
    return {
      percent: `${clamped}%`,
      label: 'High',
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    };
  }
  if (clamped >= 50) {
    return {
      percent: `${clamped}%`,
      label: 'Moderate',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    };
  }
  return {
    percent: `${clamped}%`,
    label: 'Low',
    color: '#64748B',
    bgColor: '#F1F5F9',
  };
}

export function formatDistance(km?: number): string {
  if (km === undefined || km === null) return 'Nearby';
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }
  return `${km.toFixed(1)} km away`;
}
