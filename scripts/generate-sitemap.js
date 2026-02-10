const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://iftarvaktim.com';

const TR_CHAR_MAP = {
  'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g',
  'ı': 'i', 'I': 'i', 'İ': 'i',
  'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's',
  'ü': 'u', 'Ü': 'u', 'â': 'a', 'Â': 'a',
  'î': 'i', 'Î': 'i', 'û': 'u', 'Û': 'u',
};

function toSlug(text) {
  return text
    .split('')
    .map(char => TR_CHAR_MAP[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// turkeyLocations.ts dosyasından veriyi oku ve parse et
function parseTurkeyLocations() {
  const filePath = path.join(__dirname, '../src/data/turkeyLocations.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  const locations = {};
  const regex = /'([^']+)':\s*\[([^\]]*)\]/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const city = match[1];
    const districtsStr = match[2];
    const districts = districtsStr
      .match(/'([^']+)'/g)
      ?.map(d => d.replace(/'/g, '')) || [];
    locations[city] = districts;
  }

  return locations;
}

const generateSitemap = () => {
  const turkeyLocations = parseTurkeyLocations();
  const cities = Object.keys(turkeyLocations).sort((a, b) => a.localeCompare(b, 'tr'));
  const today = new Date().toISOString().split('T')[0];

  let urls = [];

  // Ana sayfa
  urls.push(`  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  // Şehir ve ilçe sayfaları
  cities.forEach(city => {
    const citySlug = toSlug(city);
    urls.push(`  <url>
    <loc>${SITE_URL}/${citySlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);

    const districts = turkeyLocations[city] || [];
    districts.forEach(district => {
      const districtSlug = toSlug(district);
      urls.push(`  <url>
    <loc>${SITE_URL}/${citySlug}/${districtSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`);
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
  console.log(`✅ Sitemap generated: ${urls.length} URLs`);
};

generateSitemap();
