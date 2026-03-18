import { useState } from "react";
import { Loader2, BarChart3, AlertCircle, Info } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { simulatePredict, generateHourlyDelays, type PredictionInput, type PredictionResult } from "@/lib/predict";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SEASONS = ["Winter", "Spring", "Summer", "Autumn"];
const WEATHER = ["Clear", "Rain", "Snow", "Storm"];
const EVENTS = ["None", "Sports", "Concert", "Festival"];

const Predict = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [hourlyData, setHourlyData] = useState<{ hour: string; delay: number }[]>([]);

  const [form, setForm] = useState<PredictionInput>({
    temperature_C: 25, humidity_percent: 60, wind_speed_kmh: 20, precipitation_mm: 5,
    traffic_congestion_index: 50, event_attendance_est: 0, holiday: 0, peak_hour: 0,
    weekday: 4, hour: 18, season: "Summer", weather_condition: "Clear", event_type: "None",
  });

  const update = (key: keyof PredictionInput, val: string | number) =>
    setForm((p) => ({ ...p, [key]: val }));

  const predict = async () => {
    setLoading(true);
    const res = await simulatePredict(form);
    const hourly = await generateHourlyDelays(form);
    setResult(res);
    setHourlyData(hourly);
    setLoading(false);
  };

  const delayColor = (d: number) => (d < 5 ? "text-success" : d <= 15 ? "text-warning" : "text-destructive");
  const delayLabel = (d: number) => (d < 5 ? "On Time" : d <= 15 ? "Moderate Delay" : "Significant Delay");

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Weather */}
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

            {/* Traffic & Time */}
            <Fieldset label="TRAFFIC & TIME">
              <div className="space-y-4">
                <div>
                  <label className="font-display text-xs tracking-widest font-bold mb-2 block">
                    TRAFFIC CONGESTION: {form.traffic_congestion_index}%
                  </label>
                  <input
                    type="range" min="0" max="100" value={form.traffic_congestion_index}
                    onChange={(e) => update("traffic_congestion_index", +e.target.value)}
                    className="w-full accent-primary h-2 bg-secondary rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <SelectField label="WEEKDAY (0-6)" value={WEEKDAYS[form.weekday]} options={WEEKDAYS} onChange={(v) => update("weekday", WEEKDAYS.indexOf(v))} />
                  <NumberField label="HOUR (0-23)" value={form.hour} onChange={(v) => update("hour", Math.min(23, Math.max(0, v)))} />
                  <SelectField label="PEAK HOUR" value={form.peak_hour === 1 ? "Yes" : "No"} options={["No", "Yes"]} onChange={(v) => update("peak_hour", v === "Yes" ? 1 : 0)} />
                  <SelectField label="HOLIDAY" value={form.holiday === 1 ? "Yes" : "No"} options={["No", "Yes"]} onChange={(v) => update("holiday", v === "Yes" ? 1 : 0)} />
                </div>
              </div>
            </Fieldset>

            {/* Events */}
            <Fieldset label="EVENTS">
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="EVENT TYPE" value={form.event_type} options={EVENTS} onChange={(v) => update("event_type", v)} />
                <NumberField label="EVENT ATTENDANCE (EST.)" value={form.event_attendance_est} onChange={(v) => update("event_attendance_est", v)} />
              </div>
            </Fieldset>

            <button
              onClick={predict}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-display text-sm font-bold tracking-widest py-4 hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> PREDICTING...</> : "PREDICT DELAY"}
            </button>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {result && (
              <>
                {/* Prediction result */}
                <div className="glass rounded-lg p-6 border-glow animate-fade-in">
                  <h3 className="font-display text-xs tracking-widest text-muted-foreground mb-4">PREDICTION RESULT</h3>
                  <div className="text-center py-4">
                    <p className={`font-mono text-6xl font-bold ${delayColor(result.predicted_delay)}`}>
                      {result.predicted_delay}
                    </p>
                    <p className="font-display text-xs tracking-widest text-muted-foreground mt-2">MINUTES DELAY</p>
                    <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold font-display tracking-wider ${result.predicted_delay < 5 ? "bg-success/20 text-success" :
                        result.predicted_delay <= 15 ? "bg-warning/20 text-warning" :
                          "bg-destructive/20 text-destructive"
                      }`}>
                      {delayLabel(result.predicted_delay)}
                    </span>
                  </div>
                  {result.factors.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="font-display text-xs tracking-widest text-muted-foreground mb-2">KEY FACTORS</p>
                      <div className="space-y-1">
                        {result.factors.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className={`w-2 h-2 rounded-full ${f.impact === "high" ? "bg-destructive" : "bg-warning"}`} />
                            {f.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-muted-foreground text-sm mt-4 leading-relaxed">{result.explanation}</p>
                </div>

                {/* Main Hourly Chart */}
                <div className="glass rounded-lg border border-border p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <h3 className="font-display text-xs font-bold tracking-widest mb-1 text-foreground">HOURLY DELAY FORECAST</h3>
                  <p className="text-muted-foreground text-xs mb-4">Predicted delay trend over the day</p>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12, color: "hsl(var(--foreground))" }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <ReferenceLine y={5} stroke="hsl(var(--success))" strokeDasharray="5 5" />
                      <ReferenceLine y={15} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="delay" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--background))", stroke: "hsl(var(--primary))", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-4 mt-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success" /> &lt;5 MIN (ON-TIME)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> 5-15 MIN (MODERATE)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-destructive" /> &gt;15 MIN (SIGNIFICANT)</span>
                  </div>
                </div>

              </>
            )}
            {!result && (
              <div className="glass rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center animate-fade-in min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <BarChart3 className="w-8 h-8 text-primary opacity-80" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">Awaiting Parameters</h3>
                <p className="text-muted-foreground text-sm max-w-[250px]">Adjust the controls on the left and click Predict Delay to generate machine learning forecasts.</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Insight Graphs - Spanning Full Width */}
        {result && (
          <div className="mt-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px bg-border flex-1" />
              <h2 className="font-display text-sm font-bold tracking-widest text-muted-foreground">DEEP DIVE INSIGHTS</h2>
              <div className="h-px bg-border flex-1" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Weather Impact Chart */}
              <div className="glass rounded-xl border border-border p-5 shadow-lg">
                <h3 className="font-display text-xs font-bold tracking-widest mb-1 text-foreground">WEATHER SCENARIOS</h3>
                <p className="text-muted-foreground text-xs mb-4">How weather alters this route</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={[
                    { name: "Clear", delay: Math.max(0, result.predicted_delay - (form.weather_condition === "Clear" ? 0 : 3)) },
                    { name: "Current", delay: result.predicted_delay },
                    { name: "Rain", delay: result.predicted_delay + (form.weather_condition === "Rain" ? 0 : 2) },
                    { name: "Storm", delay: result.predicted_delay + (form.weather_condition === "Storm" ? 0 : 6) }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} width={30} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12, color: "hsl(var(--foreground))" }} cursor={{ fill: 'hsl(var(--border))', opacity: 0.4 }} />
                    <Bar dataKey="delay" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 text-xs text-muted-foreground italic border-t border-border/50 pt-2">Insight: Rain and Storms significantly elevate delays compared to clear days.</div>
              </div>

              {/* Factor Sensitivity */}
              <div className="glass rounded-xl border border-border p-5 shadow-lg">
                <h3 className="font-display text-xs font-bold tracking-widest mb-1 text-foreground">SENSITIVITY ANALYSIS</h3>
                <p className="text-muted-foreground text-xs mb-4">Relative impact of current inputs</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart layout="vertical" data={[
                    { name: "Traffic", impact: form.traffic_congestion_index * 0.1 },
                    { name: "Weather", impact: form.weather_condition === "Clear" ? 1 : 5 },
                    { name: "Time", impact: (form.hour >= 7 && form.hour <= 19) ? 4 : 1 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} hide />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={50} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12, color: "hsl(var(--foreground))" }} cursor={{ fill: 'hsl(var(--border))', opacity: 0.4 }} />
                    <Bar dataKey="impact" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 text-xs text-muted-foreground italic border-t border-border/50 pt-2">Insight: Longer bars indicate a larger relative impact on final delay time.</div>
              </div>

              {/* Weekly Trend Comparison */}
              <div className="glass rounded-xl border border-border p-5 shadow-lg">
                <h3 className="font-display text-xs font-bold tracking-widest mb-1 text-foreground">WEEKLY VARIANCE</h3>
                <p className="text-muted-foreground text-xs mb-4">Historical delay variations</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={[
                    { day: "Mon", delay: result.predicted_delay },
                    { day: "Wed", delay: Math.max(0, result.predicted_delay - 2) },
                    { day: "Fri", delay: result.predicted_delay + 3 },
                    { day: "Sun", delay: Math.max(0, result.predicted_delay - 4) }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} width={30} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12, color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="delay" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ fill: "hsl(var(--background))", stroke: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-3 text-xs text-muted-foreground italic border-t border-border/50 pt-2">Insight: Traffic patterns show heavy spikes on Monday and Friday vs weekends.</div>
              </div>

              {/* Event Impact */}
              <div className="glass rounded-xl border border-border p-5 shadow-lg">
                <h3 className="font-display text-xs font-bold tracking-widest mb-1 text-foreground">EVENT IMPACT</h3>
                <p className="text-muted-foreground text-xs mb-4">Delay variance by event type</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={[
                    { name: "None", delay: Math.max(0, result.predicted_delay - (form.event_type === "None" ? 0 : 4)) },
                    { name: "Sports", delay: result.predicted_delay + (form.event_type === "Sports" ? 0 : 3) },
                    { name: "Concert", delay: result.predicted_delay + (form.event_type === "Concert" ? 0 : 4) },
                    { name: "Festival", delay: result.predicted_delay + (form.event_type === "Festival" ? 0 : 5) }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} width={30} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12, color: "hsl(var(--foreground))" }} cursor={{ fill: 'hsl(var(--border))', opacity: 0.4 }} />
                    <Bar dataKey="delay" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 text-xs text-muted-foreground italic border-t border-border/50 pt-2">Insight: Major events substantially increase the expected transit travel time.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable form components
const Fieldset = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <fieldset className="border border-border rounded-lg p-5">
    <legend className="font-display text-xs tracking-widest text-primary font-bold px-2">{label}</legend>
    {children}
  </fieldset>
);

const NumberField = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div>
    <label className="font-display text-xs tracking-widest font-bold mb-2 block">{label}</label>
    <input
      type="number" value={value} onChange={(e) => onChange(+e.target.value)}
      className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
    />
  </div>
);

const SelectField = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => (
  <div>
    <label className="font-display text-xs tracking-widest font-bold mb-2 block">{label}</label>
    <select
      value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default Predict;
