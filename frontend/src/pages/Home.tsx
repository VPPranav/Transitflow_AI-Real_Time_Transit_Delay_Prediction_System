import { Link } from "react-router-dom";
import { 
  ArrowRight, BarChart3, CloudRain, ShieldCheck, MapPin, 
  Clock, Activity, Zap, TrendingUp, Smartphone, Globe 
} from "lucide-react";
import heroImg from "@/assets/hero-city.jpg";
import logo from "@/assets/logo.png";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <img src={heroImg} alt="City at night" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80 dark:bg-background/90 transition-colors duration-300" />
        <div className="relative container mx-auto px-4 pt-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-block border border-primary/40 px-4 py-1.5 mb-6 bg-background/50 backdrop-blur-sm rounded-full">
              <span className="font-display text-xs tracking-[0.3em] text-primary">POWERED BY MACHINE LEARNING</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.95] mb-6 tracking-tight">
              PREDICT TRANSIT<br />
              <span className="text-primary text-glow">DELAYS</span> IN REAL-TIME
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mb-8 leading-relaxed">
              AI-powered prediction system that analyzes weather, traffic, and events to forecast public transport delays with precision. Make smarter commute decisions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/predict"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display text-sm font-bold tracking-wider px-8 py-4 rounded hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,255,255,0.4)]"
              >
                START PREDICTION <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border border-primary/50 bg-background/50 backdrop-blur text-foreground font-display text-sm font-bold tracking-wider px-8 py-4 rounded hover:primary/10 transition-colors"
              >
                LEARN MORE
              </Link>
            </div>
          </div>

          {/* Stats card */}
          <div className="glass rounded-xl p-8 min-w-[280px] animate-fade-in border border-primary/20 shadow-2xl" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              <div className="space-y-8 py-2">
                <div className="text-center">
                  <p className="font-mono text-5xl font-bold text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">~8min</p>
                  <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mt-2">AVERAGE ACCURACY (MAE)</p>
                </div>
                <div className="border-t border-border" />
                <div className="text-center">
                  <p className="font-mono text-4xl font-bold">13+</p>
                  <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mt-2">DATA POINTS ANALYZED</p>
                </div>
                <div className="border-t border-border" />
                <div className="text-center">
                  <p className="font-mono text-4xl font-bold">&lt;2s</p>
                  <p className="font-display text-xs tracking-[0.2em] text-muted-foreground mt-2">RESPONSE TIME</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24 bg-background relative border-t border-border/50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">REVOLUTIONIZING <span className="text-primary">TRANSIT</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Experience the next generation of smart city mobility with our cutting-edge features.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast API", desc: "Get real-time predictions in milliseconds, essential for rapid commute decisions." },
              { icon: Activity, title: "Live Tracking", desc: "Monitor ongoing transit health indicators and route congestion metrics on the fly." },
              { icon: Globe, title: "City-Wide Coverage", desc: "Our neural network models adapt to diverse urban environments and transit loops." }
            ].map((feature, idx) => (
              <div key={idx} className="glass p-8 rounded-xl border border-primary/10 hover:border-primary/40 transition-all hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-secondary/30 relative transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">HOW IT <span className="text-primary">WORKS</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our Random Forest regression model was trained on thousands of transit records to identify complex patterns between environmental factors and delays.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass p-8 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors group">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <CloudRain className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-3">Weather Data</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">We ingest real-time weather conditions including precipitation, humidity, temperature, and extreme events like snow or storms.</p>
            </div>

            <div className="glass p-8 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors group">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-3">Traffic Variables</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Incorporates live traffic congestion indexes, rush hour timing, and temporal factors (weekday vs weekend).</p>
            </div>

            <div className="glass p-8 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors group">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-3">Event Analytics</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Adjusts for local events, festivals, concerts, or sports matches that significantly impact regional mobility patterns.</p>
            </div>

            <div className="glass p-8 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors group">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg mb-3">Machine Learning</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">A scikit-learn RandomForestRegressor processes all 24 features simultaneously to generate a confident delay prediction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Data Highlights */}
      <section className="py-24 bg-primary/5 relative overflow-hidden border-t border-b border-primary/10 transition-colors duration-300">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
               <h2 className="font-display text-4xl font-bold mb-6">READY TO TAKE <span className="text-primary">CONTROL</span> OF YOUR COMMUTE?</h2>
               <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                 Join thousands of commuters who leverage our machine learning platform daily to avoid delays, uncover the fastest routes, and reach their destinations on time. 
               </p>
               <Link
                to="/predict"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display text-sm font-bold tracking-wider px-8 py-4 rounded hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,255,255,0.4)]"
              >
                TRY PREDICTION ENGINE <TrendingUp className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-6 rounded-xl flex flex-col justify-center items-center text-center">
                  <Clock className="text-primary w-10 h-10 mb-4" />
                  <span className="text-3xl font-bold font-mono">1.2M+</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Hours Saved</span>
                </div>
                <div className="glass p-6 rounded-xl flex flex-col justify-center items-center text-center">
                  <Smartphone className="text-primary w-10 h-10 mb-4" />
                  <span className="text-3xl font-bold font-mono">99.8%</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest mt-2">Uptime API</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-background py-8 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="TransitFlow AI" className="h-8 w-8 rounded-md bg-secondary p-1" />
              <span className="font-display text-sm font-bold tracking-wider">
                TRANSIT<span className="text-primary">FLOW</span> AI
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} Copyright Info. All Rights Reserved.
            </p>
            
            <div className="text-sm font-medium text-muted-foreground">
              Developed By <span className="text-primary font-bold">Pranav V P</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
