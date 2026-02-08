export interface PrayerTimes {
  [date: string]: string[];
}

export interface Place {
  country: string;
  city: string;
  cityEn: string;
  district?: string;
  latitude?: number;
  longitude?: number;
}

export interface PrayerTimesResponse {
  place: Place;
  times: PrayerTimes;
}

export interface IftarData {
  city: string;
  iftarTime: string;
  sahurTime: string;
  times: string[];
  today: string;
}

// Aladhan API response types
export interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Sunset: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface AladhanGregorianDate {
  date: string;
  format: string;
  day: string;
  month: { number: number; en: string };
  year: string;
}

export interface AladhanDayData {
  timings: AladhanTimings;
  date: {
    readable: string;
    gregorian: AladhanGregorianDate;
  };
}

export interface AladhanResponse {
  code: number;
  status: string;
  data: AladhanDayData[];
}
