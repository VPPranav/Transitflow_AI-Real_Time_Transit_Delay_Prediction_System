import { Globe, Zap, Database, BarChart3, Shield } from "lucide-react";

const steps = [
  { num: "01", title: "DATA COLLECTION", desc: "Users input 13+ data points including temperature, humidity, wind speed, precipitation, traffic congestion, event details, and temporal information." },
  { num: "02", title: "FEATURE ENGINEERING", desc: "Raw inputs are transformed using one-hot encoding for categorical variables (season, weather, event type) and normalized for numerical features." },
  { num: "03", title: "MODEL PREDICTION", desc: "The RandomForestRegressor processes engineered features through multiple decision trees, aggregating predictions for robust delay estimation." },
  { num: "04", title: "RESULT DELIVERY", desc: "Predictions are returned with contextual explanations, severity indicators, and visualization of hourly delay patterns." },
];

const About = () => (
  <div className="min-h-screen pt-24 pb-16">
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="font-display text-4xl md:text-6xl font-black mb-4">
          ABOUT <span className="text-primary text-glow">TRANSITFLOW AI</span>
        </h1>
        <p className="text-muted-foreground text-lg">Understanding our AI-powered transit delay prediction system</p>
      </div>

      {/* System Overview */}
      <div className="glass rounded-lg p-8 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="font-display text-sm font-bold tracking-widest">SYSTEM OVERVIEW</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4">
          TransitFlow AI is an advanced machine learning system designed to predict public transport delays based on real-time environmental and contextual data. Our system analyzes multiple factors including weather conditions, traffic patterns, time of day, and local events to provide accurate delay predictions.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The prediction engine uses a <strong className="text-foreground">RandomForestRegressor</strong> model, trained on comprehensive transit data to identify patterns and correlations that affect transport schedules.
        </p>
      </div>

      {/* How It Works */}
      <div className="glass rounded-lg p-8 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="font-display text-sm font-bold tracking-widest">HOW IT WORKS</h2>
        </div>
        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary font-display text-sm font-bold flex items-center justify-center">{s.num}</span>
              <div>
                <h3 className="font-display text-xs tracking-widest font-bold mb-1">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech + Disclaimer */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass rounded-lg p-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="font-display text-sm font-bold tracking-widest">TECH STACK</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>• <strong className="text-foreground">Frontend:</strong> React.js + TypeScript</li>
            <li>• <strong className="text-foreground">Backend:</strong> FastAPI (Python)</li>
            <li>• <strong className="text-foreground">ML Model:</strong> RandomForestRegressor</li>
            <li>• <strong className="text-foreground">Visualization:</strong> Recharts</li>
            <li>• <strong className="text-foreground">Data Processing:</strong> pandas, scikit-learn</li>
          </ul>
        </div>
        <div className="glass rounded-lg p-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-display text-sm font-bold tracking-widest">DISCLAIMER</h2>
          </div>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>• Dataset is synthetic — predictions are approximate</li>
            <li>• Model MAE ≈ 8 minutes</li>
            <li>• No real-time API integration</li>
            <li>• For demonstration purposes only</li>
            <li>• Showcases AI + Full Stack development</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default About;
