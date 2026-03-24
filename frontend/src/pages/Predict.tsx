import { useState, useRef, useEffect, useCallback } from "react";
import {
  Loader2, BarChart3, Brain, TrendingUp, AlertTriangle, CheckCircle2,
  Zap, MapPin, Globe, Thermometer, Wind, Droplets, Car, Calendar,
  Users, CloudRain, Sun, Cloud, CloudSnow, Clock,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart,
  LineChart, Line,
} from "recharts";
import { simulatePredict, generateHourlyDelays, type PredictionInput, type PredictionResult } from "@/lib/predict";
import logo from "@/assets/logo.png";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SEASONS = ["Winter", "Spring", "Summer", "Autumn"];
const WEATHER = ["Clear", "Rain", "Snow", "Storm"];
const EVENTS = ["None", "Sports", "Concert", "Festival"];

interface AIInsight {
  finalDelay: number;
  confidenceLow: number;
  confidenceHigh: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  riskScore: number;
  executiveSummary: string;
  operationalRecommendations: string[];
  riskBreakdown: { category: string; score: number; detail: string }[];
  cascadeEffects: string[];
  optimalDepartureWindow: string;
  predictedRecoveryTime: string;
  alternativeRouteAdvice: string;
  radarData: { subject: string; value: number }[];
  complianceFlags: string[];
}

function computeAIInsightLocally(
  input: PredictionInput,
  modelResult: PredictionResult,
  hourlyData: { hour: string; delay: number }[]
): Omit<AIInsight, "executiveSummary" | "operationalRecommendations" | "cascadeEffects"> {
  const d = modelResult.predicted_delay;
  const weatherBoost: Record<string, number> = { Clear: 0, Rain: 0.8, Snow: 1.8, Storm: 2.5 };
  const eventBoost: Record<string, number> = { None: 0, Sports: 1, Concert: 1.5, Festival: 2 };
  const congMult = input.traffic_congestion_index > 75 ? 1.15 : input.traffic_congestion_index > 50 ? 1.05 : 1;
  const holMult = input.holiday === 1 ? 0.6 : 1;
  const finalDelay = Math.max(0, Math.round(((d + (weatherBoost[input.weather_condition] ?? 0) + (eventBoost[input.event_type] ?? 0)) * congMult * holMult) * 10) / 10);
  const unc = (input.weather_condition !== "Clear" ? 2 : 0.5) + (input.event_type !== "None" ? 1.5 : 0) + (input.traffic_congestion_index > 60 ? 1.5 : 0.5);
  const confidenceLow = Math.max(0, Math.round((finalDelay - unc) * 10) / 10);
  const confidenceHigh = Math.round((finalDelay + unc * 1.5) * 10) / 10;
  const wScore: Record<string, number> = { Clear: 0, Rain: 15, Snow: 25, Storm: 35 };
  const eScore: Record<string, number> = { None: 0, Sports: 10, Concert: 12, Festival: 18 };
  const riskScore = Math.min(100, Math.round((input.traffic_congestion_index * 0.35) + (wScore[input.weather_condition] ?? 0) + (eScore[input.event_type] ?? 0) + (input.peak_hour === 1 ? 12 : 0) + (finalDelay > 20 ? 10 : finalDelay > 10 ? 5 : 0)));
  const riskLevel: AIInsight["riskLevel"] = riskScore < 25 ? "LOW" : riskScore < 50 ? "MODERATE" : riskScore < 75 ? "HIGH" : "CRITICAL";
  const wRisk: Record<string, number> = { Clear: 5, Rain: 40, Snow: 65, Storm: 90 };
  const eRisk: Record<string, number> = { None: 2, Sports: 45, Concert: 55, Festival: 75 };
  const tWin = input.peak_hour === 1 ? 75 : ((input.hour >= 7 && input.hour <= 9) || (input.hour >= 16 && input.hour <= 20)) ? 55 : 20;
  const riskBreakdown = [
    { category: "Traffic", score: Math.round(input.traffic_congestion_index * 0.9), detail: `Congestion at ${input.traffic_congestion_index}% — ${input.traffic_congestion_index > 70 ? "critical" : input.traffic_congestion_index > 40 ? "moderate" : "light"} load.` },
    { category: "Weather", score: wRisk[input.weather_condition] ?? 5, detail: `${input.weather_condition} with ${input.precipitation_mm}mm precipitation.` },
    { category: "Events", score: eRisk[input.event_type] ?? 2, detail: input.event_type === "None" ? "No active events." : `${input.event_type} — est. ${input.event_attendance_est.toLocaleString()} attendees.` },
    { category: "Time Window", score: tWin, detail: `${input.hour}:00 — ${input.peak_hour === 1 ? "active peak" : "off-peak"}.` },
    { category: "Environment", score: Math.min(100, Math.round((Math.abs(input.temperature_C - 22) * 1.5) + (input.wind_speed_kmh > 40 ? 25 : 0) + (input.humidity_percent > 80 ? 10 : 0))), detail: `${input.temperature_C}°C, ${input.wind_speed_kmh}km/h wind, ${input.humidity_percent}% humidity.` },
  ];
  const wRadar: Record<string, number> = { Clear: 8, Rain: 42, Snow: 68, Storm: 92 };
  const eRadar: Record<string, number> = { None: 4, Sports: 48, Concert: 58, Festival: 78 };
  const tSens = input.peak_hour === 1 ? 82 : ((input.hour >= 7 && input.hour <= 9) || (input.hour >= 17 && input.hour <= 19)) ? 60 : 28;
  const radarData = [
    { subject: "Weather Risk", value: wRadar[input.weather_condition] ?? 8 },
    { subject: "Traffic Load", value: Math.round(input.traffic_congestion_index * 0.95) },
    { subject: "Event Pressure", value: eRadar[input.event_type] ?? 4 },
    { subject: "Time Sensitivity", value: tSens },
    { subject: "Network Resilience", value: Math.round(Math.max(10, 85 - riskScore * 0.5)) },
    { subject: "Recovery Capacity", value: input.holiday === 1 ? 80 : input.peak_hour === 1 ? 35 : 62 },
  ];
  const sorted = [...hourlyData].sort((a, b) => a.delay - b.delay);
  const optimalDepartureWindow = `${sorted[0]?.hour ?? "—"}–${sorted[1]?.hour ?? sorted[0]?.hour ?? "—"} shows lowest exposure (est. ${sorted[0]?.delay ?? 0} min).`;
  const afterNow = hourlyData.slice(Math.max(0, hourlyData.findIndex(h => parseInt(h.hour) >= input.hour)));
  const recHour = afterNow.find(h => h.delay < 5)?.hour ?? "23:00";
  const predictedRecoveryTime = finalDelay < 5 ? "System within normal operating parameters." : `Normalisation projected by ${recHour}.`;
  const alternativeRouteAdvice = input.traffic_congestion_index > 65 ? "High congestion — evaluate parallel corridors and distribute load." : input.event_type !== "None" ? `Pre-position capacity near ${input.event_type} venue; activate post-event diversion protocols.` : "Standard routing topology adequate; maintain normal headways.";
  const complianceFlags: string[] = [];
  if (finalDelay > 20) complianceFlags.push("CRITICAL: Delay exceeds 20-min SLA — escalate to network control.");
  else if (finalDelay > 10) complianceFlags.push("WARNING: Delay approaching 10-min standard — monitor closely.");
  if (riskScore > 75) complianceFlags.push("Risk score >75 — activate contingency protocol.");
  return { finalDelay, confidenceLow, confidenceHigh, riskLevel, riskScore, riskBreakdown, radarData, optimalDepartureWindow, predictedRecoveryTime, alternativeRouteAdvice, complianceFlags };
}

async function fetchAITextInsights(
  input: PredictionInput,
  c: ReturnType<typeof computeAIInsightLocally>
): Promise<{ executiveSummary: string; operationalRecommendations: string[]; cascadeEffects: string[] }> {
  const fallback = () => ({
    executiveSummary: `${c.finalDelay}-min delay forecast with ${c.riskLevel} risk. ${input.traffic_congestion_index > 60 ? "Traffic congestion is the dominant driver." : input.weather_condition !== "Clear" ? `${input.weather_condition} conditions are the primary factor.` : "Conditions are within normal operating range."}`,
    operationalRecommendations: [
      input.peak_hour === 1 ? "Increase dispatch frequency to absorb peak demand." : "Maintain standard headways — demand manageable.",
      input.traffic_congestion_index > 60 ? "Engage traffic management to clear primary corridor bottlenecks." : "Pre-emptively monitor congestion index trend.",
      input.event_type !== "None" ? `Deploy event-response fleet near ${input.event_type} venue.` : "No event protocols required.",
    ],
    cascadeEffects: [
      c.finalDelay > 10 ? "Downstream schedule compression — later services absorb compounded delays." : "Minimal downstream impact under current delay profile.",
      input.traffic_congestion_index > 60 ? "Parallel route saturation risk if primary corridor remains blocked." : "Network load within tolerance.",
    ],
  });
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 180,
        messages: [{ role: "user", content: `Transit ops. delay=${c.finalDelay}min,risk=${c.riskLevel}(${c.riskScore}),traffic=${input.traffic_congestion_index}%,weather=${input.weather_condition},event=${input.event_type},hour=${input.hour}. Reply ONLY JSON no markdown:{"executiveSummary":"<2 sentences>","operationalRecommendations":["r1","r2","r3"],"cascadeEffects":["e1","e2"]}` }],
      }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    const data = await res.json();
    const txt = data.content?.map((b: { type: string; text?: string }) => b.type === "text" ? b.text : "").join("") ?? "";
    const parsed = JSON.parse(txt.replace(/```json|```/g, "").trim());
    return {
      executiveSummary: parsed.executiveSummary ?? fallback().executiveSummary,
      operationalRecommendations: parsed.operationalRecommendations ?? fallback().operationalRecommendations,
      cascadeEffects: parsed.cascadeEffects ?? fallback().cascadeEffects,
    };
  } catch { return fallback(); }
}

async function runAISecondLayer(input: PredictionInput, modelResult: PredictionResult, hourlyData: { hour: string; delay: number }[]): Promise<AIInsight> {
  const computed = computeAIInsightLocally(input, modelResult, hourlyData);
  const text = await fetchAITextInsights(input, computed);
  return { ...computed, ...text };
}

// ─── Enhanced 3D Heatmap ───────────────────────────────────────────────────────
const HourlyHeatmap3D = ({ hourlyData, currentHour }: { hourlyData: { hour: string; delay: number }[]; currentHour: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || hourlyData.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const DPR = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR; ctx.scale(DPR, DPR);
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, "rgba(10,12,20,0.98)"); bgGrad.addColorStop(1, "rgba(18,20,36,0.98)");
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);
    const PL = 52, PR = 16, PT = 24, PB = 48;
    const chartW = W - PL - PR, chartH = H - PT - PB;
    const cols = hourlyData.length;
    const maxDelay = Math.max(...hourlyData.map(d => d.delay), 1);
    [...new Set([0, 5, 10, 15, 20, Math.ceil(maxDelay / 5) * 5])].filter(v => v <= maxDelay + 5).forEach(tick => {
      const y = PT + chartH - (tick / (maxDelay + 2)) * chartH;
      ctx.beginPath(); ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
      ctx.moveTo(PL, y); ctx.lineTo(W - PR, y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "rgba(150,160,200,0.7)"; ctx.font = "10px monospace"; ctx.textAlign = "right";
      ctx.fillText(`${tick}m`, PL - 6, y + 4);
    });
    const barW = Math.max(4, (chartW / cols) - 3);
    const DX = 6, DY = 5;
    hourlyData.forEach((d, i) => {
      const barH = Math.max(2, (d.delay / (maxDelay + 2)) * chartH);
      const bx = PL + i * (chartW / cols) + (chartW / cols - barW) / 2;
      const by = PT + chartH - barH;
      const isCurrent = parseInt(d.hour) === currentHour;
      let r: number, g: number, b: number;
      if (d.delay < 5) { r = 34; g = 211; b = 238; }
      else if (d.delay < 10) { r = 74; g = 222; b = 128; }
      else if (d.delay < 15) { r = 250; g = 204; b = 21; }
      else if (d.delay < 20) { r = 249; g = 115; b = 22; }
      else { r = 239; g = 68; b = 68; }
      const alpha = isCurrent ? 1.0 : 0.82;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + barW, by); ctx.lineTo(bx + barW + DX, by - DY); ctx.lineTo(bx + DX, by - DY); ctx.closePath();
      ctx.fillStyle = `rgba(${Math.min(255, r + 60)},${Math.min(255, g + 60)},${Math.min(255, b + 60)},${alpha})`; ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx + barW, by); ctx.lineTo(bx + barW + DX, by - DY); ctx.lineTo(bx + barW + DX, PT + chartH - DY); ctx.lineTo(bx + barW, PT + chartH); ctx.closePath();
      ctx.fillStyle = `rgba(${Math.max(0, r - 60)},${Math.max(0, g - 60)},${Math.max(0, b - 60)},${alpha * 0.9})`; ctx.fill();
      const fg = ctx.createLinearGradient(bx, by, bx, PT + chartH);
      fg.addColorStop(0, `rgba(${r},${g},${b},${alpha})`); fg.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.88})`); fg.addColorStop(1, `rgba(${Math.max(0, r - 30)},${Math.max(0, g - 30)},${Math.max(0, b - 30)},${alpha * 0.75})`);
      ctx.fillStyle = fg; ctx.fillRect(bx, by, barW, barH);
      if (isCurrent || d.delay > 15) {
        ctx.shadowColor = `rgba(${r},${g},${b},0.8)`; ctx.shadowBlur = isCurrent ? 18 : 10;
        ctx.fillStyle = isCurrent ? `rgba(255,255,255,0.15)` : `rgba(${r},${g},${b},0.12)`; ctx.fillRect(bx, by, barW, barH); ctx.shadowBlur = 0; ctx.shadowColor = "transparent";
      }
      if (isCurrent) {
        ctx.strokeStyle = "rgba(255,255,255,0.95)"; ctx.lineWidth = 1.5; ctx.strokeRect(bx - 1, by - 1, barW + 2, barH + 2);
        ctx.fillStyle = "rgba(255,255,255,0.95)"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center"; ctx.fillText("NOW", bx + barW / 2, by - DY - 6);
      }
      if (barH > 28 && d.delay > 0) { ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.font = "bold 8px monospace"; ctx.textAlign = "center"; ctx.fillText(`${d.delay}`, bx + barW / 2, by + 12); }
      const h = parseInt(d.hour);
      if (h % 2 === 0) {
        ctx.fillStyle = isCurrent ? "rgba(255,255,255,0.95)" : "rgba(130,140,180,0.8)";
        ctx.font = isCurrent ? "bold 9px monospace" : "9px monospace"; ctx.textAlign = "center"; ctx.fillText(d.hour.replace(":00", ""), bx + barW / 2, H - PB + 16);
      }
    });
    ctx.beginPath(); ctx.strokeStyle = "rgba(100,110,160,0.6)"; ctx.lineWidth = 1; ctx.moveTo(PL, PT + chartH); ctx.lineTo(W - PR, PT + chartH); ctx.stroke();
    ctx.beginPath(); ctx.strokeStyle = "rgba(100,110,160,0.25)"; ctx.moveTo(PL + DX, PT + chartH - DY); ctx.lineTo(W - PR + DX, PT + chartH - DY); ctx.stroke();
    ctx.beginPath(); ctx.strokeStyle = "rgba(100,110,160,0.4)"; ctx.lineWidth = 1; ctx.moveTo(PL, PT); ctx.lineTo(PL, PT + chartH); ctx.stroke();
    ctx.fillStyle = "rgba(100,120,200,0.7)"; ctx.font = "9px monospace"; ctx.textAlign = "left"; ctx.fillText("DELAY (min)", 4, PT + chartH / 2);
  }, [hourlyData, currentHour]);
  useEffect(() => {
    draw();
    const ro = new ResizeObserver(draw);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [draw]);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "240px", display: "block" }} className="rounded-lg" />;
};

// ─── 3D Transit Map ────────────────────────────────────────────────────────────
const TransitMap3D = ({ riskScore, riskLevel, congestion, weatherCondition, eventType, finalDelay }: { riskScore: number; riskLevel: string; congestion: number; weatherCondition: string; eventType: string; finalDelay: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const DPR = window.devicePixelRatio || 1;
    const W = canvas.clientWidth, H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR; ctx.scale(DPR, DPR);
    const t = timeRef.current;
    ctx.fillStyle = "#0a0e1a"; ctx.fillRect(0, 0, W, H);
    const ISO = Math.PI / 6, CELL = 38, ox = W / 2, oy = H * 0.6;
    const toScreen = (gx: number, gy: number, gz: number = 0) => ({ x: ox + (gx - gy) * CELL * Math.cos(ISO), y: oy + (gx + gy) * CELL * Math.sin(ISO) - gz * CELL * 0.55 });
    for (let gx = -5; gx <= 5; gx++) for (let gy = -5; gy <= 5; gy++) {
      const dist = Math.sqrt(gx * gx + gy * gy) / 5, tl = toScreen(gx, gy), tr = toScreen(gx + 1, gy), br = toScreen(gx + 1, gy + 1), bl = toScreen(gx, gy + 1);
      ctx.fillStyle = `rgba(60,80,160,${0.12 - dist * 0.08})`; ctx.strokeStyle = "rgba(80,100,200,0.12)"; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(tl.x, tl.y); ctx.lineTo(tr.x, tr.y); ctx.lineTo(br.x, br.y); ctx.lineTo(bl.x, bl.y); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    const buildings = [{ gx: -4, gy: -4, h: 1.2 }, { gx: -3, gy: -3, h: 2.5 }, { gx: -2, gy: -4, h: 1.8 }, { gx: -4, gy: -2, h: 3.2 }, { gx: 2, gy: -4, h: 2.8 }, { gx: 3, gy: -3, h: 1.5 }, { gx: 4, gy: -4, h: 2.2 }, { gx: 4, gy: -2, h: 3.5 }, { gx: -4, gy: 2, h: 1.9 }, { gx: -3, gy: 3, h: 2.4 }, { gx: 3, gy: 2, h: 1.6 }, { gx: 4, gy: 3, h: 2.9 }, { gx: -1, gy: -3, h: 1.3 }, { gx: 1, gy: -3, h: 1.7 }];
    buildings.forEach(b => {
      const x0 = toScreen(b.gx, b.gy, 0), x3 = toScreen(b.gx, b.gy + 1, 0), x1 = toScreen(b.gx + 1, b.gy, 0), x2 = toScreen(b.gx + 1, b.gy + 1, 0);
      const t0 = toScreen(b.gx, b.gy, b.h), t1 = toScreen(b.gx + 1, b.gy, b.h), t2 = toScreen(b.gx + 1, b.gy + 1, b.h), t3 = toScreen(b.gx, b.gy + 1, b.h);
      const s = b.h > 2.5 ? 45 : b.h > 1.8 ? 35 : 28;
      ctx.beginPath(); ctx.moveTo(x0.x, x0.y); ctx.lineTo(x3.x, x3.y); ctx.lineTo(t3.x, t3.y); ctx.lineTo(t0.x, t0.y); ctx.closePath(); ctx.fillStyle = `rgb(${s},${s + 8},${s + 25})`; ctx.fill(); ctx.strokeStyle = "rgba(100,120,200,0.15)"; ctx.lineWidth = 0.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x1.x, x1.y); ctx.lineTo(x2.x, x2.y); ctx.lineTo(t2.x, t2.y); ctx.lineTo(t1.x, t1.y); ctx.closePath(); ctx.fillStyle = `rgb(${s + 8},${s + 18},${s + 38})`; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(t0.x, t0.y); ctx.lineTo(t1.x, t1.y); ctx.lineTo(t2.x, t2.y); ctx.lineTo(t3.x, t3.y); ctx.closePath(); ctx.fillStyle = `rgb(${s + 20},${s + 32},${s + 58})`; ctx.fill(); ctx.stroke();
      if (b.h > 2) { ctx.fillStyle = `rgba(255,240,150,${(0.5 + 0.3 * Math.sin(t * 0.5 + b.gx + b.gy)) * 0.6})`; ctx.fillRect(t0.x + 3, t0.y + 4, 3, 3); ctx.fillRect(t0.x + 7, t0.y + 4, 3, 3); }
    });
    const rc = riskLevel === "CRITICAL" ? [239, 68, 68] : riskLevel === "HIGH" ? [249, 115, 22] : riskLevel === "MODERATE" ? [250, 204, 21] : [34, 197, 94];
    const routes = [{ path: [[-4, 0], [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], primary: true }, { path: [[-3, -3], [-2, -2], [-1, -1], [0, 0], [1, 1], [2, 2], [3, 3]], primary: false }, { path: [[0, -4], [0, -3], [0, -2], [0, -1], [0, 0], [0, 1], [0, 2], [0, 3]], primary: false }];
    routes.forEach((route, ri) => {
      const pts = route.path.map(([gx, gy]) => toScreen(gx, gy, 0.15));
      if (pts.length < 2) return;
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.strokeStyle = `rgba(${rc[0]},${rc[1]},${rc[2]},0.15)`; ctx.lineWidth = route.primary ? 10 : 6; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.strokeStyle = `rgba(${rc[0]},${rc[1]},${rc[2]},${route.primary ? 0.9 : 0.55})`; ctx.lineWidth = route.primary ? 2.5 : 1.5; ctx.setLineDash(route.primary ? [] : [5, 4]); ctx.stroke(); ctx.setLineDash([]);
      if (route.primary) {
        const prog = (t * (0.012 + (congestion / 100) * 0.008) * (ri + 1)) % 1, si = Math.floor(prog * (pts.length - 1)), sp = (prog * (pts.length - 1)) % 1;
        if (si < pts.length - 1) {
          const vx = pts[si].x + (pts[si + 1].x - pts[si].x) * sp, vy = pts[si].y + (pts[si + 1].y - pts[si].y) * sp;
          const gr = ctx.createRadialGradient(vx, vy, 0, vx, vy, 12); gr.addColorStop(0, `rgba(${rc[0]},${rc[1]},${rc[2]},0.6)`); gr.addColorStop(1, `rgba(${rc[0]},${rc[1]},${rc[2]},0)`);
          ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(vx, vy, 12, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgb(${rc[0]},${rc[1]},${rc[2]})`; ctx.beginPath(); ctx.arc(vx, vy, 4, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "white"; ctx.lineWidth = 1; ctx.stroke();
        }
      }
    });
    const intersections: { gx: number; gy: number; intensity: number; label?: string }[] = [{ gx: 0, gy: 0, intensity: congestion / 100, label: "HUB" }, { gx: -2, gy: 0, intensity: congestion * 0.7 / 100 }, { gx: 2, gy: 0, intensity: congestion * 0.65 / 100 }, { gx: 0, gy: -2, intensity: congestion * 0.55 / 100 }];
    if (eventType !== "None") intersections.push({ gx: 2, gy: 2, intensity: 0.85, label: eventType.toUpperCase() });
    intersections.forEach(({ gx, gy, intensity, label }) => {
      const p = toScreen(gx, gy, 0.3), pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + gx + gy), radius = 14 + intensity * 12 * pulse;
      const heat = intensity > 0.7 ? [239, 68, 68] : intensity > 0.45 ? [250, 204, 21] : [34, 197, 94];
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius); grad.addColorStop(0, `rgba(${heat[0]},${heat[1]},${heat[2]},0.5)`); grad.addColorStop(1, `rgba(${heat[0]},${heat[1]},${heat[2]},0)`);
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgb(${heat[0]},${heat[1]},${heat[2]})`; ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1; ctx.stroke();
      if (label) { ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = "bold 8px monospace"; ctx.textAlign = "center"; ctx.fillText(label, p.x, p.y - 10); }
    });
    ctx.fillStyle = "rgba(10,14,30,0.8)";
    ctx.beginPath(); ctx.roundRect(W - 130, 10, 118, 70, 6); ctx.fill();
    ctx.strokeStyle = `rgba(${rc[0]},${rc[1]},${rc[2]},0.5)`; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = `rgba(${rc[0]},${rc[1]},${rc[2]},1)`; ctx.font = "bold 22px monospace"; ctx.textAlign = "center"; ctx.fillText(`${finalDelay}`, W - 71, 42);
    ctx.fillStyle = "rgba(160,170,210,0.9)"; ctx.font = "8px monospace"; ctx.fillText("AVG DELAY (min)", W - 71, 55);
    ctx.fillStyle = `rgba(${rc[0]},${rc[1]},${rc[2]},0.9)`; ctx.font = "bold 9px monospace"; ctx.fillText(`${riskLevel} RISK`, W - 71, 70);
    if (weatherCondition === "Rain" || weatherCondition === "Storm") { for (let ri = 0; ri < 40; ri++) { const rx = (ri * 137.5 + t * 80) % W, ry = (ri * 73.3 + t * 120) % H; ctx.strokeStyle = "rgba(120,160,255,0.25)"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 2, ry + 8); ctx.stroke(); } }
    if (weatherCondition === "Snow") { for (let si = 0; si < 25; si++) { const sx = (si * 97.3 + t * 30) % W, sy = (si * 53.7 + t * 50) % H; ctx.fillStyle = "rgba(200,220,255,0.4)"; ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill(); } }
    timeRef.current += 1; animRef.current = requestAnimationFrame(draw);
  }, [riskScore, riskLevel, congestion, weatherCondition, eventType, finalDelay]);
  useEffect(() => { animRef.current = requestAnimationFrame(draw); return () => cancelAnimationFrame(animRef.current); }, [draw]);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "320px", display: "block" }} className="rounded-xl" />;
};

// ─── Risk Gauge ────────────────────────────────────────────────────────────────
const RiskGauge = ({ score, level }: { score: number; level: string }) => {
  const colors: Record<string, string> = { LOW: "#22c55e", MODERATE: "#f59e0b", HIGH: "#f97316", CRITICAL: "#ef4444" };
  const color = colors[level] || "#6b7280";
  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="100" viewBox="0 0 160 100">
        <defs><linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#22c55e" /><stop offset="33%" stopColor="#f59e0b" /><stop offset="66%" stopColor="#f97316" /><stop offset="100%" stopColor="#ef4444" /></linearGradient></defs>
        <path d="M 16 90 A 64 64 0 0 1 144 90" fill="none" stroke="hsl(var(--border))" strokeWidth="12" strokeLinecap="round" />
        <path d="M 16 90 A 64 64 0 0 1 144 90" fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round" opacity="0.8" />
        <g transform={`rotate(${-135 + (score / 100) * 270}, 80, 90)`}><line x1="80" y1="90" x2="80" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round" /><circle cx="80" cy="90" r="5" fill={color} /></g>
        <text x="80" y="82" textAnchor="middle" fill={color} fontSize="22" fontWeight="bold" fontFamily="monospace">{score}</text>
      </svg>
      <span className="text-xs font-bold tracking-widest mt-1" style={{ color }}>{level} RISK</span>
    </div>
  );
};

// ─── LIVE INPUT SNAPSHOT — fills empty space below pipeline tracker ────────────
const LiveInputSummary = ({ form }: { form: PredictionInput }) => {
  const WeatherIcon = form.weather_condition === "Clear" ? Sun : form.weather_condition === "Rain" ? CloudRain : form.weather_condition === "Storm" ? CloudRain : CloudSnow;
  const weatherColor = { Clear: "text-yellow-400", Rain: "text-blue-400", Snow: "text-slate-300", Storm: "text-purple-400" }[form.weather_condition] ?? "text-muted-foreground";
  const congLevel = form.traffic_congestion_index > 70 ? { label: "CRITICAL", color: "text-destructive bg-destructive/10 border-destructive/20" }
    : form.traffic_congestion_index > 45 ? { label: "MODERATE", color: "text-warning bg-warning/10 border-warning/20" }
      : { label: "LIGHT", color: "text-success bg-success/10 border-success/20" };
  const isPeak = form.peak_hour === 1 || (form.hour >= 7 && form.hour <= 9) || (form.hour >= 16 && form.hour <= 19);

  const miniStats = [
    { icon: Thermometer, label: "TEMP", value: `${form.temperature_C}°C`, sub: form.temperature_C < 5 ? "Freezing" : form.temperature_C > 35 ? "Extreme" : "Normal", alert: form.temperature_C < 5 || form.temperature_C > 35 },
    { icon: Droplets, label: "HUMIDITY", value: `${form.humidity_percent}%`, sub: form.humidity_percent > 85 ? "Very humid" : "Normal", alert: form.humidity_percent > 85 },
    { icon: Wind, label: "WIND", value: `${form.wind_speed_kmh} km/h`, sub: form.wind_speed_kmh > 60 ? "Dangerous" : form.wind_speed_kmh > 45 ? "Strong" : "Normal", alert: form.wind_speed_kmh > 45 },
    { icon: CloudRain, label: "PRECIP", value: `${form.precipitation_mm}mm`, sub: form.precipitation_mm > 10 ? "Heavy" : form.precipitation_mm > 5 ? "Moderate" : "Low", alert: form.precipitation_mm > 10 },
  ];

  return (
    <div className="glass rounded-xl border border-border p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="font-display text-xs font-bold tracking-widest text-primary">LIVE INPUT SNAPSHOT</span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {WEEKDAYS[form.weekday].slice(0, 3).toUpperCase()} {String(form.hour).padStart(2, "0")}:00
        </span>
      </div>

      {/* Weather + Congestion cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-secondary/40 p-3 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 ${weatherColor}`}>
            <WeatherIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-[9px] tracking-widest text-muted-foreground">WEATHER</p>
            <p className="font-bold text-sm truncate">{form.weather_condition}</p>
            <p className="text-[10px] text-muted-foreground">{form.season}</p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <Car className="w-3 h-3 text-primary" />
              <p className="font-display text-[9px] tracking-widest text-muted-foreground">CONGESTION</p>
            </div>
            <span className={`text-[9px] font-bold font-display px-1.5 py-0.5 rounded border tracking-wider ${congLevel.color}`}>{congLevel.label}</span>
          </div>
          <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden mb-1.5">
            <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{ width: `${form.traffic_congestion_index}%`, background: form.traffic_congestion_index > 70 ? "linear-gradient(90deg,#f97316,#ef4444)" : form.traffic_congestion_index > 45 ? "linear-gradient(90deg,#f59e0b,#f97316)" : "linear-gradient(90deg,#22c55e,#34d399)" }} />
          </div>
          <p className="font-mono text-xs text-right text-muted-foreground">{form.traffic_congestion_index}%</p>
        </div>
      </div>

      {/* 4 env mini-stats */}
      <div className="grid grid-cols-4 gap-2">
        {miniStats.map(({ icon: Icon, label, value, sub, alert }) => (
          <div key={label} className={`rounded-lg border p-2 text-center transition-colors ${alert ? "border-warning/30 bg-warning/5" : "border-border bg-secondary/30"}`}>
            <Icon className={`w-3.5 h-3.5 mx-auto mb-1 ${alert ? "text-warning" : "text-primary"}`} />
            <p className="font-display text-[8px] tracking-widest text-muted-foreground">{label}</p>
            <p className="font-mono text-[10px] font-bold mt-0.5 leading-tight">{value}</p>
            <p className={`text-[8px] mt-0.5 ${alert ? "text-warning" : "text-muted-foreground"}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1.5 font-display text-[9px] font-bold tracking-widest px-2 py-1 rounded-full border ${isPeak ? "border-warning/40 bg-warning/10 text-warning" : "border-border text-muted-foreground"}`}>
          <Clock className="w-2.5 h-2.5" />{isPeak ? "PEAK HOUR" : "OFF-PEAK"}
        </span>
        <span className={`inline-flex items-center gap-1.5 font-display text-[9px] font-bold tracking-widest px-2 py-1 rounded-full border ${form.holiday === 1 ? "border-success/40 bg-success/10 text-success" : "border-border text-muted-foreground"}`}>
          <Calendar className="w-2.5 h-2.5" />{form.holiday === 1 ? "HOLIDAY" : "WORKDAY"}
        </span>
        {form.event_type !== "None" && (
          <span className="inline-flex items-center gap-1.5 font-display text-[9px] font-bold tracking-widest px-2 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary">
            <Users className="w-2.5 h-2.5" />{form.event_type.toUpperCase()}
            {form.event_attendance_est > 0 && ` · ~${(form.event_attendance_est / 1000).toFixed(0)}K`}
          </span>
        )}
      </div>

      {/* Model token bar */}
      <div className="border-t border-border/50 pt-3">
        <p className="font-display text-[9px] tracking-widest text-muted-foreground mb-2">MODEL INPUT TOKENS</p>
        <div className="flex gap-1 flex-wrap">
          {[
            { k: "Weather", v: form.weather_condition },
            { k: "Season", v: form.season },
            { k: "Traffic", v: `${form.traffic_congestion_index}%` },
            { k: "Hour", v: `${String(form.hour).padStart(2, "0")}:00` },
            { k: "Day", v: WEEKDAYS[form.weekday].slice(0, 3) },
            { k: "Event", v: form.event_type },
            { k: "Temp", v: `${form.temperature_C}°C` },
            { k: "Wind", v: `${form.wind_speed_kmh}km/h` },
          ].map(({ k, v }) => (
            <span key={k} className="font-mono text-[9px] bg-primary/5 border border-primary/15 rounded px-1.5 py-0.5 text-muted-foreground">
              <span className="text-primary/60">{k}:</span> {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Predict = () => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [hourlyData, setHourlyData] = useState<{ hour: string; delay: number }[]>([]);
  const [phase, setPhase] = useState<"idle" | "model" | "ai" | "done">("idle");

  const [form, setForm] = useState<PredictionInput>({
    temperature_C: 25, humidity_percent: 60, wind_speed_kmh: 20, precipitation_mm: 5,
    traffic_congestion_index: 50, event_attendance_est: 0, holiday: 0, peak_hour: 0,
    weekday: 4, hour: 18, season: "Summer", weather_condition: "Clear", event_type: "None",
  });

  const update = (key: keyof PredictionInput, val: string | number) =>
    setForm((p) => ({ ...p, [key]: val }));

  const predict = async () => {
    setLoading(true); setAiLoading(false); setResult(null); setAiInsight(null); setPhase("model");
    const [res, hourly] = await Promise.all([simulatePredict(form), generateHourlyDelays(form)]);
    setResult(res); setHourlyData(hourly); setLoading(false);
    setAiLoading(true); setPhase("ai");
    const ai = await runAISecondLayer(form, res, hourly);
    setAiInsight(ai); setAiLoading(false); setPhase("done");
  };

  const delayColor = (d: number) => d < 5 ? "text-success" : d <= 15 ? "text-warning" : "text-destructive";
  const delayLabel = (d: number) => d < 5 ? "On Time" : d <= 15 ? "Moderate Delay" : d <= 25 ? "Significant Delay" : "Critical Delay";
  const confidenceData = aiInsight ? hourlyData.map(h => ({ hour: h.hour, delay: h.delay, low: Math.max(0, h.delay - (aiInsight.finalDelay - aiInsight.confidenceLow)), high: h.delay + (aiInsight.confidenceHigh - aiInsight.finalDelay) })) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8">

            {/* ── Form + Pipeline + Live Snapshot ── */}
            <div className="lg:col-span-3 space-y-6">
              <Fieldset label="WEATHER">
                <div className="grid grid-cols-2 gap-4">
                  <NumberField label="TEMPERATURE (°C)" value={form.temperature_C} onChange={(v) => update("temperature_C", v)} />
                  <NumberField label="HUMIDITY (%)" value={form.humidity_percent} onChange={(v) => update("humidity_percent", v)} />
                  <NumberField label="WIND SPEED (KM/H)" value={form.wind_speed_kmh} onChange={(v) => update("wind_speed_kmh", v)} />
                  <NumberField label="PRECIPITATION (MM)" value={form.precipitation_mm} onChange={(v) => update("precipitation_mm", v)} />
                  <SelectField label="SEASON" value={form.season} options={SEASONS} onChange={(v) => update("season", v)} />
                  <SelectField label="WEATHER CONDITION" value={form.weather_condition} options={WEATHER} onChange={(v) => update("weather_condition", v)} />
                </div>
              </Fieldset>
              <Fieldset label="TRAFFIC & TIME">
                <div className="space-y-4">
                  <div>
                    <label className="font-display text-xs tracking-widest font-bold mb-2 block">TRAFFIC CONGESTION: {form.traffic_congestion_index}%</label>
                    <input type="range" min="0" max="100" value={form.traffic_congestion_index} onChange={(e) => update("traffic_congestion_index", +e.target.value)}
                      className="w-full accent-primary h-2 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <SelectField label="WEEKDAY" value={WEEKDAYS[form.weekday]} options={WEEKDAYS} onChange={(v) => update("weekday", WEEKDAYS.indexOf(v))} />
                    <NumberField label="HOUR (0-23)" value={form.hour} onChange={(v) => update("hour", Math.min(23, Math.max(0, v)))} />
                    <SelectField label="PEAK HOUR" value={form.peak_hour === 1 ? "Yes" : "No"} options={["No", "Yes"]} onChange={(v) => update("peak_hour", v === "Yes" ? 1 : 0)} />
                    <SelectField label="HOLIDAY" value={form.holiday === 1 ? "Yes" : "No"} options={["No", "Yes"]} onChange={(v) => update("holiday", v === "Yes" ? 1 : 0)} />
                  </div>
                </div>
              </Fieldset>
              <Fieldset label="EVENTS">
                <div className="grid grid-cols-2 gap-4">
                  <SelectField label="EVENT TYPE" value={form.event_type} options={EVENTS} onChange={(v) => update("event_type", v)} />
                  <NumberField label="EVENT ATTENDANCE (EST.)" value={form.event_attendance_est} onChange={(v) => update("event_attendance_est", v)} />
                </div>
              </Fieldset>
              <button onClick={predict} disabled={loading || aiLoading}
                className="w-full bg-primary text-primary-foreground font-display text-sm font-bold tracking-widest py-4 hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />RUNNING ML MODEL...</>
                  : aiLoading ? <><Brain className="w-4 h-4 animate-pulse" />AI ANALYSIS IN PROGRESS...</>
                    : "PREDICT DELAY"}
              </button>

              {/* Pipeline tracker */}
              {phase !== "idle" && (
                <div className="glass rounded-lg border border-border p-4">
                  <p className="font-display text-xs tracking-widest text-muted-foreground mb-3">PREDICTION PIPELINE</p>
                  <div className="flex items-center gap-3">
                    <StepBadge label="ML MODEL" done={["ai", "done"].includes(phase)} active={phase === "model"} />
                    <div className="flex-1 h-px bg-border" />
                    <StepBadge label="AI LAYER" done={phase === "done"} active={phase === "ai"} />
                    <div className="flex-1 h-px bg-border" />
                    <StepBadge label="COMPLETE" done={phase === "done"} active={false} />
                  </div>
                </div>
              )}

              {/* ── LIVE INPUT SNAPSHOT — always visible, updates as user changes form ── */}
              <LiveInputSummary form={form} />
            </div>

            {/* ── Results Panel ── */}
            <div className="lg:col-span-2 space-y-6">
              {result && (
                <>
                  <div className="glass rounded-lg p-5 border border-border animate-fade-in">
                    <div className="flex items-center gap-2 mb-3"><BarChart3 className="w-4 h-4 text-primary" /><h3 className="font-display text-xs tracking-widest text-muted-foreground">ML MODEL OUTPUT</h3></div>
                    <div className="text-center py-2">
                      <p className={`font-mono text-5xl font-bold ${delayColor(result.predicted_delay)}`}>{result.predicted_delay}</p>
                      <p className="font-display text-xs tracking-widest text-muted-foreground mt-1">MINUTES (MODEL)</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold font-display tracking-wider ${result.predicted_delay < 5 ? "bg-success/20 text-success" : result.predicted_delay <= 15 ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive"}`}>{delayLabel(result.predicted_delay)}</span>
                    </div>
                    {result.factors.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="font-display text-xs tracking-widest text-muted-foreground mb-2">KEY FACTORS</p>
                        <div className="space-y-1">{result.factors.map((f, i) => (<div key={i} className="flex items-center gap-2 text-sm"><span className={`w-2 h-2 rounded-full ${f.impact === "high" ? "bg-destructive" : "bg-warning"}`} />{f.name}</div>))}</div>
                      </div>
                    )}
                  </div>

                  {aiInsight && (
                    <div className="glass rounded-lg p-5 border-2 animate-fade-in" style={{ borderColor: aiInsight.riskLevel === "CRITICAL" ? "hsl(var(--destructive))" : aiInsight.riskLevel === "HIGH" ? "#f97316" : aiInsight.riskLevel === "MODERATE" ? "hsl(var(--warning))" : "hsl(var(--success))" }}>
                      <div className="flex items-center gap-2 mb-3"><Brain className="w-4 h-4 text-primary" /><h3 className="font-display text-xs tracking-widest text-muted-foreground">AI ENHANCED PREDICTION</h3></div>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className={`font-mono text-5xl font-bold ${delayColor(aiInsight.finalDelay)}`}>{aiInsight.finalDelay}</p>
                          <p className="font-display text-xs tracking-widest text-muted-foreground mt-1">MINUTES (AI ADJUSTED)</p>
                          <p className="text-xs text-muted-foreground mt-1 font-mono">[{aiInsight.confidenceLow} – {aiInsight.confidenceHigh}] min CI</p>
                        </div>
                        <RiskGauge score={aiInsight.riskScore} level={aiInsight.riskLevel} />
                      </div>
                      <div className="mt-4 pt-4 border-t border-border"><p className="text-sm text-muted-foreground leading-relaxed">{aiInsight.executiveSummary}</p></div>
                      {aiInsight.complianceFlags.length > 0 && (
                        <div className="mt-3 space-y-1">{aiInsight.complianceFlags.map((flag, i) => (<div key={i} className="flex items-start gap-2 text-xs text-destructive bg-destructive/10 rounded p-2"><AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />{flag}</div>))}</div>
                      )}
                    </div>
                  )}

                  {aiLoading && (
                    <div className="glass rounded-lg p-6 border border-border animate-pulse flex flex-col items-center gap-3">
                      <Brain className="w-8 h-8 text-primary animate-pulse" />
                      <p className="font-display text-xs tracking-widest text-muted-foreground">AI LAYER ANALYZING...</p>
                      <p className="text-xs text-muted-foreground text-center">Generating insights — typically completes in 2–3 seconds</p>
                    </div>
                  )}

                  {aiInsight && (
                    <div className="glass rounded-xl border border-border overflow-hidden animate-fade-in shadow-lg">
                      <div className="flex items-center gap-2 px-5 pt-5 pb-2"><Globe className="w-4 h-4 text-primary" /><h3 className="font-display text-xs font-bold tracking-widest">3D TRANSIT NETWORK MAP</h3></div>
                      <p className="text-muted-foreground text-xs px-5 pb-3">Live risk overlay — animated vehicles reflect current conditions</p>
                      <TransitMap3D riskScore={aiInsight.riskScore} riskLevel={aiInsight.riskLevel} congestion={form.traffic_congestion_index} weatherCondition={form.weather_condition} eventType={form.event_type} finalDelay={aiInsight.finalDelay} />
                      <div className="flex gap-4 px-5 py-3 border-t border-border text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" />Low</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />Moderate</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" />High</span>
                      </div>
                    </div>
                  )}

                  <div className="glass rounded-lg border border-border p-5 animate-fade-in">
                    <h3 className="font-display text-xs font-bold tracking-widest mb-1">HOURLY DELAY FORECAST</h3>
                    <p className="text-muted-foreground text-xs mb-3">Predicted delay trend over the day</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={hourlyData}>
                        <defs><linearGradient id="delayGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={9} interval={2} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12, color: "hsl(var(--foreground))" }} />
                        <ReferenceLine y={5} stroke="hsl(var(--success))" strokeDasharray="5 5" />
                        <ReferenceLine y={15} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
                        <Area type="monotone" dataKey="delay" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#delayGrad)" dot={false} activeDot={{ r: 5 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
              {!result && (
                <div className="glass rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center animate-fade-in min-h-[400px]">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6"><BarChart3 className="w-8 h-8 text-primary opacity-80" /></div>
                  <h3 className="font-display font-bold text-lg mb-2">Awaiting Parameters</h3>
                  <p className="text-muted-foreground text-sm max-w-[250px]">Configure inputs and click Predict Delay. ML model runs first, then AI layer enhances the prediction.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Full-width Deep Dive ── */}
          {result && aiInsight && (
            <div className="mt-14 animate-fade-in space-y-10">
              <div className="flex items-center gap-3">
                <div className="h-px bg-border flex-1" />
                <h2 className="font-display text-sm font-bold tracking-widest text-muted-foreground flex items-center gap-2"><Brain className="w-4 h-4" />AI-ENHANCED INTELLIGENCE SUITE</h2>
                <div className="h-px bg-border flex-1" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <InfoCard icon={<Zap className="w-4 h-4 text-warning" />} label="OPTIMAL DEPARTURE" value={aiInsight.optimalDepartureWindow} />
                <InfoCard icon={<TrendingUp className="w-4 h-4 text-success" />} label="RECOVERY FORECAST" value={aiInsight.predictedRecoveryTime} />
                <InfoCard icon={<MapPin className="w-4 h-4 text-primary" />} label="ROUTE STRATEGY" value={aiInsight.alternativeRouteAdvice} />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass rounded-xl border border-border p-5 shadow-lg">
                  <h3 className="font-display text-xs font-bold tracking-widest mb-1">RISK RADAR</h3>
                  <p className="text-muted-foreground text-xs mb-3">Multi-dimensional risk profile</p>
                  <ResponsiveContainer width="100%" height={220}><RadarChart data={aiInsight.radarData}><PolarGrid stroke="hsl(var(--border))" /><PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} /><PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} /><Radar name="Risk" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} /></RadarChart></ResponsiveContainer>
                  <div className="mt-2 text-xs text-muted-foreground italic border-t border-border/50 pt-2">Insight: Areas closer to the edge indicate higher risk contribution.</div>
                </div>
                <div className="glass rounded-xl border border-border p-5 shadow-lg">
                  <h3 className="font-display text-xs font-bold tracking-widest mb-1">RISK DECOMPOSITION</h3>
                  <p className="text-muted-foreground text-xs mb-3">AI-assessed factor scores</p>
                  <ResponsiveContainer width="100%" height={220}><BarChart layout="vertical" data={aiInsight.riskBreakdown}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={9} /><YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" fontSize={9} width={60} /><Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11, color: "hsl(var(--foreground))" }} formatter={(val, _n, props) => [val, props.payload?.detail || _n]} /><Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
                  <div className="mt-2 text-xs text-muted-foreground italic border-t border-border/50 pt-2">Insight: Longer bars reflect greater AI-assessed contribution to total delay.</div>
                </div>
                <div className="glass rounded-xl border border-border p-5 shadow-lg">
                  <h3 className="font-display text-xs font-bold tracking-widest mb-1">CONFIDENCE ENVELOPE</h3>
                  <p className="text-muted-foreground text-xs mb-3">90% prediction interval band</p>
                  <ResponsiveContainer width="100%" height={220}><ComposedChart data={confidenceData}><defs><linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0.05} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={8} interval={3} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={9} /><Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11, color: "hsl(var(--foreground))" }} /><Area type="monotone" dataKey="high" stroke="none" fill="url(#ciGrad)" /><Area type="monotone" dataKey="low" stroke="none" fill="hsl(var(--background))" /><Line type="monotone" dataKey="delay" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} /></ComposedChart></ResponsiveContainer>
                  <div className="mt-2 text-xs text-muted-foreground italic border-t border-border/50 pt-2">Insight: Shaded band shows the 90% confidence range around the baseline.</div>
                </div>
                <div className="glass rounded-xl border border-border p-5 shadow-lg">
                  <h3 className="font-display text-xs font-bold tracking-widest mb-1">WEATHER SCENARIOS</h3>
                  <p className="text-muted-foreground text-xs mb-3">How weather alters delay</p>
                  <ResponsiveContainer width="100%" height={200}><BarChart data={[{ name: "Clear", delay: Math.max(0, aiInsight.finalDelay - 4) }, { name: "Current", delay: aiInsight.finalDelay }, { name: "Rain", delay: aiInsight.finalDelay + 3 }, { name: "Storm", delay: aiInsight.finalDelay + 9 }]}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} width={28} /><Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12, color: "hsl(var(--foreground))" }} cursor={{ fill: "hsl(var(--border))", opacity: 0.4 }} /><Bar dataKey="delay" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
                  <div className="mt-2 text-xs text-muted-foreground italic border-t border-border/50 pt-2">Insight: Storm conditions can push delays 2–3× above clear-day baseline.</div>
                </div>
                <div className="glass rounded-xl border border-border p-5 shadow-lg">
                  <h3 className="font-display text-xs font-bold tracking-widest mb-1">EVENT IMPACT</h3>
                  <p className="text-muted-foreground text-xs mb-3">Delay by event type</p>
                  <ResponsiveContainer width="100%" height={200}><BarChart data={[{ name: "None", delay: Math.max(0, aiInsight.finalDelay - 5) }, { name: "Sports", delay: aiInsight.finalDelay + (form.event_type === "Sports" ? 0 : 4) }, { name: "Concert", delay: aiInsight.finalDelay + (form.event_type === "Concert" ? 0 : 5) }, { name: "Festival", delay: aiInsight.finalDelay + (form.event_type === "Festival" ? 0 : 7) }]}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} width={28} /><Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12, color: "hsl(var(--foreground))" }} cursor={{ fill: "hsl(var(--border))", opacity: 0.4 }} /><Bar dataKey="delay" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
                  <div className="mt-2 text-xs text-muted-foreground italic border-t border-border/50 pt-2">Insight: Festivals produce the largest single-event delay uplift.</div>
                </div>
                <div className="glass rounded-xl border border-border p-5 shadow-lg">
                  <h3 className="font-display text-xs font-bold tracking-widest mb-1">WEEKLY VARIANCE</h3>
                  <p className="text-muted-foreground text-xs mb-3">Projected delay by day</p>
                  <ResponsiveContainer width="100%" height={200}><LineChart data={[{ day: "Mon", delay: aiInsight.finalDelay + 2 }, { day: "Tue", delay: Math.max(0, aiInsight.finalDelay - 1) }, { day: "Wed", delay: Math.max(0, aiInsight.finalDelay - 2) }, { day: "Thu", delay: aiInsight.finalDelay }, { day: "Fri", delay: aiInsight.finalDelay + 4 }, { day: "Sat", delay: Math.max(0, aiInsight.finalDelay - 3) }, { day: "Sun", delay: Math.max(0, aiInsight.finalDelay - 5) }]}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} width={28} /><Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12, color: "hsl(var(--foreground))" }} /><Line type="monotone" dataKey="delay" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ fill: "hsl(var(--background))", stroke: "hsl(var(--destructive))", strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} /></LineChart></ResponsiveContainer>
                  <div className="mt-2 text-xs text-muted-foreground italic border-t border-border/50 pt-2">Insight: Friday typically records peak delays; weekends trend significantly lower.</div>
                </div>
              </div>

              <div className="glass rounded-xl border border-border p-6 shadow-lg">
                <h3 className="font-display text-xs font-bold tracking-widest mb-1">3D HOURLY DELAY HEATMAP</h3>
                <p className="text-muted-foreground text-xs mb-4">Volumetric delay intensity by hour — highlighted bar = current hour · Y-axis = delay (min) · Color = severity tier</p>
                <HourlyHeatmap3D hourlyData={hourlyData} currentHour={form.hour} />
                <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#22d3ee" }} />&lt;5 min (On Time)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#4ade80" }} />5–9 min (Minor)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#facc15" }} />10–14 min (Moderate)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#f97316" }} />15–19 min (High)</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: "#ef4444" }} />≥20 min (Critical)</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass rounded-xl border border-border p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4"><CheckCircle2 className="w-4 h-4 text-success" /><h3 className="font-display text-xs font-bold tracking-widest">OPERATIONAL RECOMMENDATIONS</h3></div>
                  <div className="space-y-3">{aiInsight.operationalRecommendations.map((rec, i) => (<div key={i} className="flex items-start gap-3 text-sm"><span className="font-mono text-xs text-primary bg-primary/10 rounded px-1.5 py-0.5 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span><span className="text-muted-foreground leading-relaxed">{rec}</span></div>))}</div>
                </div>
                <div className="glass rounded-xl border border-border p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-4 h-4 text-warning" /><h3 className="font-display text-xs font-bold tracking-widest">CASCADE EFFECT ANALYSIS</h3></div>
                  <div className="space-y-3">{aiInsight.cascadeEffects.map((effect, i) => (<div key={i} className="flex items-start gap-3 text-sm"><span className="w-2 h-2 rounded-full bg-warning shrink-0 mt-1.5" /><span className="text-muted-foreground leading-relaxed">{effect}</span></div>))}</div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground font-display tracking-widest">FINAL AI DELAY</span><span className={`font-mono font-bold text-lg ${delayColor(aiInsight.finalDelay)}`}>{aiInsight.finalDelay} min</span></div>
                    <div className="flex items-center justify-between text-xs mt-1"><span className="text-muted-foreground font-display tracking-widest">ML BASELINE</span><span className="font-mono font-bold text-lg text-muted-foreground">{result.predicted_delay} min</span></div>
                    <div className="flex items-center justify-between text-xs mt-1"><span className="text-muted-foreground font-display tracking-widest">AI ADJUSTMENT</span><span className={`font-mono font-bold ${aiInsight.finalDelay > result.predicted_delay ? "text-destructive" : "text-success"}`}>{aiInsight.finalDelay > result.predicted_delay ? "+" : ""}{(aiInsight.finalDelay - result.predicted_delay).toFixed(1)} min</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result && aiLoading && (
            <div className="mt-14 animate-fade-in">
              <div className="flex items-center gap-3 mb-6"><div className="h-px bg-border flex-1" /><h2 className="font-display text-sm font-bold tracking-widest text-muted-foreground flex items-center gap-2"><Brain className="w-4 h-4 animate-pulse" />GENERATING AI INTELLIGENCE SUITE...</h2><div className="h-px bg-border flex-1" /></div>
              <div className="grid md:grid-cols-3 gap-4">{[1, 2, 3].map(i => <div key={i} className="glass rounded-xl border border-border p-5 animate-pulse h-32" />)}</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-border bg-background py-8 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="TransitFlow AI" className="h-8 w-8 rounded-md bg-secondary p-1" />
              <span className="font-display text-sm font-bold tracking-wider">TRANSIT<span className="text-primary">FLOW</span> AI</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">&copy; {new Date().getFullYear()} TransitFlow AI. All Rights Reserved.</p>
            <div className="text-sm font-medium text-muted-foreground">Developed By <span className="text-primary font-bold">Pranav V P</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StepBadge = ({ label, done, active }: { label: string; done: boolean; active: boolean }) => (
  <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-display tracking-widest font-bold transition-colors ${done ? "text-success bg-success/10" : active ? "text-primary bg-primary/10 animate-pulse" : "text-muted-foreground"}`}>
    {done ? <CheckCircle2 className="w-3 h-3" /> : active ? <Loader2 className="w-3 h-3 animate-spin" /> : <div className="w-3 h-3 rounded-full border border-muted-foreground" />}
    {label}
  </div>
);

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="glass rounded-xl border border-border p-5">
    <div className="flex items-center gap-2 mb-2">{icon}<span className="font-display text-xs tracking-widest text-muted-foreground">{label}</span></div>
    <p className="text-sm text-foreground leading-relaxed">{value}</p>
  </div>
);

const Fieldset = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <fieldset className="border border-border rounded-lg p-5">
    <legend className="font-display text-xs tracking-widest text-primary font-bold px-2">{label}</legend>
    {children}
  </fieldset>
);

const NumberField = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div>
    <label className="font-display text-xs tracking-widest font-bold mb-2 block">{label}</label>
    <input type="number" value={value} onChange={(e) => onChange(+e.target.value)} className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
  </div>
);

const SelectField = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => (
  <div>
    <label className="font-display text-xs tracking-widest font-bold mb-2 block">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default Predict;