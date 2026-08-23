export const TERMINAL_PANEL_MIN_VH = 24;
export const TERMINAL_PANEL_MAX_VH = 82;
export const TERMINAL_PANEL_STEP_VH = 8;
export const TERMINAL_PANEL_DEFAULT_VH = 46;

export function clampTerminalPanelHeight(vh: number) {
  return Math.min(TERMINAL_PANEL_MAX_VH, Math.max(TERMINAL_PANEL_MIN_VH, vh));
}

export function readStoredTerminalPanelHeight() {
  if (typeof window === "undefined") return TERMINAL_PANEL_DEFAULT_VH;
  const raw = window.localStorage.getItem("terminal-panel-height-vh");
  const parsed = raw ? Number(raw) : TERMINAL_PANEL_DEFAULT_VH;
  return clampTerminalPanelHeight(Number.isFinite(parsed) ? parsed : TERMINAL_PANEL_DEFAULT_VH);
}

export function storeTerminalPanelHeight(vh: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("terminal-panel-height-vh", String(clampTerminalPanelHeight(vh)));
}
