import { ThemeProvider } from '@material-ui/core';
import { CacheProvider } from '@emotion/core';
import createCache from '@emotion/cache';
import PedirNoZapTheme from '../styles/PedirNoZapTheme';
import '../styles/globals.css';

export const cache = createCache();

function MyApp({ Component, pageProps }) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={PedirNoZapTheme}>
        <head>
          <title>Comprar no zap</title>
        </head>
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
