import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Countdown, getCountdownParts } from "./countdown";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

describe("getCountdownParts", () => {
  it("separa días y horas restantes", () => {
    const now = new Date("2026-05-24T09:00:00Z");
    const target = new Date(now.getTime() + 142 * DAY + 5 * HOUR + 30 * 60_000);
    expect(getCountdownParts(target, now)).toMatchObject({
      days: 142,
      hours: 5,
      daysCeil: 143,
      complete: false,
    });
  });

  it("devuelve completo si la fecha ya pasó", () => {
    expect(
      getCountdownParts("2026-01-01T00:00:00Z", new Date("2026-02-01T00:00:00Z")),
    ).toMatchObject({
      remaining: 0,
      days: 0,
      hours: 0,
      complete: true,
    });
  });
});

describe("Countdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-25T10:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("anuncia días y horas con role=timer", () => {
    render(<Countdown target={new Date(Date.now() + 3 * DAY + 2 * HOUR)} />);
    expect(screen.getByRole("timer")).toHaveAccessibleName("Faltan 3 días y 2 horas");
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("con format=days redondea hacia arriba", () => {
    render(<Countdown format="days" target={new Date(Date.now() + DAY + HOUR)} />);
    expect(screen.getByRole("timer")).toHaveAccessibleName("Faltan 2 días");
  });

  it("se actualiza con el reloj y llama a onComplete una vez al llegar a cero", () => {
    const onComplete = vi.fn();
    render(
      <Countdown target={new Date(Date.now() + 2 * HOUR)} tickMs={HOUR} onComplete={onComplete} />,
    );
    expect(screen.getByRole("timer")).toHaveAccessibleName("Faltan 0 días y 2 horas");
    act(() => vi.advanceTimersByTime(HOUR));
    expect(screen.getByRole("timer")).toHaveAccessibleName("Faltan 0 días y 1 hora");
    expect(onComplete).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(2 * HOUR));
    expect(screen.getByRole("timer")).toHaveAccessibleName("Plazo cumplido");
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("con `now` fijo no depende del reloj y admite etiquetas propias", () => {
    render(
      <Countdown
        target="2026-10-13T00:00:00Z"
        now={new Date("2026-10-12T00:00:00Z")}
        labels={{ remaining: (d, h) => `${d} d ${h} h left` }}
      />,
    );
    expect(screen.getByRole("timer")).toHaveAccessibleName("1 d 0 h left");
  });
});
