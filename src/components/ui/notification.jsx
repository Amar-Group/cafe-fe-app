"use client";

import { useState, useCallback, createContext, useContext, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, AlertCircle, Info, TriangleAlert } from "lucide-react";

/* ─── Context ─────────────────────────────────────────── */
const NotificationContext = createContext(null);

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const add = useCallback((notif) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, ...notif }]);
    if (notif.duration !== 0) {
      setTimeout(() => remove(id), notif.duration ?? 4000);
    }
    return id;
  }, []);

  const remove = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ add, remove }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={remove} />
    </NotificationContext.Provider>
  );
}

function useNotification() {
  return useContext(NotificationContext);
}

/* ─── Container ───────────────────────────────────────── */
function NotificationContainer({ notifications, onRemove, position = "top-right" }) {
  const positionClass = {
    "top-right":    "top-4 right-4 items-end",
    "top-left":     "top-4 left-4 items-start",
    "top-center":   "top-4 left-1/2 -translate-x-1/2 items-center",
    "bottom-right": "bottom-4 right-4 items-end",
    "bottom-left":  "bottom-4 left-4 items-start",
    "bottom-center":"bottom-4 left-1/2 -translate-x-1/2 items-center",
  }[position] || "top-4 right-4 items-end";

  return (
    <div className={cn("fixed z-[100] flex flex-col gap-2 w-80 pointer-events-none", positionClass)}>
      {notifications.map((n) => (
        <NotificationToast key={n.id} {...n} onClose={() => onRemove(n.id)} />
      ))}
    </div>
  );
}

/* ─── Toast ───────────────────────────────────────────── */
const toastVariants = {
  default: { bg: "bg-card border border-border", icon: Info, iconCls: "text-blue-500" },
  success: { bg: "bg-card border border-green-200", icon: CheckCircle2, iconCls: "text-green-500" },
  danger:  { bg: "bg-card border border-red-200",   icon: AlertCircle,   iconCls: "text-red-500" },
  warning: { bg: "bg-card border border-yellow-200",icon: TriangleAlert, iconCls: "text-yellow-500" },
  // Filled
  "filled-default": { bg: "bg-gray-900 border-gray-900 text-white", icon: Info,          iconCls: "text-white/70" },
  "filled-success": { bg: "bg-green-600 border-green-600 text-white", icon: CheckCircle2, iconCls: "text-white/70" },
  "filled-danger":  { bg: "bg-red-600 border-red-600 text-white",     icon: AlertCircle,  iconCls: "text-white/70" },
  "filled-warning": { bg: "bg-yellow-500 border-yellow-500 text-white",icon: TriangleAlert,iconCls: "text-white/70" },
};

function NotificationToast({ title, message, variant = "default", onClose, showIcon = true, action }) {
  const cfg = toastVariants[variant] || toastVariants.default;
  const Icon = cfg.icon;
  const isFilled = variant.startsWith("filled-");

  return (
    <div
      className={cn(
        "pointer-events-auto w-full rounded-xl shadow-lg p-4 flex items-start gap-3",
        "animate-in slide-in-from-right-5 fade-in duration-300",
        cfg.bg
      )}
    >
      {showIcon && <Icon className={cn("size-5 shrink-0 mt-0.5", cfg.iconCls)} />}
      <div className="flex-1 min-w-0">
        {title && <p className={cn("text-sm font-semibold leading-tight", isFilled ? "text-white" : "text-foreground")}>{title}</p>}
        {message && <p className={cn("text-xs mt-0.5 leading-relaxed", isFilled ? "text-white/80" : "text-muted-foreground")}>{message}</p>}
        {action && (
          <button onClick={action.onClick} className={cn("text-xs font-semibold mt-1.5 hover:underline", isFilled ? "text-white" : "text-primary")}>
            {action.label}
          </button>
        )}
      </div>
      <button
        onClick={onClose}
        className={cn("shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity", isFilled ? "text-white" : "text-muted-foreground")}
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/* ─── Static inline notification (no portal) ─────────── */
function Notification({ title, message, variant = "default", onClose, showIcon = true, action, className }) {
  const cfg = toastVariants[variant] || toastVariants.default;
  const Icon = cfg.icon;
  const isFilled = variant.startsWith("filled-");

  return (
    <div
      className={cn(
        "w-full rounded-xl p-4 flex items-start gap-3 border",
        cfg.bg,
        className
      )}
    >
      {showIcon && <Icon className={cn("size-5 shrink-0 mt-0.5", cfg.iconCls)} />}
      <div className="flex-1 min-w-0">
        {title && <p className={cn("text-sm font-semibold leading-tight", isFilled ? "text-white" : "text-foreground")}>{title}</p>}
        {message && <p className={cn("text-xs mt-0.5 leading-relaxed", isFilled ? "text-white/80" : "text-muted-foreground")}>{message}</p>}
        {action && (
          <button onClick={action.onClick} className={cn("text-xs font-semibold mt-1.5 hover:underline", isFilled ? "text-white" : "text-primary")}>
            {action.label}
          </button>
        )}
      </div>
      {onClose && (
        <button onClick={onClose} className={cn("shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity", isFilled ? "text-white" : "text-muted-foreground")} aria-label="Dismiss">
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export { NotificationProvider, useNotification, Notification, NotificationToast, NotificationContainer };
