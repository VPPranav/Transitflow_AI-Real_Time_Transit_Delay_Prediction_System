import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  const location = useLocation();
  const links = [
    { to: "/", label: "HOME" },
    { to: "/predict", label: "PREDICT" },
    { to: "/about", label: "ABOUT" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="TransitFlow AI" className="h-10 w-10 rounded-lg bg-secondary p-1" />
          <span className="font-display text-lg font-bold tracking-wider">
            TRANSIT<span className="text-primary">FLOW</span> AI
          </span>
        </Link>
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-display text-sm tracking-widest transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
