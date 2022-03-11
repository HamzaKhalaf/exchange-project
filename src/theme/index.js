import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#009688",
    },
    secondary: {
      main: '#94C720',
    },
    error: {
      main: '#C70D38',
    },
    info: {
      main: "#FFFFFF"
    },
    text: {
      primary: "#404040",
      secondary: "#8D8D8D",
    },
    background: {
      default: "#F2F2F2"
    },
  },
});

export default theme;
