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
  times: string[]; // [Sahur, Güneş, Öğle, İkindi, İftar, Yatsı]
  today: string;
}
