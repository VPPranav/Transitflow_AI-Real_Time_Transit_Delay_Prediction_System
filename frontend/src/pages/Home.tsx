import { Link } from "react-router-dom";
import {
  ArrowRight, BarChart3, CloudRain, ShieldCheck, MapPin,
  Clock, Activity, Zap, TrendingUp, Smartphone, Globe,
  Brain, Layers, AlertTriangle, GitBranch, Map, Eye,
} from "lucide-react";
import heroImg from "@/assets/hero-city.jpg";
import logo from "@/assets/logo.png";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <img src={heroImg} alt="City at night" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80 dark:bg-background/90 transition-colors duration-300" />
        <div className="relative container mx-auto px-4 pt-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-block border border-primary/40 px-4 py-1.5 mb-6 bg-background/50 backdrop-blur-sm rounded-full">
              <span className="font-display text-xs tracking-[0.3em] text-primary">ML ENSEMBLE + AI SECOND-LAYER + 3D VISUALISATION</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95] mb-6 tracking-tight">
              PREDICT TRANSIT<br />
              <span className="text-primary text-glow">DELAYS</span> WITH AI
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mb-8 leading-relaxed">
              A dual-layer intelligence platform: a physics-informed ensemble model produces a high-accuracy baseline, Claude AI applies probabilistic reasoning and cascade analysis, and a live 3D city map renders network risk in real time — all in under 3 seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/predict" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display text-sm font-bold tracking-wider px-8 py-4 rounded hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                START PREDICTION <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 border border-primary/50 bg-background/50 backdrop-blur text-foreground font-display text-sm font-bold tracking-wider px-8 py-4 rounded hover:bg-primary/10 transition-colors">
                LEARN MORE
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              {["Ensemble ML Model", "→", "Claude AI Layer", "→", "3D Network Map", "→", "Full Analytics"].map((item, i) => (
                item === "→"
                  ? <span key={i} className="text-primary font-bold">→</span>
                  : <span key={i} className="font-display text-xs tracking-wider px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary">{item}</span>
              ))}
            </div>
          </div>

          {/* Stats card */}
          <div className="glass rounded-xl p-8 min-w-[280px] animate-fade-in border border-primary/20 shadow-2xl" style={{ animationDelay: "0.3s" }}>
            <div className="space-y-7 py-2">
              <div className="text-center">
                <p className="font-mono text-5xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">~8min</p>
                <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mt-2">MODEL MAE (ACCURACY)</p>
              </div>
              <div className="border-t border-border" />
              <div className="text-center">
                <p className="font-mono text-4xl font-bold">24+</p>
                <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mt-2">ENGINEERED FEATURES</p>
              </div>
              <div className="border-t border-border" />
              <div className="text-center">
                <p className="font-mono text-4xl font-bold">&lt;3s</p>
                <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mt-2">ML + AI RESPONSE TIME</p>
              </div>
              <div className="border-t border-border" />
              <div className="text-center">
                <p className="font-mono text-4xl font-bold text-primary">3</p>
                <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mt-2">VISUALISATION LAYERS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Architecture Banner ── */}
      <section className="py-10 bg-primary/5 border-y border-primary/10 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-center">
            {[
              { icon: BarChart3, title: "LAYER 1: ENSEMBLE ML", sub: "Physics-informed multi-component model" },
              null,
              { icon: Brain, title: "LAYER 2: AI ANALYSIS", sub: "Claude probabilistic reasoning" },
              null,
              { icon: Map, title: "3D TRANSIT MAP", sub: "Live animated network risk overlay" },
              null,
              { icon: Activity, title: "FULL ANALYTICS", sub: "9 charts + live input snapshot" },
            ].map((item, i) => item === null
              ? <div key={i} className="hidden md:flex items-center text-primary font-bold text-xl">→</div>
              : <div key={i} className="flex flex-col items-center gap-1">
                <item.icon className="w-6 h-6 text-primary mb-1" />
                <span className="font-display text-xs font-bold tracking-widest">{item.title}</span>
                <span className="text-muted-foreground text-xs">{item.sub}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Features Overview ── */}
      <section className="py-24 bg-background relative border-t border-border/50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">ENTERPRISE-GRADE <span className="text-primary">CAPABILITIES</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Three prediction and visualisation layers, nine analytics charts, a live input monitor, and a 3D animated city map — built for transit operators and data-driven commuters alike.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "High-Accuracy Ensemble Model", desc: "A physics-informed multi-component model replaces simple heuristics: traffic×weather interaction terms, bimodal temporal demand curves, sigmoid environmental stress functions, logarithmic event scaling, and empirical calibration corrections combine for significantly tighter error bounds." },
              { icon: Brain, title: "AI Reasoning Layer", desc: "Claude applies probabilistic compounding, cascade effect modeling, and contextual heuristics on top of the ML output — producing adjusted delay, confidence interval, risk score, SLA flags, and operational recommendations in under 3 seconds." },
              { icon: Layers, title: "Full Analytics Suite", desc: "9 charts including a 3D isometric heatmap, risk radar, confidence envelope, weather/event scenarios, and weekly variance — plus a live input snapshot panel that updates in real time as you configure inputs, and a 3D animated transit network map." },
              { icon: Map, title: "3D Animated Transit Map", desc: "An isometric city rendering with animated transit vehicles, radial congestion heatmap overlays at network nodes, weather particle effects (rain streaks, snowfall), and a live risk-coloured route network — all reflecting your exact inputs." },
              { icon: Eye, title: "Live Input Snapshot", desc: "A persistent panel below the pipeline tracker shows your current input configuration: weather condition with icon, a colour-coded congestion progress bar, 4 environmental mini-stats with alert thresholds, and peak/holiday/event status chips." },
              { icon: ShieldCheck, title: "Backend + Local Ensemble Blend", desc: "When the FastAPI backend responds, its prediction is blended 80/20 with the local ensemble for robustness. When offline, the local model runs standalone — ensuring the platform is fully functional without any backend dependency." },
            ].map((card, i) => (
              <div key={i} className="glass p-8 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors group">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg mb-3">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-secondary/30 relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">HOW IT <span className="text-primary">WORKS</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A 5-stage prediction pipeline: data collection → feature engineering → ensemble ML prediction → AI second-layer analysis → full analytics + 3D visualisation delivery.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CloudRain, title: "Weather + Environment", desc: "Ingests temperature, humidity, precipitation, wind speed, and weather condition. The ensemble model uses sigmoid-scaled extreme temperature stress, nonlinear wind speed impact, and humidity uplift — not simple linear weights." },
              { icon: MapPin, title: "Traffic & Temporal", desc: "Congestion index (0–100) interacts nonlinearly with weather via a multiplicative term. Hour-of-day uses a bimodal demand curve (AM peak 7–9, PM peak 16–19) with per-weekday multipliers and holiday discounts." },
              { icon: BarChart3, title: "Events & Season", desc: "Event attendance scales logarithmically (congestion saturates). Season applies a baseline modifier, with a compound penalty for Winter + Snow/Storm. All terms feed into the ensemble sum before calibration correction." },
              { icon: ShieldCheck, title: "ML + AI Ensemble", desc: "The ensemble local model and backend RandomForest are blended 80/20. Claude AI then applies a second-pass: probabilistic compounding, cascade modeling, SLA flags, confidence intervals, and 3D risk visualisation." },
            ].map((card, i) => (
              <div key={i} className="glass p-8 rounded-xl border border-primary/10 hover:border-primary/40 transition-all hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-primary"><card.icon className="w-6 h-6" /></div>
                <h3 className="font-display font-bold text-xl mb-3">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Output Highlights ── */}
      <section className="py-24 bg-background border-t border-border/50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">WHAT THE <span className="text-primary">PLATFORM</span> DELIVERS</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Beyond a single number — a complete operational intelligence briefing with 3D visualisations, live input monitoring, and AI-generated recommendations every time you predict.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, label: "AI-ADJUSTED DELAY", desc: "Final delay refined by probabilistic compounding across weather, events, and congestion — on top of the ensemble ML baseline." },
              { icon: Activity, label: "CONFIDENCE INTERVAL", desc: "90% prediction band that widens under uncertain conditions like storms, festivals, or high congestion." },
              { icon: AlertTriangle, label: "RISK GAUGE (0–100)", desc: "Composite risk score with LOW / MODERATE / HIGH / CRITICAL classification and automatic SLA breach flags." },
              { icon: Map, label: "3D TRANSIT MAP", desc: "Animated isometric city with live vehicles, congestion heatmap nodes, weather particle effects, and a risk-coloured route network." },
              { icon: Eye, label: "LIVE INPUT SNAPSHOT", desc: "Real-time panel showing weather icon, congestion bar, 4 environmental stat mini-cards, and peak/holiday/event status chips — always in sync with your form." },
              { icon: GitBranch, label: "CASCADE EFFECTS", desc: "Downstream systemic impacts: schedule compression, parallel route saturation, and passenger load redistribution." },
              { icon: TrendingUp, label: "RECOMMENDATIONS", desc: "3–5 operator-level actions: dispatch frequency adjustments, corridor diversions, event fleet pre-positioning." },
              { icon: Clock, label: "OPTIMAL DEPARTURE", desc: "Best travel window with lowest delay exposure, derived from the 19-point hourly forecast curve." },
              { icon: Globe, label: "9 ANALYTICS CHARTS", desc: "3D heatmap, risk radar, confidence envelope, weather & event scenarios, weekly variance, and a composited risk decomposition breakdown." },
            ].map((item, i) => (
              <div key={i} className="glass p-6 rounded-xl border border-primary/10 hover:border-primary/30 transition-all group">
                <item.icon className="w-5 h-5 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xs font-bold tracking-widest mb-2">{item.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-primary/5 relative overflow-hidden border-t border-b border-primary/10 transition-colors duration-300">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <h2 className="font-display text-4xl font-bold mb-6">
                READY FOR <span className="text-primary">ENTERPRISE-GRADE</span> TRANSIT INTELLIGENCE?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Run the full pipeline: ensemble ML baseline → AI reasoning → 3D network map → 9-chart analytics suite + live input monitor. Get a complete operational briefing in under 3 seconds.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/predict" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display text-sm font-bold tracking-wider px-8 py-4 rounded hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                  TRY PREDICTION ENGINE <TrendingUp className="w-4 h-4 ml-2" />
                </Link>
                <Link to="/about" className="inline-flex items-center gap-2 border border-primary/50 bg-background/50 backdrop-blur text-foreground font-display text-sm font-bold tracking-wider px-8 py-4 rounded hover:bg-primary/10 transition-colors">
                  READ THE DOCS
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Clock, value: "<3s", label: "Total Prediction Time" },
                  { icon: Brain, value: "2", label: "AI Prediction Layers" },
                  { icon: BarChart3, value: "9", label: "Analytics Charts" },
                  { icon: Smartphone, value: "24+", label: "Engineered Features" },
                  { icon: Map, value: "3D", label: "Transit Network Map" },
                  { icon: Eye, value: "Live", label: "Input Snapshot Panel" },
                ].map(({ icon: Icon, value, label }, i) => (
                  <div key={i} className="glass p-6 rounded-xl flex flex-col justify-center items-center text-center">
                    <Icon className="text-primary w-8 h-8 mb-3" />
                    <span className="text-2xl font-bold font-mono">{value}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default Home;