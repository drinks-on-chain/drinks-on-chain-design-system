import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";
import type { Tone } from "../lib/types";

type AlertTone = Extract<Tone, "neutral" | "info" | "success" | "warning" | "danger">;

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  title?: ReactNode;
  /** Icono propio; `false` lo oculta. */
  icon?: ReactNode | false;
  /** Acción a la derecha (botón terciario). */
  action?: ReactNode;
}

const toneClasses: Record<AlertTone, string> = {
  neutral: "border-border bg-bg-raised",
  info: "border-info bg-info-soft",
  success: "border-success bg-success-soft",
  warning: "border-warning bg-warning-soft",
  danger: "border-danger bg-danger-soft",
};

const iconClasses: Record<AlertTone, string> = {
  neutral: "text-fg-muted",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

const defaultIcons: Record<AlertTone, ReactNode> = {
  neutral: <Info aria-hidden />,
  info: <Info aria-hidden />,
  success: <CheckCircle2 aria-hidden />,
  warning: <AlertTriangle aria-hidden />,
  danger: <OctagonAlert aria-hidden />,
};

/**
 * Aviso en línea. Los tonos warning y danger se anuncian (role="alert");
 * el resto usa role="status".
 */
export function Alert({
  tone = "neutral",
  title,
  icon,
  action,
  role,
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role={role ?? (tone === "danger" || tone === "warning" ? "alert" : "status")}
      className={cn(
        "flex gap-3 rounded-md border px-4 py-3 font-ui text-sm text-fg",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {icon === false ? null : (
        <span className={cn("mt-0.5 shrink-0 [&_svg]:size-4", iconClasses[tone])}>
          {icon ?? defaultIcons[tone]}
        </span>
      )}
      <div className="min-w-0 flex-1">
        {title ? <strong className="block font-semibold">{title}</strong> : null}
        {children ? <div className="text-fg-muted">{children}</div> : null}
      </div>
      {action ? <div className="shrink-0 self-center">{action}</div> : null}
    </div>
  );
}
