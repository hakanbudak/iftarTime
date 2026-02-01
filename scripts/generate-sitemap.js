const fs = require('fs');
const glob = require('glob');

// This script generates a sitemap.xml file in the public directory
// Run it after build

const SITE_URL = 'https://iftarvaktim.com';

const cityNamesMap = {
  'Adana': 'Adana',
  'Adiyaman': 'Adıyaman',
  'Afyon': 'Afyonkarahisar',
  'Agri': 'Ağrı',
  'Aksaray': 'Aksaray',
  'Amasya': 'Amasya',
  'Ankara': 'Ankara',
  'Antalya': 'Antalya',
  'Ardahan': 'Ardahan',
  'Artvin': 'Artvin',
  'Aydin': 'Aydın',
  'Balikesir': 'Balıkesir',
  'Bartin': 'Bartın',
  'Batman': 'Batman',
  'Bayburt': 'Bayburt',
  'Bilecik': 'Bilecik',
  'Bingol': 'Bingöl',
  'Bitlis': 'Bitlis',
  'Bolu': 'Bolu',
  'Burdur': 'Burdur',
  'Bursa': 'Bursa',
  'Canakkale': 'Çanakkale',
  'Cankiri': 'Çankırı',
  'Corum': 'Çorum',
  'Denizli': 'Denizli',
  'Diyarbakir': 'Diyarbakır',
  'Duzce': 'Düzce',
  'Edirne': 'Edirne',
  'Elazig': 'Elazığ',
  'Erzincan': 'Erzincan',
  'Erzurum': 'Erzurum',
  'Eskisehir': 'Eskişehir',
  'Gaziantep': 'Gaziantep',
  'Giresun': 'Giresun',
  'Gumushane': 'Gümüşhane',
  'Hakkari': 'Hakkari',
  'Hatay': 'Hatay',
  'Igdir': 'Iğdır',
  'Isparta': 'Isparta',
  'Istanbul': 'İstanbul',
  'Izmir': 'İzmir',
  'Kahramanmaras': 'Kahramanmaraş',
  'Karabuk': 'Karabük',
  'Karaman': 'Karaman',
  'Kars': 'Kars',
  'Kastamonu': 'Kastamonu',
  'Kayseri': 'Kayseri',
  'Kirikkale': 'Kırıkkale',
  'Kirklareli': 'Kırklareli',
  'Kirsehir': 'Kırşehir',
  'Kilis': 'Kilis',
  'Kocaeli': 'Kocaeli',
  'Konya': 'Konya',
  'Kutahya': 'Kütahya',
  'Malatya': 'Malatya',
  'Manisa': 'Manisa',
  'Mardin': 'Mardin',
  'Mersin': 'Mersin',
  'Mugla': 'Muğla',
  'Mus': 'Muş',
  'Nevsehir': 'Nevşehir',
  'Nigde': 'Niğde',
  'Ordu': 'Ordu',
  'Osmaniye': 'Osmaniye',
  'Rize': 'Rize',
  'Sakarya': 'Sakarya',
  'Samsun': 'Samsun',
  'Sanliurfa': 'Şanlıurfa',
  'Siirt': 'Siirt',
  'Sinop': 'Sinop',
  'Sivas': 'Sivas',
  'Sirnak': 'Şırnak',
  'Tekirdag': 'Tekirdağ',
  'Tokat': 'Tokat',
  'Trabzon': 'Trabzon',
  'Tunceli': 'Tunceli',
  'Usak': 'Uşak',
  'Van': 'Van',
  'Yalova': 'Yalova',
  'Yozgat': 'Yozgat',
  'Zonguldak': 'Zonguldak'
};

const generateSitemap = () => {
  const cities = Array.from(new Set(Object.values(cityNamesMap)));

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${cities
      .map((city) => {
        return `
  <url>
    <loc>${SITE_URL}/${city.toLowerCase()}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join('')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', sitemap);
  console.log('Sitemap generated successfully!');
};

generateSitemap();
