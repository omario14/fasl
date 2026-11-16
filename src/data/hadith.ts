export interface Hadith {
  ar: string;
  en: string;
  fr: string;
  narrator: string;
  src: string;
}

/** Rotates by day of year. A seed set; the production database extends this to 365. */
export const HADITH: Hadith[] = [
  {
    ar: 'سَأَلْتُ النَّبِيَّ ﷺ: أَيُّ الْعَمَلِ أَحَبُّ إِلَى اللهِ؟ قَالَ: «الصَّلَاةُ عَلَى وَقْتِهَا»',
    en: 'I asked the Prophet ﷺ which deed is most beloved to Allah. He said: “Prayer at its proper time.”',
    fr: 'J’ai demandé au Prophète ﷺ quelle œuvre Allah aime le plus. Il dit : « La prière à son heure. »',
    narrator: 'Ibn Masʿud', src: 'Bukhari 527',
  },
  {
    ar: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    en: 'Actions are only by intentions, and every person will have only what they intended.',
    fr: 'Les actes ne valent que par les intentions, et chacun n’aura que ce qu’il a eu l’intention de faire.',
    narrator: 'ʿUmar ibn al-Khattab', src: 'Bukhari 1',
  },
  {
    ar: 'أَرَأَيْتُمْ لَوْ أَنَّ نَهْرًا بِبَابِ أَحَدِكُمْ يَغْتَسِلُ مِنْهُ كُلَّ يَوْمٍ خَمْسَ مَرَّاتٍ، هَلْ يَبْقَى مِنْ دَرَنِهِ شَيْءٌ؟ ... فَذَلِكَ مَثَلُ الصَّلَوَاتِ الْخَمْسِ، يَمْحُو اللهُ بِهِنَّ الْخَطَايَا',
    en: 'If there were a river at the door of one of you in which he bathed five times a day, would any dirt remain on him? That is the likeness of the five prayers: through them Allah wipes away sins.',
    fr: 'Si une rivière coulait à la porte de l’un de vous et qu’il s’y lavait cinq fois par jour, lui resterait-il de la saleté ? Ainsi sont les cinq prières : Allah efface par elles les péchés.',
    narrator: 'Abu Hurayrah', src: 'Bukhari 528 · Muslim 667',
  },
  {
    ar: 'إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلَاتُهُ',
    en: 'The first of a servant’s deeds to be reckoned on the Day of Resurrection is his prayer.',
    fr: 'La première des œuvres dont le serviteur rendra compte au Jour de la Résurrection est sa prière.',
    narrator: 'Abu Hurayrah', src: 'Tirmidhi 413',
  },
  {
    ar: 'مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ',
    en: 'Whoever prays the two cool prayers (Fajr and Asr) will enter Paradise.',
    fr: 'Celui qui accomplit les deux prières fraîches (Fajr et Asr) entrera au Paradis.',
    narrator: 'Abu Musa al-Ashʿari', src: 'Bukhari 574',
  },
  {
    ar: 'مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللهِ',
    en: 'Whoever prays the morning prayer is under the protection of Allah.',
    fr: 'Celui qui accomplit la prière de l’aube est sous la protection d’Allah.',
    narrator: 'Jundub ibn ʿAbdillah', src: 'Muslim 657',
  },
  {
    ar: 'صَلَاةُ الْجَمَاعَةِ تَفْضُلُ صَلَاةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً',
    en: 'Prayer in congregation is twenty-seven degrees better than prayer alone.',
    fr: 'La prière en groupe surpasse de vingt-sept degrés la prière seul.',
    narrator: 'Ibn ʿUmar', src: 'Bukhari 645',
  },
  {
    ar: 'الَّذِي تَفُوتُهُ صَلَاةُ الْعَصْرِ كَأَنَّمَا وُتِرَ أَهْلَهُ وَمَالَهُ',
    en: 'The one who misses the Asr prayer is like one who has lost his family and his wealth.',
    fr: 'Celui qui manque la prière de l’Asr est comme celui qui a perdu sa famille et ses biens.',
    narrator: 'Ibn ʿUmar', src: 'Bukhari 552',
  },
  {
    ar: 'أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ، فَأَكْثِرُوا الدُّعَاءَ',
    en: 'The closest a servant is to his Lord is while prostrating, so increase your supplication.',
    fr: 'Le serviteur n’est jamais aussi proche de son Seigneur que lorsqu’il est prosterné : multipliez donc les invocations.',
    narrator: 'Abu Hurayrah', src: 'Muslim 482',
  },
  {
    ar: 'الطُّهُورُ شَطْرُ الْإِيمَانِ',
    en: 'Purity is half of faith.',
    fr: 'La purification est la moitié de la foi.',
    narrator: 'Abu Malik al-Ashʿari', src: 'Muslim 223',
  },
  {
    ar: 'أَحَبُّ الْأَعْمَالِ إِلَى اللهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    en: 'The deeds most beloved to Allah are those done consistently, even if small.',
    fr: 'Les œuvres les plus aimées d’Allah sont les plus régulières, même si elles sont peu nombreuses.',
    narrator: 'ʿAʾishah', src: 'Bukhari 6464 · Muslim 783',
  },
  {
    ar: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ',
    en: 'Two words light on the tongue, heavy in the balance, beloved to the Most Merciful: Subhan Allahi wa bihamdihi, Subhan Allahil-ʿAzim.',
    fr: 'Deux paroles légères sur la langue, lourdes dans la balance, aimées du Tout-Miséricordieux : Subhan Allahi wa bihamdihi, Subhan Allahil-ʿAzim.',
    narrator: 'Abu Hurayrah', src: 'Bukhari 6406',
  },
  {
    ar: 'مَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    en: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.',
    fr: 'Que celui qui croit en Allah et au Jour dernier dise du bien ou se taise.',
    narrator: 'Abu Hurayrah', src: 'Bukhari 6018 · Muslim 47',
  },
  {
    ar: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    en: 'None of you truly believes until he loves for his brother what he loves for himself.',
    fr: 'Aucun de vous n’est vraiment croyant tant qu’il n’aime pas pour son frère ce qu’il aime pour lui-même.',
    narrator: 'Anas ibn Malik', src: 'Bukhari 13',
  },
  {
    ar: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    en: 'The Muslim is the one from whose tongue and hand the Muslims are safe.',
    fr: 'Le musulman est celui dont la langue et la main épargnent les musulmans.',
    narrator: 'ʿAbdullah ibn ʿAmr', src: 'Bukhari 10',
  },
  {
    ar: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    en: 'Your smile in the face of your brother is charity.',
    fr: 'Ton sourire au visage de ton frère est une aumône.',
    narrator: 'Abu Dharr', src: 'Tirmidhi 1956',
  },
  {
    ar: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',
    en: 'A good word is charity.',
    fr: 'La bonne parole est une aumône.',
    narrator: 'Abu Hurayrah', src: 'Bukhari 2989',
  },
  {
    ar: 'الدِّينُ النَّصِيحَةُ',
    en: 'The religion is sincere counsel.',
    fr: 'La religion, c’est le bon conseil sincère.',
    narrator: 'Tamim ad-Dari', src: 'Muslim 55',
  },
  {
    ar: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    en: 'Whoever takes a path seeking knowledge, Allah makes easy for him a path to Paradise.',
    fr: 'Quiconque emprunte un chemin à la recherche du savoir, Allah lui facilite un chemin vers le Paradis.',
    narrator: 'Abu Hurayrah', src: 'Muslim 2699',
  },
  {
    ar: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
    en: 'The strong one is not the one who overcomes others in wrestling; the strong one is he who controls himself in anger.',
    fr: 'Le fort n’est pas celui qui terrasse les autres ; le fort est celui qui se maîtrise dans la colère.',
    narrator: 'Abu Hurayrah', src: 'Bukhari 6114',
  },
  {
    ar: 'اتَّقِ اللهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ',
    en: 'Be mindful of Allah wherever you are, follow a bad deed with a good one to erase it, and treat people with good character.',
    fr: 'Crains Allah où que tu sois, fais suivre la mauvaise action d’une bonne qui l’efface, et comporte-toi avec les gens de belle manière.',
    narrator: 'Abu Dharr', src: 'Tirmidhi 1987',
  },
  {
    ar: 'لَا يَرْحَمُ اللهُ مَنْ لَا يَرْحَمُ النَّاسَ',
    en: 'Allah does not show mercy to the one who does not show mercy to people.',
    fr: 'Allah ne fait pas miséricorde à celui qui ne fait pas miséricorde aux gens.',
    narrator: 'Jarir ibn ʿAbdillah', src: 'Bukhari 7376',
  },
  {
    ar: 'يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا',
    en: 'Make things easy and do not make them hard; give glad tidings and do not drive people away.',
    fr: 'Facilitez et ne compliquez pas ; annoncez la bonne nouvelle et ne faites pas fuir.',
    narrator: 'Anas ibn Malik', src: 'Bukhari 69',
  },
  {
    ar: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    en: 'Whoever fasts Ramadan out of faith and hope of reward, his previous sins are forgiven.',
    fr: 'Quiconque jeûne le Ramadan avec foi et en espérant la récompense, ses péchés passés lui sont pardonnés.',
    narrator: 'Abu Hurayrah', src: 'Bukhari 38',
  },
  {
    ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    en: 'The best of you are those who learn the Qurʾan and teach it.',
    fr: 'Les meilleurs d’entre vous sont ceux qui apprennent le Coran et l’enseignent.',
    narrator: 'ʿUthman ibn ʿAffan', src: 'Bukhari 5027',
  },
  {
    ar: 'إِنَّ اللهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ',
    en: 'Allah does not look at your appearance or your wealth, but He looks at your hearts and your deeds.',
    fr: 'Allah ne regarde ni vos apparences ni vos biens, mais Il regarde vos cœurs et vos actes.',
    narrator: 'Abu Hurayrah', src: 'Muslim 2564',
  },
  {
    ar: 'الْبِرُّ حُسْنُ الْخُلُقِ',
    en: 'Righteousness is good character.',
    fr: 'La bonté, c’est le bon caractère.',
    narrator: 'an-Nawwas ibn Samʿan', src: 'Muslim 2553',
  },
  {
    ar: 'مِنْ حُسْنِ إِسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ',
    en: 'Part of the excellence of a person’s Islam is leaving what does not concern him.',
    fr: 'Fait partie du bon islam de la personne le fait de délaisser ce qui ne la regarde pas.',
    narrator: 'Abu Hurayrah', src: 'Tirmidhi 2317',
  },
  {
    ar: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ',
    en: 'The strong believer is better and more beloved to Allah than the weak believer, and in each there is good.',
    fr: 'Le croyant fort est meilleur et plus aimé d’Allah que le croyant faible, et en chacun il y a du bien.',
    narrator: 'Abu Hurayrah', src: 'Muslim 2664',
  },
  {
    ar: 'اغْتَنِمْ خَمْسًا قَبْلَ خَمْسٍ: شَبَابَكَ قَبْلَ هَرَمِكَ، وَصِحَّتَكَ قَبْلَ سَقَمِكَ، وَغِنَاكَ قَبْلَ فَقْرِكَ، وَفَرَاغَكَ قَبْلَ شُغْلِكَ، وَحَيَاتَكَ قَبْلَ مَوْتِكَ',
    en: 'Take advantage of five before five: your youth before old age, your health before illness, your wealth before poverty, your free time before you are busy, and your life before your death.',
    fr: 'Profite de cinq choses avant cinq autres : ta jeunesse avant ta vieillesse, ta santé avant ta maladie, ta richesse avant ta pauvreté, ton temps libre avant ton occupation, et ta vie avant ta mort.',
    narrator: 'Ibn ʿAbbas', src: 'al-Hakim, al-Mustadrak',
  },
];
