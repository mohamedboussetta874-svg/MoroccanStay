import { useNavigate } from "react-router";
import { LogOut, Shield, Hotel, ChevronDown } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useAuth } from "../hooks/useAuth";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

export function RoleSwitcher() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleSwitchRole = () => { logout(); navigate("/login", { replace: true }); };
  const handleLogout     = () => { logout(); navigate("/login", { replace: true }); };

  if (!role) return null;

  const isAdmin = role === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: "rgba(201,169,110,0.1)",
            border: `1px solid rgba(201,169,110,0.3)`,
            color: GOLD_D,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,169,110,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(201,169,110,0.1)"; }}
        >
          {isAdmin ? (
            <Shield className="w-3.5 h-3.5" style={{ color: GOLD }} />
          ) : (
            <Hotel className="w-3.5 h-3.5" style={{ color: GOLD }} />
          )}
          <span>{isAdmin ? "Admin" : "Customer"}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 rounded-xl"
        style={{
          background: "#fff",
          border: `1px solid #EDE8DF`,
          boxShadow: "0 8px 32px rgba(26,26,46,0.12)",
          padding: "6px",
        }}
      >
        {/* Current role label */}
        <div className="px-3 py-2">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD_D, letterSpacing: "0.12em" }}>
            {isAdmin ? "Admin Access" : "Customer Mode"}
          </p>
        </div>

        <DropdownMenuSeparator style={{ background: "#EDE8DF" }} />

        {/* Switch role */}
        <DropdownMenuItem
          onClick={handleSwitchRole}
          className="cursor-pointer rounded-lg text-sm font-medium px-3 py-2 transition-all"
          style={{ color: "#444" }}
        >
          Switch role
        </DropdownMenuItem>

        <DropdownMenuSeparator style={{ background: "#EDE8DF" }} />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-lg text-sm font-medium px-3 py-2 transition-all flex items-center gap-2"
          style={{ color: "#dc2626" }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}