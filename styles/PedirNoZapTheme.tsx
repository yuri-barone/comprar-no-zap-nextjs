import { createMuiTheme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[800],
    },
    secondary: {
      main: '#128c7e',
      contrastText: '#fff',
    },
  },
});

export default theme;
