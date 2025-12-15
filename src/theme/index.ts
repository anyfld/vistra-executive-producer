import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  typography: {
    fontFamily: ['"Noto Sans JP"', '"Roboto"', '"Helvetica"', '"Arial"', "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#fafafa",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#f5f5f5",
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#c1c1c1",
          },
        },
      },
    },
  },
})
