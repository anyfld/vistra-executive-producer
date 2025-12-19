import { createTheme, alpha } from "@mui/material/styles"

// カスタムカラーパレット
const colors = {
  // プライマリ: シアン/ティール系（監視システムらしいテック感）
  primary: {
    main: "#00D4AA",
    light: "#33DDBB",
    dark: "#00A88A",
    contrastText: "#0A0F14",
  },
  // セカンダリ: パープル/バイオレット系
  secondary: {
    main: "#7C4DFF",
    light: "#B47CFF",
    dark: "#651FFF",
    contrastText: "#ffffff",
  },
  // 背景色
  background: {
    default: "#0A0F14",
    paper: "#12181F",
    elevated: "#1A222B",
  },
  // テキスト
  text: {
    primary: "#E8EAED",
    secondary: "#9AA0A6",
    disabled: "#5F6368",
  },
  // ステータスカラー
  success: {
    main: "#00E676",
    light: "#69F0AE",
    dark: "#00C853",
  },
  warning: {
    main: "#FFD740",
    light: "#FFE57F",
    dark: "#FFC400",
  },
  error: {
    main: "#FF5252",
    light: "#FF867F",
    dark: "#D32F2F",
  },
  info: {
    main: "#40C4FF",
    light: "#80D8FF",
    dark: "#00B0FF",
  },
  // グレースケール
  grey: {
    50: "#F8F9FA",
    100: "#F1F3F4",
    200: "#E8EAED",
    300: "#DADCE0",
    400: "#BDC1C6",
    500: "#9AA0A6",
    600: "#80868B",
    700: "#5F6368",
    800: "#3C4043",
    900: "#202124",
  },
  // ボーダー
  divider: "rgba(255, 255, 255, 0.08)",
}

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: colors.primary,
    secondary: colors.secondary,
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: colors.text,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    grey: colors.grey,
    divider: colors.divider,
  },
  typography: {
    fontFamily: ['"Noto Sans JP"', '"Roboto"', '"Helvetica"', '"Arial"', "sans-serif"].join(","),
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "0",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    `0 2px 4px ${alpha("#000", 0.2)}`,
    `0 4px 8px ${alpha("#000", 0.25)}`,
    `0 6px 12px ${alpha("#000", 0.3)}`,
    `0 8px 16px ${alpha("#000", 0.35)}`,
    `0 10px 20px ${alpha("#000", 0.4)}`,
    `0 12px 24px ${alpha("#000", 0.4)}`,
    `0 14px 28px ${alpha("#000", 0.45)}`,
    `0 16px 32px ${alpha("#000", 0.45)}`,
    `0 18px 36px ${alpha("#000", 0.5)}`,
    `0 20px 40px ${alpha("#000", 0.5)}`,
    `0 22px 44px ${alpha("#000", 0.55)}`,
    `0 24px 48px ${alpha("#000", 0.55)}`,
    `0 26px 52px ${alpha("#000", 0.6)}`,
    `0 28px 56px ${alpha("#000", 0.6)}`,
    `0 30px 60px ${alpha("#000", 0.65)}`,
    `0 32px 64px ${alpha("#000", 0.65)}`,
    `0 34px 68px ${alpha("#000", 0.7)}`,
    `0 36px 72px ${alpha("#000", 0.7)}`,
    `0 38px 76px ${alpha("#000", 0.75)}`,
    `0 40px 80px ${alpha("#000", 0.75)}`,
    `0 42px 84px ${alpha("#000", 0.8)}`,
    `0 44px 88px ${alpha("#000", 0.8)}`,
    `0 46px 92px ${alpha("#000", 0.85)}`,
    `0 48px 96px ${alpha("#000", 0.85)}`,
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background.default,
          scrollbarColor: `${colors.grey[700]} ${colors.background.default}`,
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: colors.background.default,
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: colors.grey[700],
            "&:hover": {
              backgroundColor: colors.grey[600],
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          padding: "10px 24px",
          fontWeight: 600,
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          boxShadow: `0 4px 14px ${alpha(colors.primary.main, 0.4)}`,
          "&:hover": {
            boxShadow: `0 6px 20px ${alpha(colors.primary.main, 0.5)}`,
            transform: "translateY(-1px)",
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            backgroundColor: alpha(colors.primary.main, 0.08),
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: colors.background.paper,
          border: `1px solid ${alpha("#fff", 0.06)}`,
        },
        elevation1: {
          boxShadow: `0 2px 8px ${alpha("#000", 0.3)}`,
        },
        elevation2: {
          boxShadow: `0 4px 16px ${alpha("#000", 0.35)}`,
        },
        elevation3: {
          boxShadow: `0 8px 24px ${alpha("#000", 0.4)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          border: `1px solid ${alpha("#fff", 0.06)}`,
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            borderColor: alpha(colors.primary.main, 0.3),
            boxShadow: `0 8px 32px ${alpha(colors.primary.main, 0.15)}`,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: alpha(colors.primary.main, 0.12),
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: `0 8px 24px ${alpha("#000", 0.4)}`,
        },
        primary: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%)`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: alpha("#fff", 0.02),
            "& fieldset": {
              borderColor: alpha("#fff", 0.1),
              borderWidth: 2,
            },
            "&:hover fieldset": {
              borderColor: alpha(colors.primary.main, 0.4),
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.primary.main,
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: "1px solid",
        },
        standardSuccess: {
          backgroundColor: alpha(colors.success.main, 0.12),
          borderColor: alpha(colors.success.main, 0.3),
          color: colors.success.light,
        },
        standardError: {
          backgroundColor: alpha(colors.error.main, 0.12),
          borderColor: alpha(colors.error.main, 0.3),
          color: colors.error.light,
        },
        standardWarning: {
          backgroundColor: alpha(colors.warning.main, 0.12),
          borderColor: alpha(colors.warning.main, 0.3),
          color: colors.warning.light,
        },
        standardInfo: {
          backgroundColor: alpha(colors.info.main, 0.12),
          borderColor: alpha(colors.info.main, 0.3),
          color: colors.info.light,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: alpha(colors.primary.main, 0.15),
          color: colors.primary.light,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background.elevated,
          border: `1px solid ${alpha("#fff", 0.08)}`,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: colors.primary.main,
        },
      },
    },
  },
})

// エクスポート用のカラー定数
export { colors }
