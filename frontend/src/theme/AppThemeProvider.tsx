import {
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import type { PaletteMode } from "@mui/material";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AppThemeMode = "dark" | "light";

interface AppThemeContextValue {
  mode: AppThemeMode;
  toggleMode: () => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

const colorTokens = {
  dark: {
    bg: "#0f172a",
    bgSoft: "#111827",
    surface: "rgba(30, 41, 59, 0.66)",
    surfaceSolid: "#1e293b",
    surfaceMuted: "rgba(255, 255, 255, 0.08)",
    border: "rgba(148, 163, 184, 0.24)",
    borderStrong: "#334155",
    text: "#f8fafc",
    textSoft: "#e2e8f0",
    muted: "#94a3b8",
    mutedStrong: "#cbd5e1",
    primary: "#5b5eff",
    primaryHover: "#6b6eff",
    accent: "#06d6a0",
    accentSoft: "#7fffe0",
    danger: "#ff6b6b",
    dangerSoft: "#ffb4b4",
    warning: "#fbbf24",
    shadowCard: "0 22px 60px rgba(2, 6, 23, 0.22)",
    shadowPopover: "0 20px 60px rgba(0, 0, 0, 0.35)",
  },
  light: {
    bg: "#f5f7fb",
    bgSoft: "#eef2f7",
    surface: "rgba(255, 255, 255, 0.86)",
    surfaceSolid: "#ffffff",
    surfaceMuted: "rgba(15, 23, 42, 0.05)",
    border: "rgba(100, 116, 139, 0.22)",
    borderStrong: "#cbd5e1",
    text: "#0f172a",
    textSoft: "#1e293b",
    muted: "#64748b",
    mutedStrong: "#334155",
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    accent: "#059669",
    accentSoft: "#047857",
    danger: "#dc2626",
    dangerSoft: "#b91c1c",
    warning: "#fbbf24",
    shadowCard: "0 22px 60px rgba(15, 23, 42, 0.1)",
    shadowPopover: "0 20px 60px rgba(15, 23, 42, 0.16)",
  },
} as const;

function getInitialTheme(): AppThemeMode {
  if (typeof window === "undefined") return "dark";

  return window.localStorage.getItem("theme") === "light" ? "light" : "dark";
}

function buildTheme(mode: PaletteMode) {
  const colors = colorTokens[mode];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.accent,
      },
      error: {
        main: colors.danger,
      },
      warning: {
        main: colors.warning,
      },
      background: {
        default: colors.bg,
        paper: colors.surfaceSolid,
      },
      text: {
        primary: colors.text,
        secondary: colors.mutedStrong,
      },
      divider: colors.border,
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      button: {
        textTransform: "none",
        fontWeight: 700,
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            minHeight: 44,
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppThemeMode>(getInitialTheme);
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const contextValue = useMemo(
    () => ({
      mode,
      toggleMode: () =>
        setMode((current) => (current === "dark" ? "light" : "dark")),
    }),
    [mode],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    window.localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <AppThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              background: "var(--body-gradient)",
              color: "var(--color-text)",
            },
            "::selection": {
              background:
                "color-mix(in srgb, var(--color-primary) 55%, transparent)",
            },
          }}
        />
        {children}
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppThemeMode() {
  const value = useContext(AppThemeContext);

  if (!value) {
    throw new Error("useAppThemeMode must be used inside AppThemeProvider");
  }

  return value;
}
