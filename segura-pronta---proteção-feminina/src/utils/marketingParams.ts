const STORAGE_KEY = 'segura_pronta_marketing_params_v1';

/**
 * Captura query string atual, mescla com o que já estava salvo na sessão
 * e reescreve a URL (replaceState) para os scripts (ex.: UTMify) enxergarem os parâmetros em qualquer "página" da SPA.
 */
export function initMarketingParams(): void {
  if (typeof window === 'undefined') return;

  let merged: Record<string, string> = {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) merged = JSON.parse(raw) as Record<string, string>;
  } catch {
    merged = {};
  }

  const incoming = new URLSearchParams(window.location.search);
  for (const [k, v] of incoming) {
    if (v !== '') merged[k] = v;
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v) sp.set(k, v);
  }
  const qs = sp.toString();
  const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) {
    window.history.replaceState(null, '', next);
  }
}

export function getMergedMarketingParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** Campos esperados pela Fruitfy / integrações para repasse de UTMs (ex.: UTMify pelo pedido no gateway). */
export function fruitfyUtmPayload(merged: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  const fruitfyKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
  ];
  const extra = ['src', 'xcod', 'sck', 'fbclid', 'gclid', 'msclkid'];

  for (const key of [...fruitfyKeys, ...extra]) {
    const v = merged[key];
    if (typeof v === 'string' && v.trim()) out[key] = v.trim();
  }

  return out;
}
