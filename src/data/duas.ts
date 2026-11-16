export type DuaCat =
  | 'prayer'
  | 'morning'
  | 'evening'
  | 'eating'
  | 'home'
  | 'travel'
  | 'rain'
  | 'distress'
  | 'sleep'
  | 'occasions';

export const DUA_CATS: { id: DuaCat; ar: string }[] = [
  { id: 'prayer', ar: 'بعد الصلاة' },
  { id: 'morning', ar: 'الصباح' },
  { id: 'evening', ar: 'المساء' },
  { id: 'eating', ar: 'الطعام' },
  { id: 'home', ar: 'المنزل' },
  { id: 'travel', ar: 'السفر' },
  { id: 'rain', ar: 'المطر' },
  { id: 'distress', ar: 'الكرب' },
  { id: 'sleep', ar: 'النوم' },
  { id: 'occasions', ar: 'المناسبات' },
];

export interface Dua {
  id: number;
  cat: DuaCat;
  ar: string;
  tr: string; // transliteration
  en: string;
  fr: string;
  tk?: string; // Turkish translation
  src: string;
  repeat?: number;
}

export const DUAS: Dua[] = [
  // ── After prayer
  {
    id: 1, cat: 'prayer', repeat: 1,
    ar: 'أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ، أَسْتَغْفِرُ اللهَ. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    tr: 'Astaghfirullāh (×3). Allāhumma anta s-salām wa minka s-salām, tabārakta yā dhā l-jalāli wa l-ikrām.',
    en: 'I seek Allah’s forgiveness (three times). O Allah, You are Peace and from You is peace. Blessed are You, Owner of majesty and honour.',
    fr: 'Je demande pardon à Allah (trois fois). Ô Allah, Tu es la Paix et de Toi vient la paix. Béni sois-Tu, Ô Détenteur de la majesté et de la générosité.',
    tk: 'Allah’tan bağışlanma dilerim (üç kez). Allah’ım, Sen Selâm’sın, selâmet Sendendir. Ey celâl ve ikram sahibi, Sen ne yücesin.',
    src: 'Muslim 591',
  },
  {
    id: 2, cat: 'prayer',
    ar: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    tr: 'Lā ilāha illā llāhu waḥdahu lā sharīka lah, lahu l-mulku wa lahu l-ḥamdu wa huwa ʿalā kulli shayʾin qadīr. Allāhumma lā māniʿa limā aʿṭayt, wa lā muʿṭiya limā manaʿt, wa lā yanfaʿu dhā l-jaddi minka l-jadd.',
    en: 'None has the right to be worshipped but Allah alone, without partner. His is the dominion and His the praise, and He is able to do all things. O Allah, none can withhold what You give, none can give what You withhold, and the wealth of the wealthy cannot avail him against You.',
    fr: 'Nul ne mérite d’être adoré sauf Allah, seul, sans associé. À Lui la royauté, à Lui la louange, et Il est capable de toute chose. Ô Allah, nul ne peut retenir ce que Tu donnes, nul ne peut donner ce que Tu retiens, et la fortune du fortuné ne lui sert à rien auprès de Toi.',
    tk: 'Allah’tan başka ilah yoktur; O tektir, ortağı yoktur. Mülk O’nundur, hamd O’nadır ve O her şeye kadirdir. Allah’ım, Senin verdiğine engel olacak, Senin engellediğini verecek kimse yoktur; zenginin zenginliği Sana karşı fayda vermez.',
    src: 'Bukhari 844 · Muslim 593',
  },
  {
    id: 3, cat: 'prayer', repeat: 33,
    ar: 'سُبْحَانَ اللهِ (٣٣) وَالْحَمْدُ لِلَّهِ (٣٣) وَاللهُ أَكْبَرُ (٣٣)، ثُمَّ: لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    tr: 'Subḥāna llāh (33), al-ḥamdu lillāh (33), Allāhu akbar (33), then: lā ilāha illā llāhu waḥdahu lā sharīka lah, lahu l-mulku wa lahu l-ḥamdu wa huwa ʿalā kulli shayʾin qadīr.',
    en: 'Glory be to Allah (33), praise be to Allah (33), Allah is the Greatest (33), completing the hundred with: none has the right to be worshipped but Allah alone, without partner; His is the dominion and the praise, and He is able to do all things.',
    fr: 'Gloire à Allah (33), louange à Allah (33), Allah est le plus Grand (33), et pour compléter cent : nul ne mérite d’être adoré sauf Allah, seul, sans associé ; à Lui la royauté et la louange, et Il est capable de toute chose.',
    tk: 'Sübhânallah (33), elhamdülillah (33), Allahu ekber (33); yüzü tamamlamak için: Allah’tan başka ilah yoktur, tektir, ortağı yoktur; mülk ve hamd O’nundur, O her şeye kadirdir.',
    src: 'Muslim 597',
  },
  {
    id: 4, cat: 'prayer',
    ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    tr: 'Allāhu lā ilāha illā huwa l-ḥayyu l-qayyūm, lā taʾkhudhuhu sinatun wa lā nawm… wa huwa l-ʿaliyyu l-ʿaẓīm.',
    en: 'Āyat al-Kursī: Allah — there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and the earth… His Throne extends over the heavens and the earth, and their preservation tires Him not. He is the Most High, the Most Great.',
    fr: 'Āyat al-Kursī : Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient ce qui est dans les cieux et sur la terre… Son Trône déborde les cieux et la terre, dont la garde ne Lui coûte aucune peine. Il est le Très-Haut, le Très-Grand.',
    tk: 'Âyetü’l-Kürsî: Allah, O’ndan başka ilah yoktur; diridir, kayyumdur. O’nu ne uyuklama ne uyku tutar. Göklerde ve yerde ne varsa O’nundur… Kürsüsü gökleri ve yeri kuşatmıştır; onları korumak O’na ağır gelmez. O yücedir, büyüktür.',
    src: 'Qurʾan 2:255 · an-Nasaʾi, as-Sunan al-Kubra',
  },
  {
    id: 5, cat: 'prayer',
    ar: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ',
    tr: 'Allāhumma aʿinnī ʿalā dhikrika wa shukrika wa ḥusni ʿibādatik.',
    en: 'O Allah, help me to remember You, to thank You, and to worship You well.',
    fr: 'Ô Allah, aide-moi à T’invoquer, à Te remercier et à bien T’adorer.',
    tk: 'Allah’ım, Seni anmam, Sana şükretmem ve Sana güzelce ibadet etmem için bana yardım et.',
    src: 'Abu Dawud 1522',
  },
  {
    id: 6, cat: 'prayer',
    ar: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    tr: 'Allāhumma rabba hādhihi d-daʿwati t-tāmmah, wa ṣ-ṣalāti l-qāʾimah, āti Muḥammadan al-wasīlata wa l-faḍīlah, wabʿath-hu maqāman maḥmūdan alladhī waʿadtah.',
    en: 'After the adhan: O Allah, Lord of this perfect call and the prayer about to be established, grant Muhammad the intercession and the excellence, and raise him to the praised station You have promised him.',
    fr: 'Après l’adhan : Ô Allah, Seigneur de cet appel parfait et de la prière qui va être accomplie, accorde à Muhammad l’intercession et l’excellence, et élève-le au rang louable que Tu lui as promis.',
    tk: 'Ezandan sonra: Allah’ım, bu eksiksiz davetin ve kılınacak namazın Rabbi! Muhammed’e vesileyi ve fazileti ver, onu vaat ettiğin Makâm-ı Mahmûd’a ulaştır.',
    src: 'Bukhari 614',
  },

  // ── Morning
  {
    id: 10, cat: 'morning',
    ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    tr: 'Aṣbaḥnā wa aṣbaḥa l-mulku lillāh, wa l-ḥamdu lillāh, lā ilāha illā llāhu waḥdahu lā sharīka lah, lahu l-mulku wa lahu l-ḥamdu wa huwa ʿalā kulli shayʾin qadīr.',
    en: 'We have reached the morning, and the dominion belongs to Allah. Praise be to Allah. None has the right to be worshipped but Allah alone, without partner; His is the dominion and the praise, and He is able to do all things.',
    fr: 'Nous voici au matin et la royauté appartient à Allah. Louange à Allah. Nul ne mérite d’être adoré sauf Allah, seul, sans associé ; à Lui la royauté et la louange, et Il est capable de toute chose.',
    tk: 'Sabaha erdik, mülk de Allah’ın olarak sabaha erdi. Hamd Allah’adır. Allah’tan başka ilah yoktur, tektir, ortağı yoktur; mülk ve hamd O’nundur, O her şeye kadirdir.',
    src: 'Muslim 2723',
  },
  {
    id: 11, cat: 'morning',
    ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    tr: 'Allāhumma bika aṣbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūtu, wa ilayka n-nushūr.',
    en: 'O Allah, by You we enter the morning and by You the evening, by You we live and by You we die, and to You is the resurrection.',
    fr: 'Ô Allah, c’est par Toi que nous atteignons le matin et le soir, par Toi que nous vivons et mourons, et vers Toi est la résurrection.',
    tk: 'Allah’ım, Seninle sabaha ve akşama erdik; Seninle yaşar, Seninle ölürüz; dönüş Sanadır.',
    src: 'Tirmidhi 3391',
  },
  {
    id: 12, cat: 'morning',
    ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    tr: 'Allāhumma anta rabbī lā ilāha illā ant, khalaqtanī wa ana ʿabduk, wa ana ʿalā ʿahdika wa waʿdika mā staṭaʿt, aʿūdhu bika min sharri mā ṣanaʿt, abūʾu laka bi-niʿmatika ʿalayy, wa abūʾu bi-dhanbī faghfir lī, fa-innahu lā yaghfiru dh-dhunūba illā ant.',
    en: 'Sayyid al-Istighfar: O Allah, You are my Lord; none has the right to be worshipped but You. You created me and I am Your servant, and I keep Your covenant and promise as best I can. I seek refuge in You from the evil I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.',
    fr: 'Sayyid al-Istighfar : Ô Allah, Tu es mon Seigneur, nul ne mérite d’être adoré sauf Toi. Tu m’as créé et je suis Ton serviteur ; je reste fidèle à Ton pacte et à Ta promesse autant que je le peux. Je cherche refuge auprès de Toi contre le mal que j’ai commis. Je reconnais Ton bienfait sur moi et je reconnais mon péché : pardonne-moi, car nul ne pardonne les péchés sauf Toi.',
    tk: 'Seyyidü’l-İstiğfâr: Allah’ım, Sen benim Rabbimsin, Senden başka ilah yoktur. Beni Sen yarattın, ben Senin kulunum; gücüm yettiğince Sana verdiğim söz ve ahid üzereyim. Yaptıklarımın şerrinden Sana sığınırım. Bana olan nimetini ikrar eder, günahımı itiraf ederim; beni bağışla, çünkü günahları Senden başkası bağışlamaz.',
    src: 'Bukhari 6306',
  },
  {
    id: 13, cat: 'morning', repeat: 3,
    ar: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    tr: 'Bismi llāhi lladhī lā yaḍurru maʿa smihi shayʾun fī l-arḍi wa lā fī s-samāʾ, wa huwa s-samīʿu l-ʿalīm.',
    en: 'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
    fr: 'Au nom d’Allah, avec le nom duquel rien sur terre ni dans le ciel ne peut nuire, et Il est Celui qui entend tout, l’Omniscient.',
    tk: 'İsmiyle birlikte yerde ve gökte hiçbir şeyin zarar veremediği Allah’ın adıyla. O işitendir, bilendir.',
    src: 'Abu Dawud 5088 · Tirmidhi 3388',
  },
  {
    id: 14, cat: 'morning', repeat: 3,
    ar: 'رَضِيتُ بِاللهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    tr: 'Raḍītu bi-llāhi rabbā, wa bi-l-islāmi dīnā, wa bi-Muḥammadin ṣallā llāhu ʿalayhi wa sallam nabiyyā.',
    en: 'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.',
    fr: 'J’agrée Allah comme Seigneur, l’islam comme religion et Muhammad ﷺ comme Prophète.',
    tk: 'Rab olarak Allah’tan, din olarak İslam’dan, peygamber olarak Muhammed ﷺ’den razı oldum.',
    src: 'Abu Dawud 5072',
  },
  {
    id: 15, cat: 'morning', repeat: 7,
    ar: 'حَسْبِيَ اللهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    tr: 'Ḥasbiya llāhu lā ilāha illā huw, ʿalayhi tawakkaltu wa huwa rabbu l-ʿarshi l-ʿaẓīm.',
    en: 'Allah is sufficient for me; none has the right to be worshipped but Him. In Him I place my trust, and He is Lord of the Mighty Throne.',
    fr: 'Allah me suffit ; nul ne mérite d’être adoré sauf Lui. En Lui je place ma confiance, et Il est le Seigneur du Trône immense.',
    tk: 'Allah bana yeter; O’ndan başka ilah yoktur. O’na tevekkül ettim; O büyük Arş’ın Rabbidir.',
    src: 'Abu Dawud 5081 · Qurʾan 9:129',
  },
  {
    id: 16, cat: 'morning', repeat: 100,
    ar: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
    tr: 'Subḥāna llāhi wa bi-ḥamdih.',
    en: 'Glory be to Allah, and praise be to Him.',
    fr: 'Gloire et louange à Allah.',
    tk: 'Allah’ı hamd ile tesbih ederim.',
    src: 'Muslim 2692',
  },
  {
    id: 17, cat: 'morning',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
    tr: 'Allāhumma innī asʾaluka l-ʿāfiyata fī d-dunyā wa l-ākhirah.',
    en: 'O Allah, I ask You for well-being in this world and the next.',
    fr: 'Ô Allah, je Te demande le bien-être dans ce monde et dans l’au-delà.',
    tk: 'Allah’ım, Senden dünyada ve ahirette afiyet isterim.',
    src: 'Abu Dawud 5074 · Ibn Majah 3871',
  },

  // ── Evening
  {
    id: 20, cat: 'evening',
    ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    tr: 'Amsaynā wa amsā l-mulku lillāh, wa l-ḥamdu lillāh, lā ilāha illā llāhu waḥdahu lā sharīka lah, lahu l-mulku wa lahu l-ḥamdu wa huwa ʿalā kulli shayʾin qadīr.',
    en: 'We have reached the evening, and the dominion belongs to Allah. Praise be to Allah. None has the right to be worshipped but Allah alone, without partner; His is the dominion and the praise, and He is able to do all things.',
    fr: 'Nous voici au soir et la royauté appartient à Allah. Louange à Allah. Nul ne mérite d’être adoré sauf Allah, seul, sans associé ; à Lui la royauté et la louange, et Il est capable de toute chose.',
    tk: 'Akşama erdik, mülk de Allah’ın olarak akşama erdi. Hamd Allah’adır. Allah’tan başka ilah yoktur, tektir, ortağı yoktur; mülk ve hamd O’nundur, O her şeye kadirdir.',
    src: 'Muslim 2723',
  },
  {
    id: 21, cat: 'evening',
    ar: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    tr: 'Allāhumma bika amsaynā, wa bika aṣbaḥnā, wa bika naḥyā, wa bika namūtu, wa ilayka l-maṣīr.',
    en: 'O Allah, by You we enter the evening and by You the morning, by You we live and by You we die, and to You is the final return.',
    fr: 'Ô Allah, c’est par Toi que nous atteignons le soir et le matin, par Toi que nous vivons et mourons, et vers Toi est le retour.',
    tk: 'Allah’ım, Seninle akşama ve sabaha erdik; Seninle yaşar, Seninle ölürüz; varış Sanadır.',
    src: 'Tirmidhi 3391',
  },
  {
    id: 22, cat: 'evening', repeat: 3,
    ar: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    tr: 'Aʿūdhu bi-kalimāti llāhi t-tāmmāti min sharri mā khalaq.',
    en: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    fr: 'Je cherche refuge auprès des paroles parfaites d’Allah contre le mal de ce qu’Il a créé.',
    tk: 'Yarattıklarının şerrinden Allah’ın eksiksiz kelimelerine sığınırım.',
    src: 'Muslim 2709',
  },
  {
    id: 23, cat: 'evening', repeat: 3,
    ar: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    tr: 'Bismi llāhi lladhī lā yaḍurru maʿa smihi shayʾun fī l-arḍi wa lā fī s-samāʾ, wa huwa s-samīʿu l-ʿalīm.',
    en: 'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
    fr: 'Au nom d’Allah, avec le nom duquel rien sur terre ni dans le ciel ne peut nuire, et Il est Celui qui entend tout, l’Omniscient.',
    tk: 'İsmiyle birlikte yerde ve gökte hiçbir şeyin zarar veremediği Allah’ın adıyla. O işitendir, bilendir.',
    src: 'Abu Dawud 5088 · Tirmidhi 3388',
  },
  {
    id: 24, cat: 'evening',
    ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    tr: 'Allāhumma anta rabbī lā ilāha illā ant, khalaqtanī wa ana ʿabduk… fa-innahu lā yaghfiru dh-dhunūba illā ant.',
    en: 'Sayyid al-Istighfar, said in the evening as in the morning: O Allah, You are my Lord… forgive me, for none forgives sins but You.',
    fr: 'Sayyid al-Istighfar, dit le soir comme le matin : Ô Allah, Tu es mon Seigneur… pardonne-moi, car nul ne pardonne les péchés sauf Toi.',
    tk: 'Seyyidü’l-İstiğfâr, sabah gibi akşam da okunur: Allah’ım, Sen benim Rabbimsin… beni bağışla, günahları Senden başkası bağışlamaz.',
    src: 'Bukhari 6306',
  },

  // ── Eating
  {
    id: 30, cat: 'eating',
    ar: 'بِسْمِ اللهِ',
    tr: 'Bismi llāh.',
    en: 'Before eating: In the name of Allah.',
    fr: 'Avant de manger : Au nom d’Allah.',
    tk: 'Yemekten önce: Allah’ın adıyla.',
    src: 'Abu Dawud 3767 · Tirmidhi 1858',
  },
  {
    id: 31, cat: 'eating',
    ar: 'بِسْمِ اللهِ أَوَّلَهُ وَآخِرَهُ',
    tr: 'Bismi llāhi awwalahu wa ākhirah.',
    en: 'If you forgot at the start: In the name of Allah, at its beginning and its end.',
    fr: 'Si on l’a oublié au début : Au nom d’Allah, au début et à la fin.',
    tk: 'Başta unutulduysa: Başında ve sonunda Allah’ın adıyla.',
    src: 'Abu Dawud 3767 · Tirmidhi 1858',
  },
  {
    id: 32, cat: 'eating',
    ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا، وَرَزَقَنِيهِ، مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    tr: 'Al-ḥamdu lillāhi lladhī aṭʿamanī hādhā wa razaqanīh, min ghayri ḥawlin minnī wa lā quwwah.',
    en: 'After eating: Praise be to Allah who fed me this and provided it for me, without any might or power on my part.',
    fr: 'Après le repas : Louange à Allah qui m’a nourri de ceci et me l’a accordé, sans force ni puissance de ma part.',
    tk: 'Yemekten sonra: Benim hiçbir güç ve kuvvetim olmadan bana bunu yediren ve rızık olarak veren Allah’a hamd olsun.',
    src: 'Abu Dawud 4023 · Tirmidhi 3458',
  },

  // ── Home
  {
    id: 40, cat: 'home',
    ar: 'بِسْمِ اللهِ، تَوَكَّلْتُ عَلَى اللهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
    tr: 'Bismi llāh, tawakkaltu ʿalā llāh, wa lā ḥawla wa lā quwwata illā bi-llāh.',
    en: 'Leaving home: In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.',
    fr: 'En sortant : Au nom d’Allah, je place ma confiance en Allah ; il n’y a de force ni de puissance qu’en Allah.',
    tk: 'Evden çıkarken: Allah’ın adıyla, Allah’a tevekkül ettim; güç ve kuvvet ancak Allah’ladır.',
    src: 'Abu Dawud 5095 · Tirmidhi 3426',
  },
  {
    id: 41, cat: 'home',
    ar: 'بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا، وَعَلَى اللهِ رَبِّنَا تَوَكَّلْنَا',
    tr: 'Bismi llāhi walajnā, wa bismi llāhi kharajnā, wa ʿalā llāhi rabbinā tawakkalnā.',
    en: 'Entering home: In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we rely.',
    fr: 'En entrant : Au nom d’Allah nous entrons, au nom d’Allah nous sortons, et en Allah notre Seigneur nous plaçons notre confiance.',
    tk: 'Eve girerken: Allah’ın adıyla girdik, Allah’ın adıyla çıktık ve Rabbimiz Allah’a tevekkül ettik.',
    src: 'Abu Dawud 5096',
  },

  // ── Travel
  {
    id: 50, cat: 'travel',
    ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    tr: 'Subḥāna lladhī sakhkhara lanā hādhā wa mā kunnā lahu muqrinīn, wa innā ilā rabbinā la-munqalibūn.',
    en: 'Glory be to Him who has subjected this to us, for we could never have done it ourselves, and to our Lord we shall surely return.',
    fr: 'Gloire à Celui qui a mis ceci à notre service, alors que nous n’étions pas capables de le dominer ; et c’est vers notre Seigneur que nous retournerons.',
    tk: 'Bunu bizim hizmetimize veren Allah’ı tesbih ederiz; yoksa biz buna güç yetiremezdik. Şüphesiz biz Rabbimize döneceğiz.',
    src: 'Qurʾan 43:13–14 · Muslim 1342',
  },
  {
    id: 51, cat: 'travel',
    ar: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ',
    tr: 'Allāhumma innā nasʾaluka fī safarinā hādhā l-birra wa t-taqwā, wa mina l-ʿamali mā tarḍā. Allāhumma hawwin ʿalaynā safaranā hādhā waṭwi ʿannā buʿdah.',
    en: 'O Allah, we ask You on this journey of ours for righteousness and piety, and for deeds that please You. O Allah, make this journey easy for us and shorten its distance.',
    fr: 'Ô Allah, nous Te demandons, en ce voyage, la bonté et la piété, et des œuvres qui Te plaisent. Ô Allah, facilite-nous ce voyage et raccourcis-en la distance.',
    tk: 'Allah’ım, bu yolculuğumuzda Senden iyilik ve takva, razı olacağın ameller isteriz. Allah’ım, bu yolculuğu bize kolaylaştır ve uzaklığını dür.',
    src: 'Muslim 1342',
  },

  // ── Rain & weather
  {
    id: 60, cat: 'rain',
    ar: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
    tr: 'Allāhumma ṣayyiban nāfiʿā.',
    en: 'When it rains: O Allah, let it be a beneficial rain.',
    fr: 'Quand il pleut : Ô Allah, fais que ce soit une pluie bénéfique.',
    tk: 'Yağmur yağarken: Allah’ım, faydalı bir yağmur kıl.',
    src: 'Bukhari 1032',
  },
  {
    id: 61, cat: 'rain',
    ar: 'مُطِرْنَا بِفَضْلِ اللهِ وَرَحْمَتِهِ',
    tr: 'Muṭirnā bi-faḍli llāhi wa raḥmatih.',
    en: 'After rain: We have been given rain by the grace and mercy of Allah.',
    fr: 'Après la pluie : Nous avons reçu la pluie par la grâce et la miséricorde d’Allah.',
    tk: 'Yağmurdan sonra: Allah’ın lütfu ve rahmetiyle yağmura kavuştuk.',
    src: 'Bukhari 846 · Muslim 71',
  },
  {
    id: 62, cat: 'rain',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا، وَخَيْرَ مَا فِيهَا، وَخَيْرَ مَا أُرْسِلَتْ بِهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا، وَشَرِّ مَا فِيهَا، وَشَرِّ مَا أُرْسِلَتْ بِهِ',
    tr: 'Allāhumma innī asʾaluka khayrahā, wa khayra mā fīhā, wa khayra mā ursilat bih, wa aʿūdhu bika min sharrihā, wa sharri mā fīhā, wa sharri mā ursilat bih.',
    en: 'When the wind blows: O Allah, I ask You for its good, the good within it and the good it was sent with, and I seek refuge in You from its evil, the evil within it and the evil it was sent with.',
    fr: 'Quand le vent souffle : Ô Allah, je Te demande son bien, le bien qu’il contient et le bien avec lequel il a été envoyé, et je cherche refuge auprès de Toi contre son mal, le mal qu’il contient et le mal avec lequel il a été envoyé.',
    tk: 'Rüzgâr estiğinde: Allah’ım, Senden onun hayrını, içindekinin hayrını ve gönderildiği şeyin hayrını isterim; onun şerrinden, içindekinin şerrinden ve gönderildiği şeyin şerrinden Sana sığınırım.',
    src: 'Muslim 899',
  },

  // ── Distress
  {
    id: 70, cat: 'distress',
    ar: 'لَا إِلَهَ إِلَّا اللهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
    tr: 'Lā ilāha illā llāhu l-ʿaẓīmu l-ḥalīm, lā ilāha illā llāhu rabbu l-ʿarshi l-ʿaẓīm, lā ilāha illā llāhu rabbu s-samāwāti wa rabbu l-arḍi wa rabbu l-ʿarshi l-karīm.',
    en: 'None has the right to be worshipped but Allah, the Mighty, the Forbearing. None but Allah, Lord of the Mighty Throne. None but Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.',
    fr: 'Nul ne mérite d’être adoré sauf Allah, l’Immense, le Longanime. Nul sauf Allah, Seigneur du Trône immense. Nul sauf Allah, Seigneur des cieux, Seigneur de la terre et Seigneur du noble Trône.',
    tk: 'Azîm ve Halîm olan Allah’tan başka ilah yoktur. Büyük Arş’ın Rabbi Allah’tan başka ilah yoktur. Göklerin Rabbi, yerin Rabbi ve kerîm Arş’ın Rabbi Allah’tan başka ilah yoktur.',
    src: 'Bukhari 6346 · Muslim 2730',
  },
  {
    id: 71, cat: 'distress',
    ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    tr: 'Allāhumma innī aʿūdhu bika mina l-hammi wa l-ḥazan, wa l-ʿajzi wa l-kasal, wa l-bukhli wa l-jubn, wa ḍalaʿi d-dayni wa ghalabati r-rijāl.',
    en: 'O Allah, I seek refuge in You from worry and grief, from weakness and laziness, from miserliness and cowardice, from the burden of debt and from being overpowered by men.',
    fr: 'Ô Allah, je cherche refuge auprès de Toi contre le souci et la tristesse, l’impuissance et la paresse, l’avarice et la lâcheté, le poids de la dette et la domination des hommes.',
    tk: 'Allah’ım, kaygı ve hüzünden, acizlik ve tembellikten, cimrilik ve korkaklıktan, borcun ağırlığından ve insanların baskısından Sana sığınırım.',
    src: 'Bukhari 6369',
  },
  {
    id: 72, cat: 'distress',
    ar: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    tr: 'Lā ilāha illā anta subḥānaka innī kuntu mina ẓ-ẓālimīn.',
    en: 'The prayer of Yunus: There is no deity except You; glory be to You. Indeed, I have been of the wrongdoers.',
    fr: 'L’invocation de Younous : Point de divinité à part Toi ! Gloire à Toi ! J’ai été du nombre des injustes.',
    tk: 'Yunus’un duası: Senden başka ilah yoktur. Seni tesbih ederim; ben gerçekten zalimlerden oldum.',
    src: 'Qurʾan 21:87 · Tirmidhi 3505',
  },
  {
    id: 73, cat: 'distress',
    ar: 'حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ',
    tr: 'Ḥasbunā llāhu wa niʿma l-wakīl.',
    en: 'Allah is sufficient for us, and He is the best Disposer of affairs.',
    fr: 'Allah nous suffit ; Il est notre meilleur garant.',
    tk: 'Allah bize yeter; O ne güzel vekildir.',
    src: 'Qurʾan 3:173 · Bukhari 4563',
  },

  // ── Sleep
  {
    id: 80, cat: 'sleep',
    ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    tr: 'Bi-smika llāhumma amūtu wa aḥyā.',
    en: 'Before sleeping: In Your name, O Allah, I die and I live.',
    fr: 'Avant de dormir : C’est en Ton nom, Ô Allah, que je meurs et que je vis.',
    tk: 'Uyumadan önce: Allah’ım, Senin adınla ölür ve dirilirim.',
    src: 'Bukhari 6324',
  },
  {
    id: 81, cat: 'sleep',
    ar: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    tr: 'Allāhumma qinī ʿadhābaka yawma tabʿathu ʿibādak.',
    en: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
    fr: 'Ô Allah, préserve-moi de Ton châtiment le jour où Tu ressusciteras Tes serviteurs.',
    tk: 'Allah’ım, kullarını dirilttiğin gün beni azabından koru.',
    src: 'Abu Dawud 5045 · Tirmidhi 3398',
  },
  {
    id: 82, cat: 'sleep',
    ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    tr: 'Al-ḥamdu lillāhi lladhī aḥyānā baʿda mā amātanā wa ilayhi n-nushūr.',
    en: 'On waking: Praise be to Allah who gave us life after He had caused us to die, and to Him is the resurrection.',
    fr: 'Au réveil : Louange à Allah qui nous a rendu la vie après nous avoir fait mourir, et vers Lui est la résurrection.',
    tk: 'Uyanınca: Bizi öldürdükten sonra dirilten Allah’a hamd olsun; dönüş O’nadır.',
    src: 'Bukhari 6324',
  },

  // ── Occasions
  {
    id: 90, cat: 'occasions',
    ar: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    tr: 'Allāhumma innaka ʿafuwwun tuḥibbu l-ʿafwa faʿfu ʿannī.',
    en: 'Laylat al-Qadr: O Allah, You are Pardoning and love to pardon, so pardon me.',
    fr: 'Laylat al-Qadr : Ô Allah, Tu es Celui qui pardonne et Tu aimes le pardon, alors pardonne-moi.',
    tk: 'Kadir gecesi: Allah’ım, Sen affedicisin, affetmeyi seversin; beni affet.',
    src: 'Tirmidhi 3513',
  },
  {
    id: 91, cat: 'occasions',
    ar: 'ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللهُ',
    tr: 'Dhahaba ẓ-ẓamaʾu wa btallati l-ʿurūqu wa thabata l-ajru in shāʾa llāh.',
    en: 'Breaking the fast: The thirst has gone, the veins are moistened, and the reward is assured, if Allah wills.',
    fr: 'À la rupture du jeûne : La soif est partie, les veines sont humectées et la récompense est acquise, si Allah le veut.',
    tk: 'İftarda: Susuzluk gitti, damarlar ıslandı; Allah dilerse ecir sabit oldu.',
    src: 'Abu Dawud 2357',
  },
  {
    id: 92, cat: 'occasions',
    ar: 'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ، رَبِّي وَرَبُّكَ اللهُ',
    tr: 'Allāhumma ahillahu ʿalaynā bi-l-yumni wa l-īmān, wa s-salāmati wa l-islām, rabbī wa rabbuka llāh.',
    en: 'Seeing the new moon: O Allah, let it rise over us with blessing and faith, safety and Islam. My Lord and your Lord is Allah.',
    fr: 'En voyant le croissant : Ô Allah, fais-le se lever sur nous avec bénédiction et foi, paix et islam. Mon Seigneur et ton Seigneur est Allah.',
    tk: 'Hilali görünce: Allah’ım, onu üzerimize bereket ve iman, esenlik ve İslam ile doğdur. Benim de senin de Rabbin Allah’tır.',
    src: 'Tirmidhi 3451',
  },
  {
    id: 93, cat: 'occasions',
    ar: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    tr: 'Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka ḥamīdun majīd.',
    en: 'Friday — increase in sending blessings: O Allah, send blessings upon Muhammad and the family of Muhammad, as You sent blessings upon Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious.',
    fr: 'Le vendredi, multiplier la prière sur le Prophète : Ô Allah, prie sur Muhammad et sur la famille de Muhammad, comme Tu as prié sur Ibrahim et sur la famille d’Ibrahim. Tu es Digne de louange et de gloire.',
    tk: 'Cuma günü salavatı çoğaltmak: Allah’ım, İbrahim’e ve İbrahim’in ailesine rahmet ettiğin gibi Muhammed’e ve Muhammed’in ailesine de rahmet et. Şüphesiz Sen övülmeye layık ve yücesin.',
    src: 'Bukhari 3370 · Abu Dawud 1047',
  },
  {
    id: 94, cat: 'occasions',
    ar: 'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ، اللهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ',
    tr: 'Allāhu akbar, Allāhu akbar, lā ilāha illā llāh, wa llāhu akbar, Allāhu akbar, wa lillāhi l-ḥamd.',
    en: 'The takbir of Eid: Allah is the Greatest, Allah is the Greatest; none has the right to be worshipped but Allah. Allah is the Greatest, Allah is the Greatest, and to Allah belongs all praise.',
    fr: 'Le takbir de l’Aïd : Allah est le plus Grand, Allah est le plus Grand ; nul ne mérite d’être adoré sauf Allah. Allah est le plus Grand, Allah est le plus Grand, et à Allah la louange.',
    tk: 'Bayram tekbiri: Allah en büyüktür, Allah en büyüktür; Allah’tan başka ilah yoktur. Allah en büyüktür, Allah en büyüktür; hamd Allah’adır.',
    src: 'Ibn Abi Shaybah, al-Musannaf · from Ibn Masʿud',
  },
];
