/** Offline city list: [name, Arabic name, country, lat, lng, IANA zone]. Bundled — no network lookup. */
export type City = [string, string, string, number, number, string];

export const CITIES: City[] = [
  ['Tunis', 'تونس', 'TN', 36.8065, 10.1815, 'Africa/Tunis'],
  ['Sfax', 'صفاقس', 'TN', 34.7406, 10.7603, 'Africa/Tunis'],
  ['Sousse', 'سوسة', 'TN', 35.8256, 10.636, 'Africa/Tunis'],
  ['Kairouan', 'القيروان', 'TN', 35.6781, 10.0963, 'Africa/Tunis'],
  ['Bizerte', 'بنزرت', 'TN', 37.2744, 9.8739, 'Africa/Tunis'],
  ['Gabès', 'قابس', 'TN', 33.8815, 10.0982, 'Africa/Tunis'],
  ['Monastir', 'المنستير', 'TN', 35.7643, 10.8113, 'Africa/Tunis'],
  ['Nabeul', 'نابل', 'TN', 36.4513, 10.7357, 'Africa/Tunis'],
  ['Gafsa', 'قفصة', 'TN', 34.425, 8.7842, 'Africa/Tunis'],
  ['Djerba', 'جربة', 'TN', 33.8754, 10.8577, 'Africa/Tunis'],
  ['Tozeur', 'توزر', 'TN', 33.9197, 8.1335, 'Africa/Tunis'],
  ['Algiers', 'الجزائر', 'DZ', 36.7538, 3.0588, 'Africa/Algiers'],
  ['Oran', 'وهران', 'DZ', 35.6971, -0.6308, 'Africa/Algiers'],
  ['Constantine', 'قسنطينة', 'DZ', 36.365, 6.6147, 'Africa/Algiers'],
  ['Annaba', 'عنابة', 'DZ', 36.9, 7.7667, 'Africa/Algiers'],
  ['Casablanca', 'الدار البيضاء', 'MA', 33.5731, -7.5898, 'Africa/Casablanca'],
  ['Rabat', 'الرباط', 'MA', 34.0209, -6.8416, 'Africa/Casablanca'],
  ['Marrakech', 'مراكش', 'MA', 31.6295, -7.9811, 'Africa/Casablanca'],
  ['Fez', 'فاس', 'MA', 34.0181, -5.0078, 'Africa/Casablanca'],
  ['Tangier', 'طنجة', 'MA', 35.7595, -5.834, 'Africa/Casablanca'],
  ['Tripoli', 'طرابلس', 'LY', 32.8872, 13.1913, 'Africa/Tripoli'],
  ['Benghazi', 'بنغازي', 'LY', 32.1167, 20.0667, 'Africa/Tripoli'],
  ['Cairo', 'القاهرة', 'EG', 30.0444, 31.2357, 'Africa/Cairo'],
  ['Alexandria', 'الإسكندرية', 'EG', 31.2001, 29.9187, 'Africa/Cairo'],
  ['Nouakchott', 'نواكشوط', 'MR', 18.0735, -15.9582, 'Africa/Nouakchott'],
  ['Khartoum', 'الخرطوم', 'SD', 15.5007, 32.5599, 'Africa/Khartoum'],
  ['Dakar', 'داكار', 'SN', 14.7167, -17.4677, 'Africa/Dakar'],
  ['Lagos', 'لاغوس', 'NG', 6.5244, 3.3792, 'Africa/Lagos'],
  ['Kano', 'كانو', 'NG', 12.0022, 8.592, 'Africa/Lagos'],
  ['Nairobi', 'نيروبي', 'KE', -1.2921, 36.8219, 'Africa/Nairobi'],
  ['Mogadishu', 'مقديشو', 'SO', 2.0469, 45.3182, 'Africa/Mogadishu'],
  ['Johannesburg', 'جوهانسبرغ', 'ZA', -26.2041, 28.0473, 'Africa/Johannesburg'],
  ['Cape Town', 'كيب تاون', 'ZA', -33.9249, 18.4241, 'Africa/Johannesburg'],
  ['Makkah', 'مكة المكرمة', 'SA', 21.4225, 39.8262, 'Asia/Riyadh'],
  ['Madinah', 'المدينة المنورة', 'SA', 24.4672, 39.6111, 'Asia/Riyadh'],
  ['Riyadh', 'الرياض', 'SA', 24.7136, 46.6753, 'Asia/Riyadh'],
  ['Jeddah', 'جدة', 'SA', 21.4858, 39.1925, 'Asia/Riyadh'],
  ['Dubai', 'دبي', 'AE', 25.2048, 55.2708, 'Asia/Dubai'],
  ['Abu Dhabi', 'أبو ظبي', 'AE', 24.4539, 54.3773, 'Asia/Dubai'],
  ['Doha', 'الدوحة', 'QA', 25.2854, 51.531, 'Asia/Qatar'],
  ['Kuwait City', 'الكويت', 'KW', 29.3759, 47.9774, 'Asia/Kuwait'],
  ['Manama', 'المنامة', 'BH', 26.2285, 50.586, 'Asia/Bahrain'],
  ['Muscat', 'مسقط', 'OM', 23.588, 58.3829, 'Asia/Muscat'],
  ['Sanaa', 'صنعاء', 'YE', 15.3694, 44.191, 'Asia/Aden'],
  ['Amman', 'عمّان', 'JO', 31.9454, 35.9284, 'Asia/Amman'],
  ['Jerusalem', 'القدس', 'PS', 31.7683, 35.2137, 'Asia/Jerusalem'],
  ['Gaza', 'غزة', 'PS', 31.5017, 34.4668, 'Asia/Gaza'],
  ['Beirut', 'بيروت', 'LB', 33.8938, 35.5018, 'Asia/Beirut'],
  ['Damascus', 'دمشق', 'SY', 33.5138, 36.2765, 'Asia/Damascus'],
  ['Baghdad', 'بغداد', 'IQ', 33.3152, 44.3661, 'Asia/Baghdad'],
  ['Tehran', 'طهران', 'IR', 35.6892, 51.389, 'Asia/Tehran'],
  ['Istanbul', 'إسطنبول', 'TR', 41.0082, 28.9784, 'Europe/Istanbul'],
  ['Ankara', 'أنقرة', 'TR', 39.9334, 32.8597, 'Europe/Istanbul'],
  ['İzmir', 'إزمير', 'TR', 38.4237, 27.1428, 'Europe/Istanbul'],
  ['Bursa', 'بورصة', 'TR', 40.1885, 29.061, 'Europe/Istanbul'],
  ['Konya', 'قونية', 'TR', 37.8746, 32.4932, 'Europe/Istanbul'],
  ['Antalya', 'أنطاليا', 'TR', 36.8969, 30.7133, 'Europe/Istanbul'],
  ['Gaziantep', 'غازي عنتاب', 'TR', 37.0662, 37.3833, 'Europe/Istanbul'],
  ['Baku', 'باكو', 'AZ', 40.4093, 49.8671, 'Asia/Baku'],
  ['Tashkent', 'طشقند', 'UZ', 41.2995, 69.2401, 'Asia/Tashkent'],
  ['Kabul', 'كابل', 'AF', 34.5553, 69.2075, 'Asia/Kabul'],
  ['Karachi', 'كراتشي', 'PK', 24.8607, 67.0011, 'Asia/Karachi'],
  ['Lahore', 'لاهور', 'PK', 31.5204, 74.3587, 'Asia/Karachi'],
  ['Islamabad', 'إسلام آباد', 'PK', 33.6844, 73.0479, 'Asia/Karachi'],
  ['Delhi', 'دلهي', 'IN', 28.6139, 77.209, 'Asia/Kolkata'],
  ['Mumbai', 'مومباي', 'IN', 19.076, 72.8777, 'Asia/Kolkata'],
  ['Hyderabad', 'حيدر آباد', 'IN', 17.385, 78.4867, 'Asia/Kolkata'],
  ['Dhaka', 'دكا', 'BD', 23.8103, 90.4125, 'Asia/Dhaka'],
  ['Jakarta', 'جاكرتا', 'ID', -6.2088, 106.8456, 'Asia/Jakarta'],
  ['Surabaya', 'سورابايا', 'ID', -7.2575, 112.7521, 'Asia/Jakarta'],
  ['Kuala Lumpur', 'كوالالمبور', 'MY', 3.139, 101.6869, 'Asia/Kuala_Lumpur'],
  ['Singapore', 'سنغافورة', 'SG', 1.3521, 103.8198, 'Asia/Singapore'],
  ['Paris', 'باريس', 'FR', 48.8566, 2.3522, 'Europe/Paris'],
  ['Marseille', 'مرسيليا', 'FR', 43.2965, 5.3698, 'Europe/Paris'],
  ['Lyon', 'ليون', 'FR', 45.764, 4.8357, 'Europe/Paris'],
  ['Toulouse', 'تولوز', 'FR', 43.6047, 1.4442, 'Europe/Paris'],
  ['Lille', 'ليل', 'FR', 50.6292, 3.0573, 'Europe/Paris'],
  ['Nice', 'نيس', 'FR', 43.7102, 7.262, 'Europe/Paris'],
  ['Strasbourg', 'ستراسبورغ', 'FR', 48.5734, 7.7521, 'Europe/Paris'],
  ['Bordeaux', 'بوردو', 'FR', 44.8378, -0.5792, 'Europe/Paris'],
  ['Brussels', 'بروكسل', 'BE', 50.8503, 4.3517, 'Europe/Brussels'],
  ['Amsterdam', 'أمستردام', 'NL', 52.3676, 4.9041, 'Europe/Amsterdam'],
  ['Rotterdam', 'روتردام', 'NL', 51.9244, 4.4777, 'Europe/Amsterdam'],
  ['Berlin', 'برلين', 'DE', 52.52, 13.405, 'Europe/Berlin'],
  ['Frankfurt', 'فرانكفورت', 'DE', 50.1109, 8.6821, 'Europe/Berlin'],
  ['Munich', 'ميونخ', 'DE', 48.1351, 11.582, 'Europe/Berlin'],
  ['Cologne', 'كولونيا', 'DE', 50.9375, 6.9603, 'Europe/Berlin'],
  ['Hamburg', 'هامبورغ', 'DE', 53.5511, 9.9937, 'Europe/Berlin'],
  ['Vienna', 'فيينا', 'AT', 48.2082, 16.3738, 'Europe/Vienna'],
  ['Zurich', 'زيورخ', 'CH', 47.3769, 8.5417, 'Europe/Zurich'],
  ['Geneva', 'جنيف', 'CH', 46.2044, 6.1432, 'Europe/Zurich'],
  ['Milan', 'ميلانو', 'IT', 45.4642, 9.19, 'Europe/Rome'],
  ['Rome', 'روما', 'IT', 41.9028, 12.4964, 'Europe/Rome'],
  ['Madrid', 'مدريد', 'ES', 40.4168, -3.7038, 'Europe/Madrid'],
  ['Barcelona', 'برشلونة', 'ES', 41.3874, 2.1686, 'Europe/Madrid'],
  ['Granada', 'غرناطة', 'ES', 37.1773, -3.5986, 'Europe/Madrid'],
  ['London', 'لندن', 'GB', 51.5074, -0.1278, 'Europe/London'],
  ['Birmingham', 'برمنغهام', 'GB', 52.4862, -1.8904, 'Europe/London'],
  ['Manchester', 'مانشستر', 'GB', 53.4808, -2.2426, 'Europe/London'],
  ['Dublin', 'دبلن', 'IE', 53.3498, -6.2603, 'Europe/Dublin'],
  ['Copenhagen', 'كوبنهاغن', 'DK', 55.6761, 12.5683, 'Europe/Copenhagen'],
  ['Stockholm', 'ستوكهولم', 'SE', 59.3293, 18.0686, 'Europe/Stockholm'],
  ['Oslo', 'أوسلو', 'NO', 59.9139, 10.7522, 'Europe/Oslo'],
  ['Helsinki', 'هلسنكي', 'FI', 60.1699, 24.9384, 'Europe/Helsinki'],
  ['Reykjavík', 'ريكيافيك', 'IS', 64.1466, -21.9426, 'Atlantic/Reykjavik'],
  ['Sarajevo', 'سراييفو', 'BA', 43.8563, 18.4131, 'Europe/Sarajevo'],
  ['Moscow', 'موسكو', 'RU', 55.7558, 37.6173, 'Europe/Moscow'],
  ['Kazan', 'قازان', 'RU', 55.7963, 49.1088, 'Europe/Moscow'],
  ['Montréal', 'مونتريال', 'CA', 45.5019, -73.5674, 'America/Toronto'],
  ['Toronto', 'تورنتو', 'CA', 43.6532, -79.3832, 'America/Toronto'],
  ['New York', 'نيويورك', 'US', 40.7128, -74.006, 'America/New_York'],
  ['Washington', 'واشنطن', 'US', 38.9072, -77.0369, 'America/New_York'],
  ['Chicago', 'شيكاغو', 'US', 41.8781, -87.6298, 'America/Chicago'],
  ['Houston', 'هيوستن', 'US', 29.7604, -95.3698, 'America/Chicago'],
  ['Dearborn', 'ديربورن', 'US', 42.3223, -83.1763, 'America/Detroit'],
  ['Los Angeles', 'لوس أنجلوس', 'US', 34.0522, -118.2437, 'America/Los_Angeles'],
  ['São Paulo', 'ساو باولو', 'BR', -23.5505, -46.6333, 'America/Sao_Paulo'],
  ['Sydney', 'سيدني', 'AU', -33.8688, 151.2093, 'Australia/Sydney'],
  ['Melbourne', 'ملبورن', 'AU', -37.8136, 144.9631, 'Australia/Melbourne'],
];

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r;
  const dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 6371.0088 * 2 * Math.asin(Math.sqrt(h));
}

export function nearestCity(lat: number, lng: number) {
  let best = CITIES[0];
  let bestD = Infinity;
  for (const c of CITIES) {
    const d = haversineKm({ lat, lng }, { lat: c[3], lng: c[4] });
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return { city: best, km: bestD };
}

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ًͯ-ْ]/g, '').replace(/[إأآ]/g, 'ا');

export function searchCities(q: string, limit = 8) {
  const n = norm(q.trim());
  if (!n) return CITIES.slice(0, limit);
  return CITIES.filter((c) => norm(c[0]).includes(n) || norm(c[1]).includes(n) || c[2].toLowerCase() === n).slice(0, limit);
}
