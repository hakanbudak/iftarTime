import { turkeyLocations, turkeyProvinces } from '@/data/turkeyLocations';

const TR_CHAR_MAP: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i',
    'İ': 'i', 'i': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
    'â': 'a', 'Â': 'a',
    'î': 'i', 'Î': 'i',
    'û': 'u', 'Û': 'u',
};

export const toSlug = (text: string): string => {
    return text
        .split('')
        .map(char => TR_CHAR_MAP[char] || char)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Slug → Türkçe isim haritaları (build time'da çalışır)
const citySlugMap: { [slug: string]: string } = {};
const districtSlugMap: { [citySlug: string]: { [districtSlug: string]: string } } = {};

turkeyProvinces.forEach(city => {
    const citySlug = toSlug(city);
    citySlugMap[citySlug] = city;
    districtSlugMap[citySlug] = {};

    const districts = turkeyLocations[city] || [];
    districts.forEach(district => {
        districtSlugMap[citySlug][toSlug(district)] = district;
    });
});

export const getCityFromSlug = (slug: string): string | null => {
    return citySlugMap[slug] || null;
};

export const getDistrictFromSlug = (citySlug: string, districtSlug: string): string | null => {
    return districtSlugMap[citySlug]?.[districtSlug] || null;
};

export const getCitySlug = (cityName: string): string => {
    return toSlug(cityName);
};

export const getDistrictSlug = (districtName: string): string => {
    return toSlug(districtName);
};

export const getAllCitySlugs = (): string[] => {
    return Object.keys(citySlugMap);
};

export const getAllDistrictSlugs = (citySlug: string): string[] => {
    return Object.keys(districtSlugMap[citySlug] || {});
};

export const getAllCityDistrictPairs = (): { citySlug: string; districtSlug: string }[] => {
    const pairs: { citySlug: string; districtSlug: string }[] = [];
    Object.keys(districtSlugMap).forEach(citySlug => {
        Object.keys(districtSlugMap[citySlug]).forEach(districtSlug => {
            pairs.push({ citySlug, districtSlug });
        });
    });
    return pairs;
};
