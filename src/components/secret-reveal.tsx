"use client";

import { Check, Copy, Download } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { labelText } from "../lib/styles";
import { useCopy } from "../lib/use-copy";
import { Alert } from "./alert";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { CopyField } from "./copy-field";
import { QRCode } from "./qr-code";

export interface SecretRevealLabels {
  warning?: string;
  secret?: string;
  qr?: string;
  codes?: string;
  copyAll?: string;
  copied?: string;
  copyError?: string;
  download?: string;
  acknowledge?: string;
}

const defaultLabels: Required<SecretRevealLabels> = {
  warning: "Se muestra una sola vez. Guárdalo ahora en un lugar seguro.",
  secret: "Clave de configuración",
  qr: "Código QR para la app de autenticación",
  codes: "Códigos de recuperación",
  copyAll: "Copiar todos",
  copied: "Copiados",
  copyError: "No se pudo copiar",
  download: "Descargar .txt",
  acknowledge: "He guardado esta información en un lugar seguro",
};

/** Agrupa un secreto en bloques para leerlo y teclearlo: "JBSWY3DPEHPK3PXP" → "JBSW Y3DP EHPK 3PXP". */
export function groupSecret(secret: string, size = 4): string {
  return secret.replace(/\s+/g, "").replace(new RegExp(`(.{${size}})(?=.)`, "g"), "$1 ");
}

export interface SecretRevealProps {
  /** Secreto TOTP (`secret` de `mfa/enroll`); se muestra agrupado y se copia sin espacios. */
  secret?: string;
  /** Oculta el secreto hasta pulsar "Mostrar". */
  maskSecret?: boolean;
  /** URL `otpauth://` para el código QR. */
  otpauthUrl?: string;
  /** Códigos de recuperación (`recoveryCodes`), en rejilla monoespaciada. */
  codes?: string[];
  /** Nombre del archivo al descargar los códigos. */
  downloadFileName?: string;
  /** Aviso bajo el título (por defecto: se muestra una sola vez). */
  warning?: ReactNode;
  /** Casilla "He guardado…": controla el paso siguiente. */
  acknowledged?: boolean;
  onAcknowledgedChange?: (acknowledged: boolean) => void;
  /** Oculta la casilla de confirmación. */
  hideAcknowledge?: boolean;
  labels?: SecretRevealLabels;
  className?: string;
}

/**
 * Muestra una sola vez información sensible del segundo factor: el secreto TOTP con su QR y
 * los códigos de recuperación, con copiar, descargar y la confirmación de que se guardaron.
 */
export function SecretReveal({
  secret,
  maskSecret = false,
  otpauthUrl,
  codes,
  downloadFileName = "codigos-de-recuperacion.txt",
  warning,
  acknowledged: acknowledgedProp,
  onAcknowledgedChange,
  hideAcknowledge = false,
  labels: labelsProp,
  className,
}: SecretRevealProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const codesId = useId();
  const [acknowledgedState, setAcknowledgedState] = useState(false);
  const acknowledged = acknowledgedProp ?? acknowledgedState;
  const { copy, status } = useCopy();

  const download = () => {
    if (!codes?.length) return;
    const blob = new Blob([codes.join("\n") + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("grid content-start gap-5 font-ui text-sm", className)}>
      <Alert tone="warning" role="note">
        {warning ?? labels.warning}
      </Alert>

      {secret || otpauthUrl ? (
        <div className="flex flex-wrap items-start gap-5">
          {otpauthUrl ? (
            <QRCode
              value={otpauthUrl}
              size={144}
              label={labels.qr}
              className="shrink-0 border border-border"
            />
          ) : null}
          {secret ? (
            <CopyField
              className="min-w-60 flex-1"
              label={labels.secret}
              value={groupSecret(secret)}
              copyValue={secret.replace(/\s+/g, "")}
              masked={maskSecret}
            />
          ) : null}
        </div>
      ) : null}

      {codes?.length ? (
        <section aria-labelledby={codesId} className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id={codesId} className={cn(labelText, "m-0")}>
              {labels.codes}
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                iconStart={status === "copied" ? <Check aria-hidden /> : <Copy aria-hidden />}
                onClick={() => copy(codes.join("\n"))}
              >
                {status === "copied" ? labels.copied : labels.copyAll}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                iconStart={<Download aria-hidden />}
                onClick={download}
              >
                {labels.download}
              </Button>
            </div>
          </div>
          <ol className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-1.5 rounded-md border border-border bg-bg-sunken p-4 font-mono text-md tracking-[0.04em] text-fg tabular-nums">
            {codes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ol>
          <span className="sr-only" role="status" aria-live="polite">
            {status === "copied" ? labels.copied : status === "error" ? labels.copyError : ""}
          </span>
        </section>
      ) : null}

      {hideAcknowledge ? null : (
        <Checkbox
          label={labels.acknowledge}
          checked={acknowledged}
          onCheckedChange={(checked) => {
            const next = checked === true;
            if (acknowledgedProp === undefined) setAcknowledgedState(next);
            onAcknowledgedChange?.(next);
          }}
        />
      )}
    </div>
  );
}
