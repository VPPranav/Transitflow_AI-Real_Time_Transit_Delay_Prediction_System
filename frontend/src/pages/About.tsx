import { Globe, Zap, Database, BarChart3, Shield, Brain, Layers, TrendingUp, Clock, GitBranch, AlertTriangle, Map, Eye, Activity } from "lucide-react";
import logo from "@/assets/logo.png";

const steps = [
  {
    num: "01",
    title: "DATA COLLECTION",
    desc: "Users input 13+ data points including temperature, humidity, wind speed, precipitation, traffic congestion index, event details, and temporal information such as hour, weekday, and peak status.",
  },
  {
    num: "02",
    title: "FEATURE ENGINEERING",
    desc: "Raw inputs are transformed using interaction terms (traffic×weather), sigmoid-scaled stress functions for temperature extremes, logarithmic event attendance scaling, bimodal temporal demand curves, and one-hot encoding for categorical variables — producing 24+ engineered features.",
  },
  {
    num: "03",
    title: "ENSEMBLE ML PREDICTION",
    desc: "A physics-informed local ensemble model combines five component scores: traffic×weather interaction (nonlinear), temporal demand (bimodal AM/PM curve), environmental stress (sigmoid-scaled), event pressure (log-scaled), and seasonal baseline — with an empirical calibration correction layer. When the FastAPI RandomForestRegressor backend is available, predictions are blended 80/20 for maximum robustness.",
  },
  {
    num: "04",
    title: "AI SECOND-LAYER ANALYSIS",
    desc: "The ML baseline is passed to a Claude AI layer which applies probabilistic compounding, cascade effect modeling, and operational heuristics — producing an adjusted final delay, confidence interval, risk score (0–100), compliance flags, and executive-level text intelligence.",
  },
  {
    num: "05",
    title: "3D VISUALISATION + INTELLIGENCE DELIVERY",
    desc: "Results are rendered across three visualisation layers: (1) a 3D isometric city transit map with animated vehicles, congestion heatmap nodes, and weather particle effects; (2) a volumetric 3D bar heatmap of hourly delays with 5-tier colour coding; (3) a live input snapshot panel with real-time weather, congestion, and status monitoring. The full suite includes 9 analytics charts, SLA flags, departure windows, and operational recommendations.",
  },
];

const techStack = [
  { label: "Frontend", value: "React.js + TypeScript" },
  { label: "Backend", value: "FastAPI (Python)" },
  { label: "ML Model", value: "RandomForestRegressor (scikit-learn)" },
  { label: "Local Ensemble", value: "Physics-informed multi-component model" },
  { label: "AI Layer", value: "Claude Haiku (Anthropic API)" },
  { label: "3D Visualisation", value: "Canvas 2D API (isometric rendering)" },
  { label: "Charts", value: "Recharts (9 chart types)" },
  { label: "Data Processing", value: "pandas, scikit-learn, joblib" },
  { label: "Feature Count", value: "24+ engineered features" },
  { label: "Styling", value: "Tailwind CSS + custom glass morphism" },
];

const metrics = [
  { icon: TrendingUp, label: "MODEL MAE", value: "~8 min", sub: "Mean absolute error on test set" },
  { icon: Clock, label: "RESPONSE TIME", value: "<3s", sub: "ML + AI layer combined latency" },
  { icon: Layers, label: "FEATURES", value: "24+", sub: "Engineered input features" },
  { icon: GitBranch, label: "DECISION TREES", value: "100+", sub: "Random forest ensemble size" },
  { icon: Map, label: "3D MAP", value: "Live", sub: "Animated transit network overlay" },
  { icon: Eye, label: "INPUT MONITOR", value: "Real-time", sub: "Live snapshot as you type" },
  { icon: BarChart3, label: "CHARTS", value: "9", sub: "Full analytics output suite" },
  { icon: Activity, label: "BLEND MODE", value: "80/20", sub: "Backend + local model fusion" },
];

const aiCapabilities = [
  { icon: Brain, title: "PROBABILISTIC ADJUSTMENT", desc: "The AI layer applies compounding multipliers — weather severity, event pressure, congestion intensity — on top of the ensemble ML baseline to produce a more realistic final delay figure." },
  { icon: BarChart3, title: "CONFIDENCE INTERVALS", desc: "A 90% prediction interval is computed based on uncertainty factors: adverse weather, active events, and high congestion all widen the band to communicate forecast reliability." },
  { icon: AlertTriangle, title: "CASCADE EFFECT MODELING", desc: "Downstream systemic effects are identified — schedule compression, parallel route saturation, passenger load redistribution — giving operators a network-wide perspective." },
  { icon: Shield, title: "SLA COMPLIANCE FLAGS", desc: "Predictions above 10 or 20-minute thresholds automatically trigger compliance warnings, enabling network control teams to escalate before service standards are breached." },
];

const newFeatures = [
  {
    icon: Map,
    title: "3D ANIMATED TRANSIT MAP",
    desc: "An isometric city canvas renders in real time: transit vehicles animate along routes with speed proportional to congestion, radial heatmap circles pulse at network nodes, weather effects render as rain streaks or snowflakes, and an event hotspot node appears when events are active. The entire map re-renders whenever risk level or congestion inputs change.",
  },
  {
    icon: Eye,
    title: "LIVE INPUT SNAPSHOT PANEL",
    desc: "A persistent panel below the prediction pipeline tracker reflects your current form state in real time — no need to run a prediction to see it. Shows weather condition icon, colour-coded congestion bar with severity label, 4 environmental mini-stats (temperature, humidity, wind, precipitation) with alert thresholds, and status chips for peak hour, holiday, and active event.",
  },
  {
    icon: Activity,
    title: "IMPROVED ENSEMBLE MODEL ACCURACY",
    desc: "The local fallback model was rebuilt from a simple linear heuristic into a 5-component physics-informed ensemble: (1) Traffic×Weather nonlinear interaction term with sigmoid wet-road multiplier; (2) bimodal temporal demand curve with per-weekday multipliers; (3) sigmoid-based environmental stress for freezing/extreme heat/wind; (4) logarithmic event attendance scaling; (5) calibration residual correction. This significantly tightens local error bounds, especially under compound conditions.",
  },
  {
    icon: Layers,
    title: "ENHANCED 3D HEATMAP",
    desc: "The hourly delay heatmap was rebuilt from flat 2D bars into a proper isometric 3D rendering: each bar has a lit top face, a shadowed right face, and a gradient-filled front face. Five colour tiers (cyan → green → yellow → orange → red) map delay severity. DPR-aware canvas rendering ensures pixel-perfect output on HiDPI displays. A ResizeObserver ensures the chart adapts to any container width.",
  },
];

const About = () => (
  <div className="min-h-screen flex flex-col">
    <div className="flex-1 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block border border-primary/40 px-4 py-1.5 mb-6 bg-background/50 backdrop-blur-sm rounded-full">
            <span className="font-display text-xs tracking-[0.3em] text-primary">ENSEMBLE ML + AI LAYER + 3D VISUALISATION ARCHITECTURE</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black mb-4">
            ABOUT <span className="text-primary text-glow">TRANSITFLOW AI</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            An enterprise-grade transit intelligence platform combining a physics-informed ensemble ML model with a Claude AI reasoning layer, a live 3D animated city map, and a real-time input monitoring panel — delivering fast, explainable, and operationally actionable delay predictions.
          </p>
        </div>

        {/* System Overview */}
        <div className="glass rounded-lg p-8 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="font-display text-sm font-bold tracking-widest">SYSTEM OVERVIEW</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            TransitFlow AI is an advanced multi-layer prediction system designed to forecast public transport delays based on environmental, temporal, and contextual data. The platform combines a <strong className="text-foreground">physics-informed ensemble model</strong> (five component scores with calibration correction), optionally blended with a backend <strong className="text-foreground">RandomForestRegressor</strong>, followed by a <strong className="text-foreground">Claude AI second-layer</strong> that applies probabilistic reasoning, cascade effect analysis, and operational intelligence.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Unlike single-model systems, TransitFlow AI's architecture separates <strong className="text-foreground">statistical pattern recognition</strong> (ensemble ML) from <strong className="text-foreground">contextual operational reasoning</strong> (AI layer) — and adds a third tier: <strong className="text-foreground">real-time 3D visualisation</strong>. The animated isometric transit map renders network risk live, with vehicles, congestion hotspots, and weather effects updating immediately when inputs change.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The result is a prediction suite that functions like a transit operations control room: it estimates delay with high accuracy, explains contributing factors, quantifies uncertainty, projects cascade effects, prescribes corrective action, and displays the entire network state in a live 3D render — all in under 3 seconds.
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          {metrics.map((m, i) => (
            <div key={i} className="glass rounded-lg p-5 text-center border border-primary/10">
              <m.icon className="w-5 h-5 text-primary mx-auto mb-3" />
              <p className="font-display text-xs tracking-widest text-muted-foreground mb-1">{m.label}</p>
              <p className="font-mono text-2xl font-bold text-primary">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-tight">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* New Features Section */}
        <div className="glass rounded-lg p-8 mb-8 animate-fade-in" style={{ animationDelay: "0.17s" }}>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="font-display text-sm font-bold tracking-widest">RECENTLY ADDED FEATURES</h2>
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full tracking-wider font-display font-bold">NEW</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">Four major enhancements added in the latest release — expanding visualisation capabilities, live monitoring, and prediction accuracy.</p>
          <div className="grid md:grid-cols-2 gap-5">
            {newFeatures.map((f, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg bg-primary/5 border border-primary/15">
                <f.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-xs tracking-widest font-bold mb-1.5 flex items-center gap-2">
                    {f.title}
                    <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded tracking-wider">NEW</span>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="glass rounded-lg p-8 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="font-display text-sm font-bold tracking-widest">PREDICTION PIPELINE</h2>
          </div>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={s.num} className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary font-display text-sm font-bold flex items-center justify-center">{s.num}</span>
                  {i < steps.length - 1 && <div className="w-px flex-1 bg-border min-h-[16px]" />}
                </div>
                <div className="pb-2">
                  <h3 className="font-display text-xs tracking-widest font-bold mb-1 flex items-center gap-2">
                    {s.title}
                    {(s.num === "03" || s.num === "05") && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full tracking-wider">UPDATED</span>}
                    {s.num === "04" && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full tracking-wider">AI</span>}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Layer Deep Dive */}
        <div className="glass rounded-lg p-8 mb-8 animate-fade-in" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="font-display text-sm font-bold tracking-widest">AI SECOND-LAYER CAPABILITIES</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            After the ensemble ML model produces a baseline delay, the Claude AI layer performs a second-pass analysis. All numeric computations (risk scores, confidence intervals, radar data, departure windows) are resolved instantly in-browser using deterministic formulas — then the AI generates contextual text intelligence (executive summary, recommendations, cascade effects) in under 3 seconds.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {aiCapabilities.map((cap, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <cap.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-xs tracking-widest font-bold mb-1">{cap.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Output Analytics */}
        <div className="glass rounded-lg p-8 mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="font-display text-sm font-bold tracking-widest">ANALYTICS OUTPUT SUITE</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">Every prediction run produces a full intelligence suite across three display tiers:</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { tier: "TIER 1 — RESULT CARDS", items: ["ML baseline delay (minutes)", "AI-adjusted final delay", "90% confidence interval", "Risk gauge (0–100 score)", "Risk level: LOW / MODERATE / HIGH / CRITICAL", "Executive summary (AI-generated)", "SLA compliance flags"] },
              { tier: "TIER 2 — 3D VISUALISATIONS", items: ["3D isometric transit network map (live animated)", "3D volumetric heatmap (19-hour, 5-tier colour)", "Animated vehicles + congestion heatmap nodes", "Weather particle effects (rain, snow)", "Live input snapshot panel (real-time)"] },
              { tier: "TIER 3 — DEEP DIVE CHARTS", items: ["Hourly delay forecast (area chart)", "Risk radar (6-axis spider)", "Risk decomposition (per-factor scores)", "Confidence envelope chart", "Weather scenario comparison", "Event impact analysis", "Weekly variance projection"] },
            ].map((block, i) => (
              <div key={i} className="rounded-lg border border-border p-5">
                <p className="font-display text-xs tracking-widest font-bold text-primary mb-3">{block.tier}</p>
                <ul className="space-y-1.5">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack + Disclaimer */}
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: "0.35s" }}>
          <div className="glass rounded-lg p-8">
            <div className="flex items-center gap-3 mb-5">
              <Database className="w-5 h-5 text-primary" />
              <h2 className="font-display text-sm font-bold tracking-widest">TECH STACK</h2>
            </div>
            <div className="space-y-2.5">
              {techStack.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-3 text-sm border-b border-border/40 pb-2 last:border-0 last:pb-0">
                  <span className="text-muted-foreground shrink-0">{item.label}</span>
                  <span className="text-foreground font-medium text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-lg p-8">
            <div className="flex items-center gap-3 mb-5">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="font-display text-sm font-bold tracking-widest">DISCLAIMER & NOTES</h2>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Synthetic dataset", note: "Predictions are approximate and for demonstration only" },
                { label: "Model MAE ≈ 8 min", note: "Performance measured on held-out test split" },
                { label: "No live API feeds", note: "Inputs are manually entered — no real-time data source" },
                { label: "AI text generation", note: "Executive summaries are Claude-generated and non-deterministic" },
                { label: "Local ensemble fallback", note: "Physics-informed model runs standalone when backend is offline" },
                { label: "80/20 blend mode", note: "Backend RandomForest and local model are fused when both available" },
                { label: "3D map is illustrative", note: "Isometric city is a visualisation layer, not a live geo map" },
                { label: "Purpose", note: "Showcases full-stack ML + LLM + 3D canvas integration in a production-grade UI" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <span>
                    <strong className="text-foreground">{item.label} — </strong>
                    <span className="text-muted-foreground">{item.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

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

export default About;