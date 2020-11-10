import { SitemapStream, streamToPromise } from 'sitemap';
import perfisService from '../../components/services/perfisService'

export default async (req, res) => {
  try {
    const smStream = new SitemapStream({
      hostname: `http://${req.headers.host}`,
      cacheTime: 600000,
    });

    // List of domains
    const domains = await perfisService.getAllDomains();

    // Create each URL row
    domains.data.forEach(domain => {
      smStream.write({
        url: `/lojas/${domain}`,
        changefreq: 'daily',
        priority: 0.9
      });
    });

    // End sitemap stream
    smStream.end();

    // XML sitemap string
    const sitemapOutput = (await streamToPromise(smStream)).toString();

    // Change headers
    res.writeHead(200, {
      'Content-Type': 'application/xml'
    });

    // Display output to user
    res.end(sitemapOutput);
  } catch(e) {
    console.log(e)
    res.send(JSON.stringify(e))
  }

}