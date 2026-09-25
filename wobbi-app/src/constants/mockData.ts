export const MOCK_STORIES = [
  {
    id: 'story_001',
    title: 'Uzaylı Zumi ve Yıldız Tozu',
    subtitle: 'Yıldızların arasındaki küçük gezgin',
    tag: 'MACERA',
    gradient: ['#FC6049', '#D35400'] as [string, string], // From Figma Primary
    depthColor: '#BA4A00',
    readCount: 120,
  },
  {
    id: 'story_002',
    title: 'Kayıp Müzik Kutusu',
    subtitle: 'Sakin ve dinlendirici bir uyku masalı',
    tag: 'UYKU ÖNCESİ',
    gradient: ['#927AFF', '#76448A'] as [string, string], // From Figma Secondary
    depthColor: '#5B2C6F',
    readCount: 450,
  }
];

export const MOCK_CHARACTERS = [
  {
    id: 'char_001',
    name: 'Cesur Tilki\n(Wobbi)',
    subtitle: 'Ana Hikaye Serisi',
    isHero: true, // Will be rendered wide
    gradient: ['#4FABFD', '#2980B9'] as [string, string], // From Figma Tertiary
    depthColor: '#1A5276',
  },
  {
    id: 'char_002',
    name: 'Bilge\nBaykuş',
    subtitle: 'Ormanın Sırları',
    isHero: false,
    gradient: ['#7EC665', '#27AE60'] as [string, string], // From Figma Success
    depthColor: '#1E8449',
  },
  {
    id: 'char_003',
    name: 'Zıp Zıp\nTavşan',
    subtitle: 'Hızlı Maceralar',
    isHero: false,
    gradient: ['#F1C40F', '#F39C12'] as [string, string],
    depthColor: '#D68910',
  }
];
