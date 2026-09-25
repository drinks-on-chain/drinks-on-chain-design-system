import type { ReactNode } from "react";
import { cn } from "../lib/utils";
import { Wordmark } from "../components/wordmark";

export interface AuthLayoutProps {
  /**
   * split: imagen + formulario (ERP) · centered: tarjeta mínima (Backoffice) ·
   * veiled: pantalla única sobre imagen velada (Marketplace) · pin: PIN centrado sobre cava (POS).
   */
  variant?: "split" | "centered" | "veiled" | "pin";
  brand?: ReactNode;
  /** Etiqueta bajo la marca ("ERP de trazabilidad"). */
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Imagen de fondo o del panel: URL o nodo. Sin imagen se usa un grabado a tinta. */
  image?: ReactNode | string;
  imageAlt?: string;
  /** Texto sobre la imagen (split). */
  imageCaption?: ReactNode;
  /** Pie legal o de ayuda. */
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}

const engraving =
  "bg-[repeating-linear-gradient(115deg,rgba(0,0,0,.06)_0_1px,transparent_1px_7px),linear-gradient(180deg,var(--doc-paper-2),var(--doc-paper-3))]";

function Art({
  image,
  alt,
  className,
}: {
  image?: ReactNode | string;
  alt?: string;
  className?: string;
}) {
  if (typeof image === "string") {
    return <img src={image} alt={alt ?? ""} className={cn("size-full object-cover", className)} />;
  }
  if (image) return <div className={cn("size-full", className)}>{image}</div>;
  return <div aria-hidden="true" className={cn("size-full", engraving, className)} />;
}

/** Pantallas de acceso de las cuatro aplicaciones. */
export function AuthLayout({
  variant = "split",
  brand,
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  imageCaption,
  footer,
  className,
  children,
}: AuthLayoutProps) {
  const heading = (
    <>
      {title ? (
        <h1 className="m-0 font-display text-3xl leading-tight font-medium text-fg">{title}</h1>
      ) : null}
      {description ? <p className="m-0 text-sm text-fg-muted">{description}</p> : null}
    </>
  );

  if (variant === "split") {
    return (
      <div className={cn("grid min-h-dvh bg-bg font-ui text-fg md:grid-cols-2", className)}>
        <div className="relative hidden overflow-hidden border-r border-border md:block">
          <Art image={image} alt={imageAlt} className="absolute inset-0" />
          {imageCaption ? (
            <div className="absolute bottom-7 left-8 max-w-[20ch] text-fg">{imageCaption}</div>
          ) : null}
        </div>
        <main className="mx-auto grid w-full max-w-[420px] content-center gap-4 px-6 py-12 md:px-12">
          <div className="grid gap-2">
            {brand ?? <Wordmark size="xl" />}
            {eyebrow ? (
              <p className="m-0 text-2xs font-medium tracking-label text-fg-subtle uppercase">
                {eyebrow}
              </p>
            ) : null}
          </div>
          {heading}
          {children}
          {footer ? <div className="mt-2 text-xs text-fg-subtle">{footer}</div> : null}
        </main>
      </div>
    );
  }

  if (variant === "centered") {
    return (
      <div
        className={cn(
          "grid min-h-dvh place-items-center bg-bg-sunken p-6 font-ui text-fg",
          className,
        )}
      >
        <main className="grid w-full max-w-[400px] gap-4 rounded-lg border border-border bg-bg p-8">
          <div className="grid gap-2">
            {brand ?? <Wordmark size="lg" />}
            {eyebrow ? (
              <p className="m-0 text-2xs font-medium tracking-label text-fg-subtle uppercase">
                {eyebrow}
              </p>
            ) : null}
          </div>
          {heading}
          {children}
          {footer ? <div className="text-xs text-fg-subtle">{footer}</div> : null}
        </main>
      </div>
    );
  }

  if (variant === "veiled") {
    return (
      <div className={cn("relative grid min-h-dvh overflow-hidden font-ui", className)}>
        <Art image={image} alt={imageAlt} className="absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,18,15,.15),rgba(21,18,15,.85))]"
        />
        <main
          data-theme="cava"
          className="relative mx-auto grid w-full max-w-[440px] content-end gap-3 bg-transparent px-5 pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-fg md:content-center"
        >
          {eyebrow ? (
            <p className="m-0 font-display text-sm tracking-eyebrow text-accent-text uppercase">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h1 className="m-0 font-display text-3xl leading-tight font-medium text-fg">{title}</h1>
          ) : null}
          {description ? (
            <p className="m-0 font-text text-md text-fg-muted">{description}</p>
          ) : null}
          {children}
          {footer ? <div className="text-xs text-fg-muted">{footer}</div> : null}
        </main>
      </div>
    );
  }

  // pin
  return (
    <div
      data-theme="cava"
      className={cn(
        "grid min-h-dvh place-items-center bg-bg p-6 text-center font-ui text-fg",
        className,
      )}
    >
      <main className="grid justify-items-center gap-7">
        <div className="grid justify-items-center gap-3">
          {brand ?? <Wordmark size="2xl" />}
          {eyebrow ? <p className="m-0 text-xl text-fg-muted">{eyebrow}</p> : null}
        </div>
        {title ? <h1 className="sr-only">{title}</h1> : null}
        {children}
        {description ? <p className="m-0 text-lg text-fg-subtle">{description}</p> : null}
        {footer}
      </main>
    </div>
  );
}
