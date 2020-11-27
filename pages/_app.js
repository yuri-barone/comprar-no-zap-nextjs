import { ThemeProvider } from '@material-ui/core';
import { CacheProvider } from '@emotion/core';
import createCache from '@emotion/cache';
import PedirNoZapTheme from '../styles/PedirNoZapTheme';
import '../styles/globals.css';

export const cache = createCache();

function MyApp({ Component, pageProps }) {
  return (
    <CacheProvider value={cache}>
      <title>Comprar no Zap</title>
      <ThemeProvider theme={PedirNoZapTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
