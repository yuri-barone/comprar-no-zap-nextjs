import { ThemeProvider } from '@material-ui/core'
import PedirNoZapTheme from "../styles/PedirNoZapTheme";  
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={PedirNoZapTheme}>
  <Component {...pageProps} />
  </ThemeProvider> 
  )
}

export default MyApp
