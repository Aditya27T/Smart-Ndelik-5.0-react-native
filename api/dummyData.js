export const dummyData = {
  
  sliderPhotos: [
    { id: 1, name: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { id: 2, name: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { id: 3, name: 'https://images.pexels.com/photos/2878741/pexels-photo-2878741.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { id: 4, name: 'https://images.pexels.com/photos/1432794/pexels-photo-1432794.jpeg?auto=compress&cs=tinysrgb&w=800' }
  ],
  coffeeTypes: [
    { 
      id: 1, 
      name: 'Arabica', 
      image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      articleImage: 'https://images.pexels.com/photos/4109744/pexels-photo-4109744.jpeg?auto=compress&cs=tinysrgb&w=800',
      article: `Kopi Arabica adalah jenis kopi yang paling populer di dunia, menguasai lebih dari 60% produksi kopi global. Dikenal karena rasanya yang kompleks, aromatik, dan tingkat keasaman yang lebih tinggi, Arabica menawarkan nuansa rasa mulai dari buah-buahan manis hingga bunga.\n\nTanaman ini tumbuh subur di dataran tinggi dengan iklim sejuk dan curah hujan yang stabil. Proses penanamannya yang lebih sulit dan rentan terhadap hama membuat harga biji kopi Arabica cenderung lebih mahal dibandingkan jenis lainnya.`
    },
    { 
      id: 2, 
      name: 'Robusta', 
      image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      articleImage: 'https://images.pexels.com/photos/302896/pexels-photo-302896.jpeg?auto=compress&cs=tinysrgb&w=800',
      article: `Seperti namanya, Robusta adalah jenis kopi yang lebih "kuat". Biji kopinya memiliki kandungan kafein dua kali lipat lebih banyak daripada Arabica, menghasilkan rasa yang lebih kuat, pahit, dan sedikit terasa seperti karet. Kopi ini sering digunakan dalam campuran espresso untuk menghasilkan crema yang tebal.\n\nTanaman Robusta lebih tahan terhadap penyakit dan dapat tumbuh di iklim yang lebih panas dan lembab, membuatnya lebih mudah untuk dibudidayakan.`
    },
    { 
      id: 3, 
      name: 'Liberica', 
      image: 'https://images.pexels.com/photos/2878741/pexels-photo-2878741.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      articleImage: 'https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg?auto=compress&cs=tinysrgb&w=800',
      article: `Liberica adalah jenis kopi yang langka, hanya menyumbang sebagian kecil dari produksi kopi dunia. Biji kopinya memiliki bentuk asimetris yang unik dan ukurannya lebih besar dari jenis lain. Rasanya sangat khas, sering dideskripsikan memiliki aroma smoky, woody, dan sedikit rasa bunga. Karena kelangkaannya, Liberica menjadi primadona bagi para pencari pengalaman kopi yang unik.`
    },
    { 
      id: 4, 
      name: 'Excelsa', 
      image: 'https://images.pexels.com/photos/1432794/pexels-photo-1432794.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      articleImage: 'https://images.pexels.com/photos/373639/pexels-photo-373639.jpeg?auto=compress&cs=tinysrgb&w=800',
      article: `Meskipun pernah dianggap sebagai spesies tersendiri, Excelsa sekarang secara teknis diklasifikasikan sebagai varietas dari Liberica. Namun, profil rasanya sangat berbeda. Kopi Excelsa menawarkan rasa yang kompleks, menggabungkan karakter asam seperti kopi ringan dengan nuansa rasa yang lebih gelap dan dalam. Hal ini membuatnya menjadi tambahan yang menarik untuk campuran kopi guna memberikan kedalaman rasa.`
    },
  ],
  monitoringData: {
    processed: 1247,
    efficiency: 92,
    qualityDistribution: {
      good: 78,
      average: 18,
      poor: 4
    },
    voltage: { value: '220.5V', status: 'Normal' },
    current: { value: '2.3A', status: 'Safe' },
    power: { value: '507W', status: 'Normal' },
  },
  selectionHistory: [
    { id: 1, date: '2024-12-15 14:30', status: 'Completed', processed: 1000, good: 94, rejected: 6 },
    { id: 2, date: '2024-12-15 10:15', status: 'Failed', processed: 850, good: 67, rejected: 33 },
    { id: 3, date: '2024-12-14 16:45', status: 'Completed', processed: 1200, good: 89, rejected: 11 },
  ],
  userProfile: {
    id: '1',
    username: 'Coffee Lover',
    email: 'user@smartndelik.com',
    profileImage: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
};
