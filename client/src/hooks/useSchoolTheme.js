import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Lighten a hex color by mixing with white at a given ratio
function lighten(hex, ratio) {
  try {
    const { r, g, b } = hexToRgb(hex);
    const lr = Math.round(r + (255 - r) * ratio);
    const lg = Math.round(g + (255 - g) * ratio);
    const lb = Math.round(b + (255 - b) * ratio);
    return `#${lr.toString(16).padStart(2,'0')}${lg.toString(16).padStart(2,'0')}${lb.toString(16).padStart(2,'0')}`;
  } catch {
    return hex;
  }
}

// Darken a hex color
function darken(hex, ratio) {
  try {
    const { r, g, b } = hexToRgb(hex);
    const dr = Math.round(r * (1 - ratio));
    const dg = Math.round(g * (1 - ratio));
    const db = Math.round(b * (1 - ratio));
    return `#${dr.toString(16).padStart(2,'0')}${dg.toString(16).padStart(2,'0')}${db.toString(16).padStart(2,'0')}`;
  } catch {
    return hex;
  }
}

function applyTheme({ primary_color, secondary_color }) {
  const root = document.documentElement;
  root.style.setProperty('--brand',       primary_color);
  root.style.setProperty('--brand-dark',  secondary_color || darken(primary_color, 0.15));
  root.style.setProperty('--brand-light', lighten(primary_color, 0.7));
  root.style.setProperty('--brand-bg',    lighten(primary_color, 0.88));
}

function resetTheme() {
  const root = document.documentElement;
  root.style.removeProperty('--brand');
  root.style.removeProperty('--brand-dark');
  root.style.removeProperty('--brand-light');
  root.style.removeProperty('--brand-bg');
}

export function useSchoolTheme(school) {
  // school is the domain e.g. "mit.edu"
  const { data } = useQuery({
    queryKey: ['school-theme', school],
    queryFn: () => api.get(`/schools/${school}/theme`).then(r => r.data),
    enabled: !!school,
    staleTime: Infinity, // Cache forever in session
  });

  useEffect(() => {
    if (data?.primary_color) {
      applyTheme(data);
    }
    return () => resetTheme();
  }, [data]);
}
