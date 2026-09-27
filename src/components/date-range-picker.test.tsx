import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DateRangePicker,
  daysInRange,
  lastDaysRange,
  toIsoDate,
  validateDateRange,
} from "./date-range-picker";

describe("validateDateRange", () => {
  it("acepta rangos vacíos, parciales y ordenados", () => {
    expect(validateDateRange({ from: null, to: null })).toBeNull();
    expect(validateDateRange({ from: "2026-09-01", to: null })).toBeNull();
    expect(validateDateRange({ from: "2026-09-01", to: "2026-09-01" })).toBeNull();
  });

  it("detecta inicio posterior al fin, límites, duración y obligatorias", () => {
    expect(validateDateRange({ from: "2026-09-10", to: "2026-09-01" })).toBe("from-after-to");
    expect(validateDateRange({ from: "2026-01-01", to: null }, { min: "2026-02-01" })).toBe(
      "before-min",
    );
    expect(validateDateRange({ from: null, to: "2026-12-31" }, { max: "2026-09-27" })).toBe(
      "after-max",
    );
    expect(validateDateRange({ from: "2026-01-01", to: "2026-12-31" }, { maxDays: 90 })).toBe(
      "too-long",
    );
    expect(validateDateRange({ from: "2026-09-01", to: null }, { required: true })).toBe(
      "to-required",
    );
  });

  it("cuenta días inclusive y calcula preajustes en fecha local", () => {
    expect(daysInRange("2026-09-01", "2026-09-30")).toBe(30);
    expect(toIsoDate(new Date(2026, 8, 7))).toBe("2026-09-07");
    expect(lastDaysRange(7, new Date(2026, 8, 27))).toEqual({
      from: "2026-09-21",
      to: "2026-09-27",
    });
  });
});

describe("DateRangePicker", () => {
  it("agrupa las dos fechas bajo una leyenda", () => {
    render(<DateRangePicker label="Fecha del evento" />);
    const group = screen.getByRole("group", { name: "Fecha del evento" });
    expect(group).toBeInTheDocument();
    expect(screen.getByLabelText("Desde")).toHaveAttribute("type", "date");
    expect(screen.getByLabelText("Hasta")).toHaveAttribute("type", "date");
  });

  it("marca el rango invertido como inválido y lo explica", () => {
    const onValueChange = vi.fn();
    render(<DateRangePicker label="Fecha" onValueChange={onValueChange} />);
    fireEvent.change(screen.getByLabelText("Desde"), { target: { value: "2026-09-20" } });
    fireEvent.change(screen.getByLabelText("Hasta"), { target: { value: "2026-09-10" } });
    expect(onValueChange).toHaveBeenLastCalledWith(
      { from: "2026-09-20", to: "2026-09-10" },
      "from-after-to",
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("La fecha de inicio debe ser anterior");
    expect(screen.getByLabelText("Desde")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Hasta")).toHaveAccessibleDescription(/anterior o igual/);
  });

  it("los preajustes aplican el rango y quedan pulsados", async () => {
    const onValueChange = vi.fn();
    const week = { from: "2026-09-21", to: "2026-09-27" };
    render(
      <DateRangePicker
        label="Periodo"
        presets={[
          { label: "7 días", range: week },
          { label: "30 días", range: { from: "2026-08-29", to: "2026-09-27" } },
        ]}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "7 días" }));
    expect(onValueChange).toHaveBeenCalledWith(week, null);
    expect(screen.getByRole("button", { name: "7 días" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Desde")).toHaveValue("2026-09-21");
  });
});
