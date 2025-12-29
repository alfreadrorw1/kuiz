// Question Database
const QUESTION_DATABASE = {
    'umum': [
        {
            id: 'umum_1',
            text: "Ibukota Indonesia adalah?",
            options: ["Jakarta", "Bandung", "Surabaya", "Medan"],
            correctAnswer: "Jakarta",
            hint: "Kota terbesar di Indonesia",
            difficulty: "easy"
        },
        {
            id: 'umum_2',
            text: "Warna bendera Indonesia?",
            options: ["Merah-Putih", "Merah-Hijau", "Biru-Putih", "Kuning-Hijau"],
            correctAnswer: "Merah-Putih",
            hint: "Dua warna",
            difficulty: "easy"
        },
        {
            id: 'umum_3',
            text: "Planet terdekat dari Matahari?",
            options: ["Venus", "Mars", "Merkurius", "Bumi"],
            correctAnswer: "Merkurius",
            hint: "Planet terkecil",
            difficulty: "medium"
        },
        {
            id: 'umum_4',
            text: "2 + 2 x 2 = ?",
            options: ["6", "8", "4", "10"],
            correctAnswer: "6",
            hint: "Perkalian dulu",
            difficulty: "medium"
        },
        {
            id: 'umum_5',
            text: "Hewan yang dikenal sebagai raja hutan?",
            options: ["Singa", "Harimau", "Gajah", "Serigala"],
            correctAnswer: "Singa",
            hint: "Berkaki empat",
            difficulty: "easy"
        },
        {
            id: 'umum_6',
            text: "Bulan ke berapa dalam setahun?",
            options: ["12", "10", "11", "9"],
            correctAnswer: "12",
            hint: "Bulan terakhir",
            difficulty: "easy"
        },
        {
            id: 'umum_7',
            text: "Ibu kota Jepang?",
            options: ["Tokyo", "Osaka", "Kyoto", "Nagoya"],
            correctAnswer: "Tokyo",
            hint: "Kota metropolitan",
            difficulty: "medium"
        },
        {
            id: 'umum_8',
            text: "Bahan utama pembuat kaca?",
            options: ["Pasir", "Kayu", "Batu", "Tanah"],
            correctAnswer: "Pasir",
            hint: "Dari pantai",
            difficulty: "hard"
        },
        {
            id: 'umum_9',
            text: "Satuan waktu terkecil?",
            options: ["Detik", "Menit", "Jam", "Hari"],
            correctAnswer: "Detik",
            hint: "60 detik = 1 menit",
            difficulty: "easy"
        },
        {
            id: 'umum_10',
            text: "Negara dengan penduduk terbanyak?",
            options: ["China", "India", "Amerika", "Indonesia"],
            correctAnswer: "China",
            hint: "Di Asia",
            difficulty: "medium"
        }
    ],
    'sains': [
        {
            id: 'sains_1',
            text: "Planet terbesar di tata surya?",
            options: ["Jupiter", "Saturnus", "Neptunus", "Bumi"],
            correctAnswer: "Jupiter",
            hint: "Memiliki cincin",
            difficulty: "medium"
        },
        {
            id: 'sains_2',
            text: "Unsur kimia dengan simbol O?",
            options: ["Oksigen", "Emas", "Perak", "Besi"],
            correctAnswer: "Oksigen",
            hint: "Untuk bernafas",
            difficulty: "easy"
        },
        {
            id: 'sains_3',
            text: "Hewan mamalia terbesar di dunia?",
            options: ["Paus Biru", "Gajah", "Jerapah", "Badak"],
            correctAnswer: "Paus Biru",
            hint: "Hidup di laut",
            difficulty: "medium"
        },
        {
            id: 'sains_4',
            text: "Bagian tumbuhan untuk fotosintesis?",
            options: ["Daun", "Batang", "Akar", "Bunga"],
            correctAnswer: "Daun",
            hint: "Biasanya berwarna hijau",
            difficulty: "easy"
        },
        {
            id: 'sains_5',
            text: "Planet dengan cincin yang terkenal?",
            options: ["Saturnus", "Jupiter", "Uranus", "Mars"],
            correctAnswer: "Saturnus",
            hint: "Cincin es dan batu",
            difficulty: "medium"
        },
        {
            id: 'sains_6',
            text: "Gaya yang menarik benda ke bumi?",
            options: ["Gravitasi", "Magnet", "Listrik", "Gesek"],
            correctAnswer: "Gravitasi",
            hint: "Ditemukan Newton",
            difficulty: "easy"
        },
        {
            id: 'sains_7',
            text: "Zat cair yang membeku jadi es?",
            options: ["Air", "Minyak", "Alkohol", "Merkuri"],
            correctAnswer: "Air",
            hint: "H2O",
            difficulty: "easy"
        },
        {
            id: 'sains_8',
            text: "Organ tubuh untuk memompa darah?",
            options: ["Jantung", "Paru-paru", "Hati", "Ginjal"],
            correctAnswer: "Jantung",
            hint: "Berdebar",
            difficulty: "easy"
        },
        {
            id: 'sains_9',
            text: "Gas yang dihasilkan tumbuhan?",
            options: ["Oksigen", "Karbon Dioksida", "Nitrogen", "Helium"],
            correctAnswer: "Oksigen",
            hint: "Untuk bernafas",
            difficulty: "medium"
        },
        {
            id: 'sains_10',
            text: "Ilmu yang mempelajari kehidupan?",
            options: ["Biologi", "Fisika", "Kimia", "Geologi"],
            correctAnswer: "Biologi",
            hint: "Bio = hidup",
            difficulty: "medium"
        }
    ],
    'sejarah': [
        {
            id: 'sejarah_1',
            text: "Tahun berapa Indonesia merdeka?",
            options: ["1945", "1949", "1950", "1965"],
            correctAnswer: "1945",
            hint: "17 Agustus",
            difficulty: "easy"
        },
        {
            id: 'sejarah_2',
            text: "Presiden pertama Indonesia?",
            options: ["Soekarno", "Soeharto", "Habibie", "Megawati"],
            correctAnswer: "Soekarno",
            hint: "Bapak Proklamator",
            difficulty: "easy"
        },
        {
            id: 'sejarah_3',
            text: "Sumpah Pemuda dicetuskan tahun?",
            options: ["1928", "1945", "1908", "1918"],
            correctAnswer: "1928",
            hint: "28 Oktober",
            difficulty: "medium"
        },
        {
            id: 'sejarah_4',
            text: "Penjajah Indonesia paling lama?",
            options: ["Belanda", "Inggris", "Jepang", "Portugis"],
            correctAnswer: "Belanda",
            hint: "350 tahun",
            difficulty: "medium"
        },
        {
            id: 'sejarah_5',
            text: "Pahlawan dari Aceh?",
            options: ["Cut Nyak Dien", "R.A. Kartini", "Diponegoro", "Pattimura"],
            correctAnswer: "Cut Nyak Dien",
            hint: "Perempuan pemberani",
            difficulty: "medium"
        },
        {
            id: 'sejarah_6',
            text: "Kerajaan Hindu pertama di Indonesia?",
            options: ["Kutai", "Sriwijaya", "Majapahit", "Mataram"],
            correctAnswer: "Kutai",
            hint: "Di Kalimantan",
            difficulty: "hard"
        },
        {
            id: 'sejarah_7',
            text: "Perang terbesar di dunia?",
            options: ["Perang Dunia II", "Perang Dunia I", "Perang Vietnam", "Perang Korea"],
            correctAnswer: "Perang Dunia II",
            hint: "1939-1945",
            difficulty: "medium"
        },
        {
            id: 'sejarah_8',
            text: "Penemu lampu pijar?",
            options: ["Thomas Edison", "Albert Einstein", "Alexander Graham Bell", "Nikola Tesla"],
            correctAnswer: "Thomas Edison",
            hint: "Amerika",
            difficulty: "medium"
        },
        {
            id: 'sejarah_9',
            text: "Piagam Jakarta disusun tahun?",
            options: ["1945", "1949", "1955", "1965"],
            correctAnswer: "1945",
            hint: "Sebelum UUD",
            difficulty: "hard"
        },
        {
            id: 'sejarah_10',
            text: "Lagu kebangsaan Indonesia?",
            options: ["Indonesia Raya", "Garuda Pancasila", "Bagimu Negeri", "Maju Tak Gentar"],
            correctAnswer: "Indonesia Raya",
            hint: "W.R. Supratman",
            difficulty: "easy"
        }
    ],
    'olahraga': [
        {
            id: 'olahraga_1',
            text: "Olahraga yang menggunakan raket dan shuttlecock?",
            options: ["Bulu Tangkis", "Tenis", "Squash", "Tenis Meja"],
            correctAnswer: "Bulu Tangkis",
            hint: "Badminton",
            difficulty: "easy"
        },
        {
            id: 'olahraga_2',
            text: "Jumlah pemain dalam tim sepak bola?",
            options: ["11", "10", "9", "12"],
            correctAnswer: "11",
            hint: "Termasuk kiper",
            difficulty: "easy"
        },
        {
            id: 'olahraga_3',
            text: "Negara asal sepak bola?",
            options: ["Inggris", "Brazil", "Italia", "Jerman"],
            correctAnswer: "Inggris",
            hint: "Britania Raya",
            difficulty: "medium"
        },
        {
            id: 'olahraga_4',
            text: "Warna kartu dalam sepak bola?",
            options: ["Kuning & Merah", "Hijau & Biru", "Putih & Hitam", "Orange & Ungu"],
            correctAnswer: "Kuning & Merah",
            hint: "Perwarnaan wasit",
            difficulty: "easy"
        },
        {
            id: 'olahraga_5',
            text: "Olahraga dengan pemain disebut pemanah?",
            options: ["Panahan", "Menembak", "Anggar", "Tinju"],
            correctAnswer: "Panahan",
            hint: "Menggunakan busur",
            difficulty: "medium"
        },
        {
            id: 'olahraga_6',
            text: "Cabang olahraga renang gaya dada disebut?",
            options: ["Breaststroke", "Freestyle", "Butterfly", "Backstroke"],
            correctAnswer: "Breaststroke",
            hint: "Seperti katak",
            difficulty: "medium"
        },
        {
            id: 'olahraga_7',
            text: "Pemain basket legendaris Chicago Bulls?",
            options: ["Michael Jordan", "Kobe Bryant", "LeBron James", "Stephen Curry"],
            correctAnswer: "Michael Jordan",
            hint: "Nomor 23",
            difficulty: "medium"
        },
        {
            id: 'olahraga_8',
            text: "Olahraga dengan papan dan roda?",
            options: ["Skateboard", "Sepeda", "Rollerblade", "Scooter"],
            correctAnswer: "Skateboard",
            hint: "Ekstrim",
            difficulty: "easy"
        },
        {
            id: 'olahraga_9',
            text: "Cabang atletik lari tercepat?",
            options: ["Sprint", "Marathon", "Jogging", "Cross Country"],
            correctAnswer: "Sprint",
            hint: "100 meter",
            difficulty: "easy"
        },
        {
            id: 'olahraga_10',
            text: "Olahraga dengan bola oval?",
            options: ["Rugby", "Sepak Bola", "Basket", "Voli"],
            correctAnswer: "Rugby",
            hint: "Seperti American Football",
            difficulty: "medium"
        }
    ],
    'hiburan': [
        {
            id: 'hiburan_1',
            text: "Aktor utama film Avengers: Endgame?",
            options: ["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"],
            correctAnswer: "Robert Downey Jr.",
            hint: "Iron Man",
            difficulty: "easy"
        },
        {
            id: 'hiburan_2',
            text: "Penyanyi 'Shape of You'?",
            options: ["Ed Sheeran", "Justin Bieber", "Bruno Mars", "Adele"],
            correctAnswer: "Ed Sheeran",
            hint: "Berambut merah",
            difficulty: "easy"
        },
        {
            id: 'hiburan_3',
            text: "Film animasi Disney 'The Lion King' rilis tahun?",
            options: ["1994", "1995", "1996", "1997"],
            correctAnswer: "1994",
            hint: "Simba",
            difficulty: "medium"
        },
        {
            id: 'hiburan_4',
            text: "Seri Harry Potter terdiri dari berapa buku?",
            options: ["7", "6", "8", "5"],
            correctAnswer: "7",
            hint: "Satu untuk setiap tahun",
            difficulty: "easy"
        },
        {
            id: 'hiburan_5',
            text: "Aktris yang memerankan Hermione Granger?",
            options: ["Emma Watson", "Emma Stone", "Jennifer Lawrence", "Natalie Portman"],
            correctAnswer: "Emma Watson",
            hint: "Juga aktris Beauty and the Beast",
            difficulty: "easy"
        },
        {
            id: 'hiburan_6',
            text: "Grup musik dengan lagu 'Bohemian Rhapsody'?",
            options: ["Queen", "The Beatles", "Led Zeppelin", "Pink Floyd"],
            correctAnswer: "Queen",
            hint: "Freddie Mercury",
            difficulty: "medium"
        },
        {
            id: 'hiburan_7',
            text: "Film Titanic disutradarai oleh?",
            options: ["James Cameron", "Steven Spielberg", "Christopher Nolan", "Peter Jackson"],
            correctAnswer: "James Cameron",
            hint: "Juga sutradara Avatar",
            difficulty: "medium"
        },
        {
            id: 'hiburan_8',
            text: "Karakter Disney dengan rambut panjang ajaib?",
            options: ["Rapunzel", "Cinderella", "Ariel", "Belle"],
            correctAnswer: "Rapunzel",
            hint: "Tangled",
            difficulty: "easy"
        },
        {
            id: 'hiburan_9',
            text: "Lagu 'Despacito' dinyanyikan oleh?",
            options: ["Luis Fonsi", "Shakira", "Ricky Martin", "Jennifer Lopez"],
            correctAnswer: "Luis Fonsi",
            hint: "Daddy Yankee",
            difficulty: "medium"
        },
        {
            id: 'hiburan_10',
            text: "Film superhero pertama Marvel Cinematic Universe?",
            options: ["Iron Man", "Captain America", "Thor", "Hulk"],
            correctAnswer: "Iron Man",
            hint: "2008",
            difficulty: "medium"
        }
    ],
    'teknologi': [
        {
            id: 'teknologi_1',
            text: "Pendiri Microsoft?",
            options: ["Bill Gates", "Steve Jobs", "Mark Zuckerberg", "Elon Musk"],
            correctAnswer: "Bill Gates",
            hint: "Orang terkaya",
            difficulty: "easy"
        },
        {
            id: 'teknologi_2',
            text: "Sistem operasi Android dikembangkan oleh?",
            options: ["Google", "Apple", "Microsoft", "Samsung"],
            correctAnswer: "Google",
            hint: "Perusahaan search engine",
            difficulty: "easy"
        },
        {
            id: 'teknologi_3',
            text: "Alat untuk mengetik di komputer?",
            options: ["Keyboard", "Mouse", "Monitor", "CPU"],
            correctAnswer: "Keyboard",
            hint: "QWERTY",
            difficulty: "easy"
        },
        {
            id: 'teknologi_4',
            text: "Media sosial yang fokus pada foto dan video?",
            options: ["Instagram", "Facebook", "Twitter", "LinkedIn"],
            correctAnswer: "Instagram",
            hint: "Dimiliki Facebook",
            difficulty: "easy"
        },
        {
            id: 'teknologi_5',
            text: "Bahasa pemrograman untuk web development?",
            options: ["JavaScript", "Python", "Java", "C++"],
            correctAnswer: "JavaScript",
            hint: "JS",
            difficulty: "medium"
        },
        {
            id: 'teknologi_6',
            text: "Perusahaan pembuat iPhone?",
            options: ["Apple", "Samsung", "Google", "Xiaomi"],
            correctAnswer: "Apple",
            hint: "Logo apel",
            difficulty: "easy"
        },
        {
            id: 'teknologi_7',
            text: "Pendiri Facebook?",
            options: ["Mark Zuckerberg", "Bill Gates", "Steve Jobs", "Elon Musk"],
            correctAnswer: "Mark Zuckerberg",
            hint: "Dari Harvard",
            difficulty: "easy"
        },
        {
            id: 'teknologi_8',
            text: "Protokol untuk website (www)?",
            options: ["HTTP", "FTP", "SMTP", "TCP"],
            correctAnswer: "HTTP",
            hint: "Hypertext Transfer Protocol",
            difficulty: "hard"
        },
        {
            id: 'teknologi_9',
            text: "Penyimpanan awan Google?",
            options: ["Google Drive", "Dropbox", "OneDrive", "iCloud"],
            correctAnswer: "Google Drive",
            hint: "15GB gratis",
            difficulty: "medium"
        },
        {
            id: 'teknologi_10',
            text: "AI chatbot terkenal dari OpenAI?",
            options: ["ChatGPT", "Bard", "Claude", "Copilot"],
            correctAnswer: "ChatGPT",
            hint: "GPT-4",
            difficulty: "easy"
        }
    ]
};

// Question Management Functions
class QuestionManager {
    constructor() {
        this.questions = QUESTION_DATABASE;
        this.userQuestions = {}; // Questions added by users
    }

    // Get questions by category
    getQuestionsByCategory(category, count = 5) {
        const categoryQuestions = this.questions[category] || [];
        const userCategoryQuestions = this.userQuestions[category] || [];
        
        const allQuestions = [...categoryQuestions, ...userCategoryQuestions];
        
        // Shuffle and return requested number
        return this.shuffleArray(allQuestions).slice(0, count);
    }

    // Add new question
    addQuestion(category, questionData) {
        if (!this.userQuestions[category]) {
            this.userQuestions[category] = [];
        }
        
        const newQuestion = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...questionData,
            addedBy: window.currentUser?.username || 'Anonymous',
            addedAt: Date.now()
        };
        
        this.userQuestions[category].push(newQuestion);
        return newQuestion;
    }

    // Delete question
    deleteQuestion(questionId) {
        for (const category in this.userQuestions) {
            this.userQuestions[category] = this.userQuestions[category].filter(
                q => q.id !== questionId
            );
        }
    }

    // Get all categories
    getCategories() {
        return Object.keys(this.questions);
    }

    // Get question count by category
    getQuestionCount(category) {
        const defaultCount = (this.questions[category] || []).length;
        const userCount = (this.userQuestions[category] || []).length;
        return defaultCount + userCount;
    }

    // Search questions
    searchQuestions(keyword) {
        const results = [];
        keyword = keyword.toLowerCase();
        
        // Search in default questions
        for (const category in this.questions) {
            this.questions[category].forEach(q => {
                if (q.text.toLowerCase().includes(keyword)) {
                    results.push({ ...q, category, source: 'default' });
                }
            });
        }
        
        // Search in user questions
        for (const category in this.userQuestions) {
            this.userQuestions[category].forEach(q => {
                if (q.text.toLowerCase().includes(keyword)) {
                    results.push({ ...q, category, source: 'user' });
                }
            });
        }
        
        return results;
    }

    // Shuffle array
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Load user questions from Firebase
    async loadUserQuestions() {
        try {
            const snapshot = await window.firebaseConfig.database.ref('userQuestions').once('value');
            if (snapshot.exists()) {
                this.userQuestions = snapshot.val() || {};
            }
        } catch (error) {
            console.error('Error loading user questions:', error);
        }
    }

    // Save user questions to Firebase
    async saveUserQuestions() {
        try {
            await window.firebaseConfig.database.ref('userQuestions').set(this.userQuestions);
        } catch (error) {
            console.error('Error saving user questions:', error);
        }
    }
}

// Create global question manager instance
window.questionManager = new QuestionManager();

// Initialize question manager
document.addEventListener('DOMContentLoaded', async () => {
    await window.questionManager.loadUserQuestions();
});