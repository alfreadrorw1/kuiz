// ===============================
// GLOBAL STATE
// ===============================

// User State
let currentUser = {
    id: null,
    username: '',
    role: 'anggota',
    isGuest: false,
    totalScore: 0,
    gamesPlayed: 0,
    lastLogin: null,
    createdAt: null
};

// Game State
let gameState = {
    currentScreen: 'auth',
    currentQuestionIndex: 0,
    timer: window.firebaseConfig.GAME_CONFIG.QUESTION_TIME,
    timerInterval: null,
    hasAnswered: false,
    allPlayersAnswered: false,
    roomQuestions: [],
    categories: [],
    gameStarted: false,
    playersAnswered: new Set()
};

// Room State
let roomState = {
    code: '',
    players: {},
    gameStarted: false,
    currentQuestion: 0,
    status: 'waiting',
    answers: {}
};

// UI State
let uiState = {
    isSoundEnabled: true,
    isVoiceChatEnabled: false,
    activeRoomType: null,
    autoNextQuestion: false
};

// DOM Elements Cache
const domElements = {};

// ===============================
// INITIALIZATION
// ===============================

// Initialize Game
async function initGame() {
    // Cache DOM elements
    cacheDOMElements();
    
    // Check for saved user session
    checkUserSession();
    
    // Load categories
    await loadCategories();
    
    // Load global stats
    updateGlobalStats();
    
    // Update developer stats
    updateDeveloperStats();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Game initialized successfully');
}

// Cache DOM elements
function cacheDOMElements() {
    // Screens
    domElements.screens = {
        auth: document.getElementById('authScreen'),
        dashboard: document.getElementById('dashboardScreen'),
        categoryManagement: document.getElementById('categoryManagementScreen'),
        leaderboard: document.getElementById('leaderboardScreen'),
        lobby: document.getElementById('lobbyScreen'),
        waiting: document.getElementById('waitingScreen'),
        game: document.getElementById('gameScreen'),
        result: document.getElementById('resultScreen'),
        questionManagement: document.getElementById('questionManagementScreen')
    };

    // Auth elements
    domElements.auth = {
        loginUsername: document.getElementById('loginUsername'),
        loginPassword: document.getElementById('loginPassword'),
        loginError: document.getElementById('loginError'),
        registerUsername: document.getElementById('registerUsername'),
        registerPassword: document.getElementById('registerPassword'),
        registerConfirmPassword: document.getElementById('registerConfirmPassword'),
        registerError: document.getElementById('registerError'),
        registerSuccess: document.getElementById('registerSuccess')
    };

    // User elements
    domElements.user = {
        avatar: document.getElementById('userAvatar'),
        name: document.getElementById('userName'),
        role: document.getElementById('userRole'),
        initial: document.getElementById('userInitial'),
        score: document.getElementById('userScore'),
        rank: document.getElementById('userRank')
    };

    // Stats elements
    domElements.stats = {
        totalPlayers: document.getElementById('totalPlayers'),
        activeGames: document.getElementById('activeGames'),
        totalQuestions: document.getElementById('totalQuestions'),
        topScore: document.getElementById('topScore')
    };

    // Lobby elements
    domElements.lobby = {
        playerName: document.getElementById('playerName'),
        categoryGrid: document.getElementById('categoryGrid'),
        roomCodeCreate: document.getElementById('roomCodeCreate'),
        roomCodeJoin: document.getElementById('roomCodeJoin'),
        createRoomBtn: document.getElementById('createRoomBtn'),
        joinRoomBtn: document.getElementById('joinRoomBtn'),
        roomCreateSection: document.getElementById('roomCreateSection'),
        roomJoinSection: document.getElementById('roomJoinSection'),
        soundToggleBtn: document.getElementById('soundToggleBtn')
    };

    // Waiting room elements
    domElements.waiting = {
        roomCodeDisplay: document.getElementById('roomCodeDisplay'),
        waitingPlayersList: document.getElementById('waitingPlayersList'),
        waitingPlayerCount: document.getElementById('waitingPlayerCount'),
        startGameBtn: document.getElementById('startGameBtn'),
        voiceToggleBtn: document.getElementById('voiceToggleBtn'),
        voicePlayers: document.getElementById('voicePlayers')
    };

    // Game elements
    domElements.game = {
        gameCategory: document.getElementById('gameCategory'),
        questionCounter: document.getElementById('questionCounter'),
        questionText: document.getElementById('questionText'),
        optionsContainer: document.getElementById('optionsContainer'),
        gameTimer: document.getElementById('gameTimer'),
        gamePlayersScore: document.getElementById('gamePlayersScore')
    };

    // Result elements
    domElements.result = {
        resultRoomCode: document.getElementById('resultRoomCode'),
        winnerName: document.getElementById('winnerName'),
        finalResults: document.getElementById('finalResults')
    };

    // Category management elements
    domElements.categoryManagement = {
        newCategoryName: document.getElementById('newCategoryName'),
        newCategoryIcon: document.getElementById('newCategoryIcon'),
        categoriesList: document.getElementById('categoriesList'),
        categoryAccessInfo: document.getElementById('categoryAccessInfo')
    };

    // Question management elements
    domElements.questionManagement = {
        questionTextInput: document.getElementById('questionTextInput'),
        questionCategorySelect: document.getElementById('questionCategorySelect'),
        optionA: document.getElementById('optionA'),
        optionB: document.getElementById('optionB'),
        optionC: document.getElementById('optionC'),
        optionD: document.getElementById('optionD'),
        correctAnswerSelect: document.getElementById('correctAnswerSelect'),
        questionsList: document.getElementById('questionsList')
    };

    // Leaderboard elements
    domElements.leaderboard = {
        leaderboardList: document.getElementById('leaderboardList'),
        totalRankedPlayers: document.getElementById('totalRankedPlayers')
    };

    // Admin elements
    domElements.admin = {
        modal: document.getElementById('adminModal'),
        username: document.getElementById('adminUsername'),
        password: document.getElementById('adminPassword'),
        loginError: document.getElementById('adminLoginError'),
        loginSection: document.getElementById('adminLoginSection'),
        dashboardSection: document.getElementById('adminDashboardSection')
    };

    // Utility elements
    domElements.utility = {
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toastMessage'),
        loadingOverlay: document.getElementById('loadingOverlay'),
        loadingText: document.getElementById('loadingText')
    };
}

// Setup event listeners
function setupEventListeners() {
    // Enter key in auth forms
    domElements.auth.loginPassword?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
    });

    domElements.auth.registerPassword?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') register();
    });

    // Auto-fill player name in lobby
    domElements.lobby.playerName?.addEventListener('focus', function() {
        if (!this.value && currentUser.username) {
            this.value = currentUser.username;
        }
    });

    // Room code input formatting
    domElements.lobby.roomCodeCreate?.addEventListener('input', function() {
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });

    domElements.lobby.roomCodeJoin?.addEventListener('input', function() {
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });
}

// ===============================
// AUTHENTICATION FUNCTIONS
// ===============================

// Check user session
function checkUserSession() {
    const savedUser = localStorage.getItem('tebakmulti_user');
    if (savedUser) {
        try {
            const userData = JSON.parse(savedUser);
            currentUser = userData;
            showScreen('dashboard');
            updateUserUI();
            updateUserStats();
        } catch (error) {
            localStorage.removeItem('tebakmulti_user');
            showScreen('auth');
        }
    } else {
        showScreen('auth');
    }
}

// Save user session
function saveUserSession() {
    localStorage.setItem('tebakmulti_user', JSON.stringify(currentUser));
}

// Show auth tab
function showAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelector('.auth-tab:nth-child(1)').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelector('.auth-tab:nth-child(2)').classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.parentNode.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Login function
async function login() {
    const username = domElements.auth.loginUsername.value.trim();
    const password = domElements.auth.loginPassword.value.trim();
    
    if (!username || !password) {
        showError(domElements.auth.loginError, 'Username dan password harus diisi!');
        return;
    }
    
    showLoading('Memproses login...');
    
    try {
        // Check if admin login
        if (window.firebaseConfig.ADMIN_CREDENTIALS[username] && 
            window.firebaseConfig.ADMIN_CREDENTIALS[username] === password) {
            
            // Admin login
            currentUser = {
                id: 'admin_' + Date.now(),
                username: username,
                role: username === 'developer' ? 'developer' : 'admin',
                isAdmin: true,
                isGuest: false,
                totalScore: 0,
                gamesPlayed: 0,
                lastLogin: Date.now(),
                createdAt: Date.now()
            };
            
            saveUserSession();
            updateUserUI();
            showScreen('dashboard');
            showToast(`Login berhasil sebagai ${currentUser.role}!`);
            
            domElements.auth.loginUsername.value = '';
            domElements.auth.loginPassword.value = '';
            hideLoading();
            return;
        }
        
        // Regular user login
        const usersRef = window.firebaseConfig.database.ref('users');
        const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
        
        if (!snapshot.exists()) {
            showError(domElements.auth.loginError, 'Username tidak ditemukan!');
            hideLoading();
            return;
        }
        
        const users = snapshot.val();
        const userId = Object.keys(users)[0];
        const userData = users[userId];
        
        if (userData.password !== password) {
            showError(domElements.auth.loginError, 'Password salah!');
            hideLoading();
            return;
        }
        
        // Update user data
        currentUser = {
            ...userData,
            id: userId,
            lastLogin: Date.now()
        };
        
        // Update last login in database
        await usersRef.child(userId).update({
            lastLogin: firebase.database.ServerValue.TIMESTAMP
        });
        
        saveUserSession();
        updateUserUI();
        updateUserStats();
        
        showScreen('dashboard');
        showToast('Login berhasil! Selamat datang ' + username);
        
        domElements.auth.loginUsername.value = '';
        domElements.auth.loginPassword.value = '';
        
    } catch (error) {
        console.error('Login error:', error);
        showError(domElements.auth.loginError, 'Terjadi kesalahan. Coba lagi!');
    } finally {
        hideLoading();
    }
}

// Register function
async function register() {
    const username = domElements.auth.registerUsername.value.trim();
    const password = domElements.auth.registerPassword.value.trim();
    const confirmPassword = domElements.auth.registerConfirmPassword.value.trim();
    
    if (!username || !password || !confirmPassword) {
        showError(domElements.auth.registerError, 'Semua field harus diisi!');
        return;
    }
    
    if (username.length < 3) {
        showError(domElements.auth.registerError, 'Username minimal 3 karakter!');
        return;
    }
    
    if (password.length < 6) {
        showError(domElements.auth.registerError, 'Password minimal 6 karakter!');
        return;
    }
    
    if (password !== confirmPassword) {
        showError(domElements.auth.registerError, 'Password tidak cocok!');
        return;
    }
    
    showLoading('Membuat akun...');
    
    try {
        const usersRef = window.firebaseConfig.database.ref('users');
        const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');
        
        if (snapshot.exists()) {
            showError(domElements.auth.registerError, 'Username sudah digunakan!');
            hideLoading();
            return;
        }
        
        // Check if username is admin
        if (window.firebaseConfig.ADMIN_CREDENTIALS[username]) {
            showError(domElements.auth.registerError, 'Username tidak tersedia!');
            hideLoading();
            return;
        }
        
        const newUser = {
            username: username,
            password: password,
            totalScore: 0,
            gamesPlayed: 0,
            role: 'anggota',
            isGuest: false,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            lastLogin: firebase.database.ServerValue.TIMESTAMP
        };
        
        const newUserRef = await usersRef.push(newUser);
        
        currentUser = {
            ...newUser,
            id: newUserRef.key
        };
        
        saveUserSession();
        updateUserUI();
        
        domElements.auth.registerSuccess.style.display = 'flex';
        domElements.auth.registerError.style.display = 'none';
        
        showToast('Registrasi berhasil!');
        
        setTimeout(() => {
            showAuthTab('login');
            domElements.auth.registerSuccess.style.display = 'none';
            
            domElements.auth.registerUsername.value = '';
            domElements.auth.registerPassword.value = '';
            domElements.auth.registerConfirmPassword.value = '';
        }, 2000);
        
    } catch (error) {
        console.error('Register error:', error);
        showError(domElements.auth.registerError, 'Terjadi kesalahan. Coba lagi!');
    } finally {
        hideLoading();
    }
}

// Login as guest
function loginAsGuest() {
    currentUser = {
        id: 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        username: 'Guest_' + Math.floor(Math.random() * 10000),
        role: 'anggota',
        isGuest: true,
        totalScore: 0,
        gamesPlayed: 0,
        lastLogin: Date.now(),
        createdAt: Date.now()
    };
    
    saveUserSession();
    updateUserUI();
    showScreen('dashboard');
    showToast('Berhasil masuk sebagai tamu!');
}

// Logout function
function logout() {
    // Leave room if in one
    if (roomState.code) {
        leaveRoom();
    }
    
    // Leave voice chat if active
    if (window.voiceChatManager && window.voiceChatManager.isJoined) {
        window.voiceChatManager.leaveChannel();
    }
    
    // Reset states
    currentUser = {
        id: null,
        username: '',
        role: 'anggota',
        isGuest: false,
        totalScore: 0,
        gamesPlayed: 0,
        lastLogin: null,
        createdAt: null
    };
    
    roomState = {
        code: '',
        players: {},
        gameStarted: false,
        currentQuestion: 0,
        status: 'waiting',
        answers: {}
    };
    
    gameState.playersAnswered.clear();
    gameState.hasAnswered = false;
    gameState.allPlayersAnswered = false;
    
    localStorage.removeItem('tebakmulti_user');
    showScreen('auth');
    showToast('Anda telah logout');
}

// Update user UI
function updateUserUI() {
    if (!currentUser.username) return;
    
    const initial = currentUser.username.charAt(0).toUpperCase();
    domElements.user.avatar.textContent = initial;
    domElements.user.initial.textContent = initial;
    domElements.user.name.textContent = currentUser.username;
    
    // Update role display
    const roleText = getRoleDisplay(currentUser.role);
    domElements.user.role.innerHTML = roleText;
    
    // Auto-fill player name in lobby if empty
    if (domElements.lobby.playerName && !domElements.lobby.playerName.value) {
        domElements.lobby.playerName.value = currentUser.username;
    }
    
    // Update category access info
    updateCategoryAccessInfo();
}

// Get role display text with badge
function getRoleDisplay(role) {
    const roleNames = {
        'anggota': 'Anggota',
        'vip': 'VIP',
        'admin': 'Admin',
        'developer': 'Developer'
    };
    
    const roleColors = {
        'anggota': 'role-anggota',
        'vip': 'role-vip',
        'admin': 'role-admin',
        'developer': 'role-developer'
    };
    
    return `<span class="role-badge ${roleColors[role]}">${roleNames[role]}</span>`;
}

// Update user stats
async function updateUserStats() {
    if (!currentUser.id || currentUser.isGuest) return;
    
    try {
        const userRef = window.firebaseConfig.database.ref('users/' + currentUser.id);
        const snapshot = await userRef.once('value');
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            currentUser.totalScore = userData.totalScore || 0;
            currentUser.gamesPlayed = userData.gamesPlayed || 0;
            
            domElements.user.score.textContent = currentUser.totalScore;
            
            const rank = await getUserRank();
            domElements.user.rank.textContent = '#' + rank;
        }
    } catch (error) {
        console.error('Error updating user stats:', error);
    }
}

// Get user rank
async function getUserRank() {
    try {
        const usersRef = window.firebaseConfig.database.ref('users');
        const snapshot = await usersRef.orderByChild('totalScore').once('value');
        
        if (!snapshot.exists()) return 0;
        
        const users = snapshot.val();
        const usersArray = Object.entries(users)
            .map(([id, data]) => ({ id, ...data }))
            .filter(user => !user.isGuest && user.role !== 'admin' && user.role !== 'developer')
            .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
        
        const userIndex = usersArray.findIndex(user => user.id === currentUser.id);
        return userIndex >= 0 ? userIndex + 1 : 0;
        
    } catch (error) {
        console.error('Error getting user rank:', error);
        return 0;
    }
}

// ===============================
// DASHBOARD FUNCTIONS
// ===============================

// Update global stats
async function updateGlobalStats() {
    try {
        const usersRef = window.firebaseConfig.database.ref('users');
        const usersSnapshot = await usersRef.once('value');
        const totalPlayers = usersSnapshot.exists() ? Object.keys(usersSnapshot.val()).length : 0;
        domElements.stats.totalPlayers.textContent = totalPlayers;
        
        const roomsRef = window.firebaseConfig.database.ref('rooms');
        const roomsSnapshot = await roomsRef.once('value');
        const activeGames = roomsSnapshot.exists() ? Object.keys(roomsSnapshot.val()).length : 0;
        domElements.stats.activeGames.textContent = activeGames;
        
        const questionsRef = window.firebaseConfig.database.ref('questions');
        const questionsSnapshot = await questionsRef.once('value');
        const totalQuestions = questionsSnapshot.exists() ? Object.keys(questionsSnapshot.val()).length : 0;
        
        // Add user questions count
        const userQuestionsCount = Object.values(window.questionManager.userQuestions || {}).reduce(
            (total, questions) => total + questions.length, 0
        );
        
        domElements.stats.totalQuestions.textContent = totalQuestions + userQuestionsCount;
        
        if (usersSnapshot.exists()) {
            const users = usersSnapshot.val();
            const scores = Object.values(users)
                .filter(user => user.role === 'anggota' || user.role === 'vip')
                .map(user => user.totalScore || 0);
            const topScore = scores.length > 0 ? Math.max(...scores) : 0;
            domElements.stats.topScore.textContent = topScore;
        }
        
        updateUserStats();
        
    } catch (error) {
        console.error('Error updating global stats:', error);
    }
}

// Update developer stats
function updateDeveloperStats() {
    document.getElementById('devProjects').textContent = Math.floor(Math.random() * 30 + 20) + '+';
    document.getElementById('devPlayers').textContent = Math.floor(Math.random() * 5000 + 5000) + '+';
    document.getElementById('devRating').textContent = (Math.random() * 0.5 + 4.5).toFixed(1);
}

// ===============================
// CATEGORY MANAGEMENT
// ===============================

// Load categories
async function loadCategories() {
    try {
        const categoriesRef = window.firebaseConfig.database.ref('categories');
        const snapshot = await categoriesRef.once('value');
        
        if (snapshot.exists()) {
            gameState.categories = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
        } else {
            // Create default categories
            const categoriesData = {};
            window.firebaseConfig.DEFAULT_CATEGORIES.forEach(cat => {
                categoriesData[cat.id] = cat;
            });
            
            await categoriesRef.set(categoriesData);
            gameState.categories = [...window.firebaseConfig.DEFAULT_CATEGORIES];
        }
        
        updateCategoryDisplay();
        updateCategoryList();
        updateQuestionCategorySelect();
        
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Update category display
function updateCategoryDisplay() {
    if (!domElements.lobby.categoryGrid) return;
    
    domElements.lobby.categoryGrid.innerHTML = '';
    
    gameState.categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item-lobby';
        categoryItem.innerHTML = `
            <div class="category-icon-lobby">
                <i class="fas ${category.icon}"></i>
            </div>
            <div class="category-name-lobby">${category.name}</div>
        `;
        
        categoryItem.addEventListener('click', () => {
            document.querySelectorAll('.category-item-lobby').forEach(item => {
                item.classList.remove('selected');
            });
            
            categoryItem.classList.add('selected');
        });
        
        domElements.lobby.categoryGrid.appendChild(categoryItem);
    });
    
    if (gameState.categories.length > 0) {
        domElements.lobby.categoryGrid.querySelector('.category-item-lobby').classList.add('selected');
    }
}

// Update category list for management
function updateCategoryList() {
    if (!domElements.categoryManagement.categoriesList) return;
    
    domElements.categoryManagement.categoriesList.innerHTML = '';
    
    gameState.categories.forEach(category => {
        const questionCount = window.questionManager.getQuestionCount(category.id);
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <div class="category-details">
                <div class="category-icon">
                    <i class="fas ${category.icon}"></i>
                </div>
                <div>
                    <div class="category-name">${category.name}</div>
                    <div class="category-stats">${questionCount} soal</div>
                </div>
            </div>
            <div class="category-actions">
                ${(currentUser.role === 'admin' || currentUser.role === 'developer') ? `
                <button class="btn-category-action edit" onclick="editCategory('${category.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-category-action" onclick="deleteCategory('${category.id}')">
                    <i class="fas fa-trash"></i>
                </button>
                ` : ''}
            </div>
        `;
        
        domElements.categoryManagement.categoriesList.appendChild(categoryItem);
    });
}

// Update category access info
function updateCategoryAccessInfo() {
    if (!domElements.categoryManagement.categoryAccessInfo) return;
    
    if (currentUser.role === 'admin' || currentUser.role === 'developer') {
        domElements.categoryManagement.categoryAccessInfo.innerHTML = 
            '<i class="fas fa-edit"></i> Anda dapat mengedit dan menghapus kategori';
    } else {
        domElements.categoryManagement.categoryAccessInfo.innerHTML = 
            '<i class="fas fa-eye"></i> Hanya admin yang dapat mengedit kategori';
    }
}

// Add new category
async function addNewCategory() {
    // Check role permission
    if (currentUser.role !== 'admin' && currentUser.role !== 'developer') {
        showToast('Hanya admin yang dapat menambah kategori!');
        return;
    }
    
    const name = domElements.categoryManagement.newCategoryName.value.trim();
    const icon = domElements.categoryManagement.newCategoryIcon.value;
    
    if (!name) {
        showToast('Nama kategori harus diisi!');
        return;
    }
    
    const categoryId = name.toLowerCase().replace(/\s+/g, '-');
    
    if (gameState.categories.find(cat => cat.id === categoryId)) {
        showToast('Kategori sudah ada!');
        return;
    }
    
    try {
        const categoryData = {
            name: name,
            icon: icon,
            questionCount: 0,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };
        
        await window.firebaseConfig.database.ref('categories/' + categoryId).set(categoryData);
        
        gameState.categories.push({ id: categoryId, ...categoryData });
        
        updateCategoryDisplay();
        updateCategoryList();
        updateQuestionCategorySelect();
        
        domElements.categoryManagement.newCategoryName.value = '';
        
        showToast('Kategori berhasil ditambahkan!');
        
    } catch (error) {
        console.error('Error adding category:', error);
        showToast('Gagal menambahkan kategori');
    }
}

// Delete category
async function deleteCategory(categoryId) {
    if (currentUser.role !== 'admin' && currentUser.role !== 'developer') {
        showToast('Hanya admin yang dapat menghapus kategori!');
        return;
    }
    
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
    
    // Check if it's a default category
    const defaultCategories = window.firebaseConfig.DEFAULT_CATEGORIES.map(cat => cat.id);
    if (defaultCategories.includes(categoryId)) {
        showToast('Kategori default tidak dapat dihapus!');
        return;
    }
    
    try {
        await window.firebaseConfig.database.ref('categories/' + categoryId).remove();
        
        gameState.categories = gameState.categories.filter(cat => cat.id !== categoryId);
        
        updateCategoryDisplay();
        updateCategoryList();
        updateQuestionCategorySelect();
        
        showToast('Kategori berhasil dihapus!');
        
    } catch (error) {
        console.error('Error deleting category:', error);
        showToast('Gagal menghapus kategori');
    }
}

// Edit category
async function editCategory(categoryId) {
    if (currentUser.role !== 'admin' && currentUser.role !== 'developer') {
        showToast('Hanya admin yang dapat mengedit kategori!');
        return;
    }
    
    const category = gameState.categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    const newName = prompt('Masukkan nama baru untuk kategori:', category.name);
    if (!newName || newName.trim() === '') return;
    
    try {
        await window.firebaseConfig.database.ref('categories/' + categoryId).update({
            name: newName.trim()
        });
        
        category.name = newName.trim();
        
        updateCategoryDisplay();
        updateCategoryList();
        updateQuestionCategorySelect();
        
        showToast('Kategori berhasil diperbarui!');
        
    } catch (error) {
        console.error('Error editing category:', error);
        showToast('Gagal memperbarui kategori');
    }
}

// ===============================
// QUESTION MANAGEMENT
// ===============================

// Update question category select
function updateQuestionCategorySelect() {
    if (!domElements.questionManagement.questionCategorySelect) return;
    
    domElements.questionManagement.questionCategorySelect.innerHTML = '';
    
    gameState.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        domElements.questionManagement.questionCategorySelect.appendChild(option);
    });
}

// Add new question
async function addNewQuestion() {
    // Check role permission
    if (currentUser.role !== 'admin' && currentUser.role !== 'developer') {
        showToast('Hanya admin yang dapat menambah soal!');
        return;
    }
    
    const questionText = domElements.questionManagement.questionTextInput.value.trim();
    const category = domElements.questionManagement.questionCategorySelect.value;
    const optionA = domElements.questionManagement.optionA.value.trim();
    const optionB = domElements.questionManagement.optionB.value.trim();
    const optionC = domElements.questionManagement.optionC.value.trim();
    const optionD = domElements.questionManagement.optionD.value.trim();
    const correctAnswer = domElements.questionManagement.correctAnswerSelect.value;
    
    // Validation
    if (!questionText || !category) {
        showToast('Pertanyaan dan kategori harus diisi!');
        return;
    }
    
    if (!optionA || !optionB || !optionC || !optionD) {
        showToast('Semua pilihan jawaban harus diisi!');
        return;
    }
    
    const options = [optionA, optionB, optionC, optionD];
    const correctAnswerText = options[correctAnswer.charCodeAt(0) - 65];
    
    const questionData = {
        text: questionText,
        options: options,
        correctAnswer: correctAnswerText,
        difficulty: 'medium',
        addedBy: currentUser.username,
        addedAt: Date.now()
    };
    
    try {
        // Add to local question manager
        window.questionManager.addQuestion(category, questionData);
        
        // Save to Firebase
        await window.questionManager.saveUserQuestions();
        
        // Update category question count
        await updateCategoryQuestionCount(category);
        
        // Update UI
        updateQuestionsList();
        updateGlobalStats();
        
        // Clear form
        domElements.questionManagement.questionTextInput.value = '';
        domElements.questionManagement.optionA.value = '';
        domElements.questionManagement.optionB.value = '';
        domElements.questionManagement.optionC.value = '';
        domElements.questionManagement.optionD.value = '';
        
        showToast('Soal berhasil ditambahkan!');
        
    } catch (error) {
        console.error('Error adding question:', error);
        showToast('Gagal menambahkan soal');
    }
}

// Update category question count
async function updateCategoryQuestionCount(categoryId) {
    try {
        const count = window.questionManager.getQuestionCount(categoryId);
        await window.firebaseConfig.database.ref(`categories/${categoryId}/questionCount`).set(count);
    } catch (error) {
        console.error('Error updating category question count:', error);
    }
}

// Update questions list
function updateQuestionsList() {
    if (!domElements.questionManagement.questionsList) return;
    
    domElements.questionManagement.questionsList.innerHTML = '';
    
    // Get all user questions
    const allQuestions = [];
    for (const category in window.questionManager.userQuestions) {
        window.questionManager.userQuestions[category].forEach(question => {
            allQuestions.push({ ...question, category });
        });
    }
    
    // Sort by date added (newest first)
    allQuestions.sort((a, b) => b.addedAt - a.addedAt);
    
    // Display questions
    allQuestions.forEach(question => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        questionItem.innerHTML = `
            <div class="question-text">${question.text}</div>
            <div class="question-meta">
                <div>
                    <span class="question-category">${question.category}</span>
                    <span style="margin-left: 8px; color: var(--text-secondary);">
                        Ditambahkan oleh: ${question.addedBy || 'Anonymous'}
                    </span>
                </div>
                ${(currentUser.role === 'admin' || currentUser.role === 'developer') ? `
                <div class="question-actions">
                    <button class="btn-category-action edit" onclick="editQuestion('${question.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-category-action" onclick="deleteQuestion('${question.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                ` : ''}
            </div>
        `;
        domElements.questionManagement.questionsList.appendChild(questionItem);
    });
    
    if (allQuestions.length === 0) {
        domElements.questionManagement.questionsList.innerHTML = 
            '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Belum ada soal yang ditambahkan</p>';
    }
}

// Delete question
async function deleteQuestion(questionId) {
    if (currentUser.role !== 'admin' && currentUser.role !== 'developer') {
        showToast('Hanya admin yang dapat menghapus soal!');
        return;
    }
    
    if (!confirm('Apakah Anda yakin ingin menghapus soal ini?')) return;
    
    try {
        // Get category before deleting
        let questionCategory = null;
        for (const category in window.questionManager.userQuestions) {
            const question = window.questionManager.userQuestions[category].find(q => q.id === questionId);
            if (question) {
                questionCategory = category;
                break;
            }
        }
        
        window.questionManager.deleteQuestion(questionId);
        await window.questionManager.saveUserQuestions();
        
        // Update category question count
        if (questionCategory) {
            await updateCategoryQuestionCount(questionCategory);
        }
        
        updateQuestionsList();
        updateGlobalStats();
        
        showToast('Soal berhasil dihapus!');
        
    } catch (error) {
        console.error('Error deleting question:', error);
        showToast('Gagal menghapus soal');
    }
}

// Edit question
async function editQuestion(questionId) {
    if (currentUser.role !== 'admin' && currentUser.role === 'developer') {
        showToast('Hanya admin yang dapat mengedit soal!');
        return;
    }
    
    // Find the question
    let questionToEdit = null;
    let questionCategory = null;
    
    for (const category in window.questionManager.userQuestions) {
        const question = window.questionManager.userQuestions[category].find(q => q.id === questionId);
        if (question) {
            questionToEdit = question;
            questionCategory = category;
            break;
        }
    }
    
    if (!questionToEdit) {
        showToast('Soal tidak ditemukan!');
        return;
    }
    
    // For simplicity, we'll delete and re-add
    const newText = prompt('Masukkan pertanyaan baru:', questionToEdit.text);
    if (!newText || newText.trim() === '') return;
    
    try {
        // Delete old question
        window.questionManager.deleteQuestion(questionId);
        
        // Add new question
        const newQuestion = {
            text: newText,
            options: questionToEdit.options,
            correctAnswer: questionToEdit.correctAnswer,
            difficulty: questionToEdit.difficulty,
            addedBy: currentUser.username,
            addedAt: Date.now()
        };
        
        window.questionManager.addQuestion(questionCategory, newQuestion);
        await window.questionManager.saveUserQuestions();
        
        updateQuestionsList();
        
        showToast('Soal berhasil diperbarui!');
        
    } catch (error) {
        console.error('Error editing question:', error);
        showToast('Gagal memperbarui soal');
    }
}

// ===============================
// LEADERBOARD FUNCTIONS
// ===============================

// Filter leaderboard
async function filterLeaderboard(timeFilter) {
    document.querySelectorAll('.time-filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    try {
        const usersRef = window.firebaseConfig.database.ref('users');
        const snapshot = await usersRef.orderByChild('totalScore').once('value');
        
        if (!snapshot.exists()) {
            domElements.leaderboard.leaderboardList.innerHTML = 
                '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Belum ada data pemain</p>';
            return;
        }
        
        const users = snapshot.val();
        let usersArray = Object.entries(users)
            .map(([id, data]) => ({ id, ...data }))
            .filter(user => (user.role === 'anggota' || user.role === 'vip') && !user.isGuest)
            .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
        
        // Apply time filter (simplified for demo)
        if (timeFilter !== 'all') {
            // In a real app, you would filter by actual date
            usersArray = usersArray.filter(() => Math.random() > 0.3);
        }
        
        updateLeaderboardDisplay(usersArray);
        
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// Update leaderboard display
function updateLeaderboardDisplay(users) {
    domElements.leaderboard.leaderboardList.innerHTML = '';
    
    domElements.leaderboard.totalRankedPlayers.textContent = users.length + ' pemain';
    
    users.forEach((user, index) => {
        const isCurrentUser = user.id === currentUser.id;
        const isTop3 = index < 3;
        
        const leaderboardItem = document.createElement('div');
        leaderboardItem.className = 'leaderboard-item';
        if (isCurrentUser) leaderboardItem.classList.add('you');
        if (isTop3) leaderboardItem.classList.add('top-3');
        
        leaderboardItem.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="player-info">
                <div class="player-avatar">${user.username.charAt(0).toUpperCase()}</div>
                <div class="player-details">
                    <div class="player-name">
                        ${user.username}
                        ${isCurrentUser ? '<span class="player-you">Anda</span>' : ''}
                    </div>
                    <div class="player-stats">
                        <span>${user.gamesPlayed || 0} game</span>
                        <span class="role-badge ${'role-' + user.role}">${user.role}</span>
                    </div>
                </div>
            </div>
            <div class="player-score">${user.totalScore || 0}</div>
        `;
        
        domElements.leaderboard.leaderboardList.appendChild(leaderboardItem);
    });
    
    if (users.length === 0) {
        domElements.leaderboard.leaderboardList.innerHTML = 
            '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Belum ada data pemain</p>';
    }
}

// ===============================
// ROOM FUNCTIONS
// ===============================

// Show room type
function showRoomType(type, element) {
    document.querySelectorAll('.room-action').forEach(action => {
        action.classList.remove('selected');
    });
    
    element.classList.add('selected');
    uiState.activeRoomType = type;
    
    domElements.lobby.roomCreateSection.classList.add('hidden');
    domElements.lobby.roomJoinSection.classList.add('hidden');
    
    if (type === 'create') {
        domElements.lobby.roomCreateSection.classList.remove('hidden');
        generateRoomCode();
    } else {
        domElements.lobby.roomJoinSection.classList.remove('hidden');
    }
}

// Generate room code
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    domElements.lobby.roomCodeCreate.value = code;
    return code;
}

// Create room
async function createRoom() {
    const playerName = domElements.lobby.playerName.value.trim() || currentUser.username;
    let roomCode = domElements.lobby.roomCodeCreate.value.trim().toUpperCase();
    
    if (!playerName) {
        showToast('Masukkan nama kamu terlebih dahulu!');
        return;
    }
    
    if (roomCode.length !== 6) {
        showToast('Kode room harus 6 karakter!');
        return;
    }
    
    showLoading('Membuat room...');
    
    try {
        // Check if room already exists
        const roomRef = window.firebaseConfig.database.ref('rooms/' + roomCode);
        const snapshot = await roomRef.once('value');
        
        if (snapshot.exists()) {
            showToast('Kode room sudah digunakan!');
            hideLoading();
            return;
        }
        
        // Get selected category
        const selectedCategory = document.querySelector('.category-item-lobby.selected');
        const categoryId = selectedCategory ? 
            selectedCategory.querySelector('.category-name-lobby').textContent.toLowerCase().replace(/\s+/g, '-') : 
            'umum';
        
        // Create room
        const playerId = currentUser.id || 'guest_' + Date.now();
        const roomData = {
            code: roomCode,
            creatorId: playerId,
            creatorName: playerName,
            category: categoryId,
            players: {
                [playerId]: {
                    name: playerName,
                    userId: currentUser.id,
                    username: currentUser.username,
                    score: 0,
                    isReady: true,
                    isCreator: true,
                    role: currentUser.role
                }
            },
            status: 'waiting',
            gameStarted: false,
            currentQuestion: 0,
            currentAnswers: {},
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            lastActivity: firebase.database.ServerValue.TIMESTAMP
        };
        
        await roomRef.set(roomData);
        
        // Update room state
        roomState.code = roomCode;
        roomState.players = roomData.players;
        roomState.status = 'waiting';
        
        // Setup room listener
        setupRoomListener(roomCode);
        
        // Join voice chat
        await joinVoiceChat(roomCode);
        
        showScreen('waiting');
        domElements.waiting.roomCodeDisplay.textContent = roomCode;
        updateWaitingRoom();
        
        showToast('Room berhasil dibuat!');
        
    } catch (error) {
        console.error('Error creating room:', error);
        showToast('Gagal membuat room');
    } finally {
        hideLoading();
    }
}

// Join room
async function joinRoom() {
    const playerName = domElements.lobby.playerName.value.trim() || currentUser.username;
    const roomCode = domElements.lobby.roomCodeJoin.value.trim().toUpperCase();
    
    if (!playerName) {
        showToast('Masukkan nama kamu terlebih dahulu!');
        return;
    }
    
    if (roomCode.length !== 6) {
        showToast('Kode room harus 6 karakter!');
        return;
    }
    
    showLoading('Bergabung ke room...');
    
    try {
        const roomRef = window.firebaseConfig.database.ref('rooms/' + roomCode);
        const snapshot = await roomRef.once('value');
        
        if (!snapshot.exists()) {
            showToast('Room tidak ditemukan!');
            hideLoading();
            return;
        }
        
        const roomData = snapshot.val();
        
        if (roomData.status !== 'waiting') {
            showToast('Game sudah dimulai atau room penuh!');
            hideLoading();
            return;
        }
        
        if (Object.keys(roomData.players || {}).length >= window.firebaseConfig.GAME_CONFIG.MAX_PLAYERS) {
            showToast('Room sudah penuh!');
            hideLoading();
            return;
        }
        
        // Check if player already in room
        const existingPlayer = Object.values(roomData.players || {}).find(
            p => p.userId === currentUser.id || p.username === currentUser.username
        );
        
        if (existingPlayer) {
            showToast('Anda sudah berada di room ini!');
            hideLoading();
            return;
        }
        
        // Join room
        const playerId = currentUser.id || 'guest_' + Date.now();
        await roomRef.child('players/' + playerId).set({
            name: playerName,
            userId: currentUser.id,
            username: currentUser.username,
            score: 0,
            isReady: true,
            isCreator: false,
            role: currentUser.role
        });
        
        // Update last activity
        await roomRef.child('lastActivity').set(firebase.database.ServerValue.TIMESTAMP);
        
        // Update room state
        roomState.code = roomCode;
        roomState.players = {
            ...roomData.players,
            [playerId]: {
                name: playerName,
                userId: currentUser.id,
                username: currentUser.username,
                score: 0,
                isReady: true,
                isCreator: false,
                role: currentUser.role
            }
        };
        roomState.status = 'waiting';
        
        // Setup room listener
        setupRoomListener(roomCode);
        
        // Join voice chat
        await joinVoiceChat(roomCode);
        
        showScreen('waiting');
        domElements.waiting.roomCodeDisplay.textContent = roomCode;
        updateWaitingRoom();
        
        showToast('Berhasil bergabung ke room!');
        
    } catch (error) {
        console.error('Error joining room:', error);
        showToast('Gagal bergabung ke room');
    } finally {
        hideLoading();
    }
}

// Setup room listener
function setupRoomListener(roomCode) {
    const roomRef = window.firebaseConfig.database.ref('rooms/' + roomCode);
    
    roomRef.on('value', (snapshot) => {
        if (!snapshot.exists()) {
            // Room was deleted
            if (gameState.currentScreen === 'waiting' || gameState.currentScreen === 'game') {
                showToast('Room telah ditutup!');
                leaveVoiceChat();
                showScreen('lobby');
            }
            return;
        }
        
        const roomData = snapshot.val();
        roomState = roomData;
        
        if (gameState.currentScreen === 'waiting') {
            updateWaitingRoom();
            
            // Check if game started
            if (roomData.gameStarted && !gameState.gameStarted) {
                startGameFromRoom();
            }
        } else if (gameState.currentScreen === 'game') {
            updateGameState(roomData);
        }
    });
}

// Update waiting room
function updateWaitingRoom() {
    if (!domElements.waiting.waitingPlayersList) return;
    
    domElements.waiting.waitingPlayersList.innerHTML = '';
    
    const players = roomState.players || {};
    const playerIds = Object.keys(players);
    
    domElements.waiting.waitingPlayerCount.textContent = 
        `${playerIds.length}/${window.firebaseConfig.GAME_CONFIG.MAX_PLAYERS} pemain`;
    
    playerIds.forEach(playerId => {
        const player = players[playerId];
        const isCurrentUser = player.userId === currentUser.id || 
                             player.username === currentUser.username;
        
        const playerElement = document.createElement('div');
        playerElement.className = 'leaderboard-item';
        if (isCurrentUser) playerElement.classList.add('you');
        
        playerElement.innerHTML = `
            <div class="player-info">
                <div class="player-avatar">${player.name.charAt(0).toUpperCase()}</div>
                <div class="player-details">
                    <div class="player-name">
                        ${player.name}
                        ${player.isCreator ? '<span class="player-you">Host</span>' : ''}
                        ${isCurrentUser ? '<span class="player-you">Anda</span>' : ''}
                    </div>
                    <div class="player-stats">
                        <span class="role-badge role-${player.role || 'anggota'}">${player.role || 'anggota'}</span>
                    </div>
                </div>
            </div>
            <div class="player-score">
                ${player.isReady ? '<i class="fas fa-check" style="color: var(--success);"></i>' : 
                                 '<i class="fas fa-clock" style="color: var(--warning);"></i>'}
            </div>
        `;
        domElements.waiting.waitingPlayersList.appendChild(playerElement);
    });
    
    // Show/hide start button for creator
    if (domElements.waiting.startGameBtn) {
        const currentPlayerId = currentUser.id || Object.keys(players).find(
            id => players[id].username === currentUser.username
        );
        
        const isCreator = currentPlayerId && players[currentPlayerId]?.isCreator;
        
        if (isCreator && playerIds.length >= 2) {
            domElements.waiting.startGameBtn.disabled = false;
            domElements.waiting.startGameBtn.innerHTML = '<i class="fas fa-play"></i> Mulai Game';
        } else if (isCreator) {
            domElements.waiting.startGameBtn.disabled = true;
            domElements.waiting.startGameBtn.innerHTML = '<i class="fas fa-users"></i> Tunggu pemain lain...';
        } else {
            domElements.waiting.startGameBtn.disabled = true;
            domElements.waiting.startGameBtn.innerHTML = '<i class="fas fa-clock"></i> Tunggu host...';
        }
    }
}

// Start game
async function startGame() {
    const players = roomState.players || {};
    const playerIds = Object.keys(players);
    
    // Check if current user is creator
    const currentPlayerId = currentUser.id || Object.keys(players).find(
        id => players[id].username === currentUser.username
    );
    
    if (!currentPlayerId || !players[currentPlayerId]?.isCreator) {
        showToast('Hanya host yang dapat memulai game!');
        return;
    }
    
    if (playerIds.length < 2) {
        showToast('Minimal 2 pemain untuk memulai game!');
        return;
    }
    
    showLoading('Memulai game...');
    
    try {
        // Load questions for category
        await loadQuestionsForCategory(roomState.category);
        
        // Update room status
        const roomRef = window.firebaseConfig.database.ref('rooms/' + roomState.code);
        await roomRef.update({
            gameStarted: true,
            currentQuestion: 0,
            status: 'playing',
            startedAt: firebase.database.ServerValue.TIMESTAMP,
            currentAnswers: {}
        });
        
        // Mute voice chat during game
        if (window.voiceChatManager && window.voiceChatManager.isJoined) {
            window.voiceChatManager.toggleMicrophone();
            uiState.isVoiceChatEnabled = false;
            domElements.waiting.voiceToggleBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        }
        
        // Start game locally
        startGameFromRoom();
        
    } catch (error) {
        console.error('Error starting game:', error);
        showToast('Gagal memulai game');
    } finally {
        hideLoading();
    }
}

// Start game from room data
function startGameFromRoom() {
    gameState.gameStarted = true;
    gameState.currentQuestionIndex = 0;
    gameState.hasAnswered = false;
    gameState.allPlayersAnswered = false;
    gameState.playersAnswered.clear();
    
    showScreen('game');
    loadQuestion(0);
}

// Leave waiting room
async function leaveWaitingRoom() {
    if (!roomState.code) return;
    
    showLoading('Meninggalkan room...');
    
    try {
        const roomRef = window.firebaseConfig.database.ref('rooms/' + roomState.code);
        const players = roomState.players || {};
        
        // Find current player in room
        const currentPlayerId = currentUser.id || Object.keys(players).find(
            id => players[id].username === currentUser.username
        );
        
        if (currentPlayerId) {
            const isCreator = players[currentPlayerId]?.isCreator;
            
            if (isCreator) {
                // Creator leaves - delete room
                await roomRef.remove();
                showToast('Room telah ditutup');
            } else {
                // Player leaves - remove from room
                await roomRef.child('players/' + currentPlayerId).remove();
                showToast('Anda telah meninggalkan room');
            }
        }
        
        // Leave voice chat
        leaveVoiceChat();
        
        // Reset states
        roomState = {
            code: '',
            players: {},
            gameStarted: false,
            currentQuestion: 0,
            status: 'waiting',
            answers: {}
        };
        
        gameState.playersAnswered.clear();
        gameState.hasAnswered = false;
        gameState.allPlayersAnswered = false;
        uiState.isVoiceChatEnabled = false;
        
        showScreen('lobby');
        
    } catch (error) {
        console.error('Error leaving room:', error);
        showToast('Gagal meninggalkan room');
    } finally {
        hideLoading();
    }
}

// Leave room (general)
async function leaveRoom() {
    if (!roomState.code) return;
    
    try {
        const roomRef = window.firebaseConfig.database.ref('rooms/' + roomState.code);
        const players = roomState.players || {};
        
        // Find current player in room
        const currentPlayerId = currentUser.id || Object.keys(players).find(
            id => players[id].username === currentUser.username
        );
        
        if (currentPlayerId) {
            const isCreator = players[currentPlayerId]?.isCreator;
            
            if (isCreator) {
                await roomRef.remove();
            } else {
                await roomRef.child('players/' + currentPlayerId).remove();
            }
        }
        
        roomState.code = '';
        
    } catch (error) {
        console.error('Error leaving room:', error);
    }
}

// ===============================
// VOICE CHAT FUNCTIONS
// ===============================

// Join voice chat
async function joinVoiceChat(roomCode) {
    try {
        if (!window.voiceChatManager) {
            showToast('Voice chat tidak tersedia');
            return;
        }
        
        const channelName = `voice_${roomCode}`;
        const uid = currentUser.id || 'guest_' + Date.now();
        
        const joined = await window.voiceChatManager.joinChannel(channelName, uid);
        
        if (joined) {
            uiState.isVoiceChatEnabled = true;
            domElements.waiting.voiceToggleBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            showToast('Voice chat diaktifkan');
        } else {
            showToast('Gagal bergabung ke voice chat');
        }
    } catch (error) {
        console.error('Error joining voice chat:', error);
        showToast('Gagal bergabung ke voice chat');
    }
}

// Leave voice chat
async function leaveVoiceChat() {
    try {
        if (window.voiceChatManager && window.voiceChatManager.isJoined) {
            await window.voiceChatManager.leaveChannel();
            uiState.isVoiceChatEnabled = false;
            domElements.waiting.voiceToggleBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        }
    } catch (error) {
        console.error('Error leaving voice chat:', error);
    }
}

// Toggle voice chat
async function toggleVoiceChat() {
    try {
        if (!window.voiceChatManager || !window.voiceChatManager.isJoined) {
            await joinVoiceChat(roomState.code);
            return;
        }
        
        const isMicEnabled = await window.voiceChatManager.toggleMicrophone();
        uiState.isVoiceChatEnabled = isMicEnabled;
        
        if (isMicEnabled) {
            domElements.waiting.voiceToggleBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            showToast('Mic diaktifkan');
        } else {
            domElements.waiting.voiceToggleBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            showToast('Mic dimatikan');
        }
    } catch (error) {
        console.error('Error toggling voice chat:', error);
        showToast('Gagal mengontrol voice chat');
    }
}

// ===============================
// GAME FUNCTIONS - FIXED BUGS
// ===============================

// Load questions for category
async function loadQuestionsForCategory(category) {
    try {
        // Get questions from question manager
        gameState.roomQuestions = window.questionManager.getQuestionsByCategory(
            category, 
            window.firebaseConfig.GAME_CONFIG.TOTAL_QUESTIONS
        );
        
        // If not enough questions, add default ones
        if (gameState.roomQuestions.length < window.firebaseConfig.GAME_CONFIG.TOTAL_QUESTIONS) {
            const defaultQuestions = QUESTION_DATABASE[category] || QUESTION_DATABASE['umum'];
            const needed = window.firebaseConfig.GAME_CONFIG.TOTAL_QUESTIONS - gameState.roomQuestions.length;
            const additionalQuestions = window.questionManager.shuffleArray(defaultQuestions).slice(0, needed);
            gameState.roomQuestions = [...gameState.roomQuestions, ...additionalQuestions];
        }
        
        console.log(`Loaded ${gameState.roomQuestions.length} questions for category: ${category}`);
        
    } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback to default questions
        gameState.roomQuestions = QUESTION_DATABASE[category] || QUESTION_DATABASE['umum'];
        gameState.roomQuestions = window.questionManager.shuffleArray(gameState.roomQuestions)
            .slice(0, window.firebaseConfig.GAME_CONFIG.TOTAL_QUESTIONS);
    }
}

// Load question
function loadQuestion(index) {
    if (!gameState.roomQuestions || gameState.roomQuestions.length === 0) {
        showToast('Tidak ada soal tersedia!');
        return;
    }
    
    if (index >= gameState.roomQuestions.length) {
        endGame();
        return;
    }
    
    const question = gameState.roomQuestions[index];
    gameState.currentQuestionIndex = index;
    gameState.hasAnswered = false;
    gameState.allPlayersAnswered = false;
    gameState.timer = window.firebaseConfig.GAME_CONFIG.QUESTION_TIME;
    gameState.playersAnswered.clear();
    
    // Reset auto next question flag
    uiState.autoNextQuestion = false;
    
    // Update UI
    domElements.game.questionText.textContent = question.text;
    domElements.game.questionCounter.textContent = `${index + 1}/${gameState.roomQuestions.length}`;
    
    // Update category
    const category = gameState.categories.find(cat => cat.id === roomState.category);
    if (category) {
        domElements.game.gameCategory.textContent = category.name;
        document.querySelector('#gameScreen .logo-icon i').className = `fas ${category.icon}`;
    }
    
    // Create options
    domElements.game.optionsContainer.innerHTML = '';
    
    const shuffledOptions = window.questionManager.shuffleArray([...question.options]);
    
    shuffledOptions.forEach((option, optionIndex) => {
        const optionElement = document.createElement('button');
        optionElement.className = 'btn-secondary';
        optionElement.style.marginBottom = '10px';
        optionElement.textContent = option;
        optionElement.onclick = () => submitAnswer(option, question.correctAnswer, index);
        domElements.game.optionsContainer.appendChild(optionElement);
    });
    
    // Reset timer display
    if (domElements.game.gameTimer) {
        domElements.game.gameTimer.textContent = gameState.timer;
        domElements.game.gameTimer.style.background = 'var(--gradient-primary)';
    }
    
    // Start timer
    startTimer();
    updateGameScoreboard();
    
    // Update room current question
    updateRoomQuestion(index);
}

// Start timer
function startTimer() {
    clearInterval(gameState.timerInterval);
    
    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        
        if (domElements.game.gameTimer) {
            domElements.game.gameTimer.textContent = gameState.timer;
            
            // Change color when time is running out
            if (gameState.timer <= 5) {
                domElements.game.gameTimer.style.background = 'var(--gradient-secondary)';
            }
        }
        
        if (gameState.timer <= 0) {
            clearInterval(gameState.timerInterval);
            
            // Auto-advance to next question if not all players answered
            if (!uiState.autoNextQuestion) {
                uiState.autoNextQuestion = true;
                setTimeout(() => {
                    nextQuestion();
                }, 2000);
            }
        }
    }, 1000);
}

// Submit answer
async function submitAnswer(selectedAnswer, correctAnswer, questionIndex) {
    if (gameState.hasAnswered || !roomState.code) return;
    
    gameState.hasAnswered = true;
    gameState.playersAnswered.add(currentUser.id || currentUser.username);
    
    // Update player score
    let points = 0;
    if (selectedAnswer === correctAnswer) {
        points = window.firebaseConfig.GAME_CONFIG.POINTS_CORRECT;
        // Bonus for fast answer
        if (gameState.timer > 5) {
            points += window.firebaseConfig.GAME_CONFIG.POINTS_FAST_BONUS;
        }
        showToast(`Benar! +${points} poin`);
    } else if (selectedAnswer === null) {
        showToast('Waktu habis!');
    } else {
        showToast('Salah! Jawaban benar: ' + correctAnswer);
    }
    
    // Update answer in room state
    try {
        const roomRef = window.firebaseConfig.database.ref('rooms/' + roomState.code);
        const playerId = currentUser.id || Object.keys(roomState.players || {}).find(
            id => roomState.players[id].username === currentUser.username
        );
        
        if (playerId) {
            // Update player score
            await roomRef.child(`players/${playerId}/score`).transaction((currentScore) => {
                return (currentScore || 0) + points;
            });
            
            // Record answer
            await roomRef.child(`currentAnswers/${playerId}`).set({
                answer: selectedAnswer,
                isCorrect: selectedAnswer === correctAnswer,
                points: points,
                answeredAt: firebase.database.ServerValue.TIMESTAMP
            });
        }
    } catch (error) {
        console.error('Error updating answer:', error);
    }
    
    // Highlight correct/incorrect answers
    const buttons = domElements.game.optionsContainer.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent === correctAnswer) {
            button.style.background = 'var(--gradient-success)';
            button.style.color = 'white';
            button.style.borderColor = 'var(--success)';
        } else if (button.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
            button.style.background = 'var(--gradient-secondary)';
            button.style.color = 'white';
            button.style.borderColor = 'var(--danger)';
        }
    });
    
    updateGameScoreboard();
    
    // Check if all players have answered
    checkAllPlayersAnswered();
}

// Check if all players have answered
async function checkAllPlayersAnswered() {
    if (!roomState.code || !roomState.players) return;
    
    try {
        const roomRef = window.firebaseConfig.database.ref('rooms/' + roomState.code);
        const snapshot = await roomRef.child('currentAnswers').once('value');
        
        if (snapshot.exists()) {
            const currentAnswers = snapshot.val();
            const players = roomState.players;
            const playerIds = Object.keys(players);
            
            // Count how many players have answered
            const answeredCount = Object.keys(currentAnswers || {}).length;
            
            // If all players have answered, auto-advance after delay
            if (answeredCount >= playerIds.length && !gameState.allPlayersAnswered) {
                gameState.allPlayersAnswered = true;
                clearInterval(gameState.timerInterval);
                
                showToast('Semua pemain telah menjawab!');
                
                // Auto-advance to next question
                setTimeout(() => {
                    if (!uiState.autoNextQuestion) {
                        uiState.autoNextQuestion = true;
                        nextQuestion();
                    }
                }, 3000);
            }
        }
    } catch (error) {
        console.error('Error checking players answered:', error);
    }
}

// Update room question
async function updateRoomQuestion(questionIndex) {
    if (!roomState.code) return;
    
    try {
        const roomRef = window.firebaseConfig.database.ref('rooms/' + roomState.code);
        
        // Clear previous answers
        await roomRef.child('currentAnswers').remove();
        
        // Update question index
        await roomRef.update({
            currentQuestion: questionIndex
        });
    } catch (error) {
        console.error('Error updating room question:', error);
    }
}

// Update game scoreboard
function updateGameScoreboard() {
    if (!domElements.game.gamePlayersScore) return;
    
    const players = roomState.players || {};
    const playersArray = Object.entries(players)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.score - a.score);
    
    domElements.game.gamePlayersScore.innerHTML = '<h3 style="margin-bottom: 10px; color: var(--text);">Skor Pemain:</h3>';
    
    playersArray.forEach((player, index) => {
        const isCurrentUser = player.userId === currentUser.id || 
                             player.username === currentUser.username;
        const playerElement = document.createElement('div');
        playerElement.className = 'leaderboard-item';
        if (isCurrentUser) playerElement.classList.add('you');
        if (index < 3) playerElement.classList.add('top-3');
        
        // Check if player has answered
        const hasAnswered = gameState.playersAnswered.has(player.userId || player.username);
        
        playerElement.innerHTML = `
            <div class="rank">${index + 1}</div>
            <div class="player-info">
                <div class="player-avatar">${player.name.charAt(0).toUpperCase()}</div>
                <div class="player-details">
                    <div class="player-name">
                        ${player.name}
                        ${isCurrentUser ? '<span class="player-you">Anda</span>' : ''}
                        ${hasAnswered ? ' ✓' : ''}
                    </div>
                    <div class="player-stats">
                        <span class="role-badge role-${player.role || 'anggota'}">${player.role || 'anggota'}</span>
                    </div>
                </div>
            </div>
            <div class="player-score">${player.score || 0}</div>
        `;
        domElements.game.gamePlayersScore.appendChild(playerElement);
    });
}

// Update game state from room
function updateGameState(roomData) {
    // Update question if different
    if (roomData.currentQuestion !== gameState.currentQuestionIndex && !gameState.hasAnswered) {
        gameState.currentQuestionIndex = roomData.currentQuestion;
        loadQuestion(roomData.currentQuestion);
    }
    
    // Check answers from other players
    if (roomData.currentAnswers) {
        const currentAnswers = roomData.currentAnswers;
        const players = roomData.players || {};
        
        // Update which players have answered
        Object.keys(currentAnswers).forEach(playerId => {
            const player = players[playerId];
            if (player && (player.userId || player.username)) {
                gameState.playersAnswered.add(player.userId || player.username);
            }
        });
        
        // Check if all players have answered
        const playerIds = Object.keys(players);
        if (Object.keys(currentAnswers).length >= playerIds.length && !gameState.allPlayersAnswered) {
            gameState.allPlayersAnswered = true;
            clearInterval(gameState.timerInterval);
            
            if (!uiState.autoNextQuestion) {
                uiState.autoNextQuestion = true;
                setTimeout(() => {
                    nextQuestion();
                }, 3000);
            }
        }
    }
    
    updateGameScoreboard();
}

// Next question
async function nextQuestion() {
    const nextIndex = gameState.currentQuestionIndex + 1;
    
    if (nextIndex < gameState.roomQuestions.length) {
        loadQuestion(nextIndex);
    } else {
        endGame();
    }
}

// End game
async function endGame() {
    showLoading('Menghitung hasil...');
    
    try {
        const players = roomState.players || {};
        const playersArray = Object.entries(players)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.score - a.score);
        
        // Update user scores in database (if not guest)
        if (!currentUser.isGuest && currentUser.id) {
            const userRef = window.firebaseConfig.database.ref('users/' + currentUser.id);
            const player = playersArray.find(p => p.userId === currentUser.id || p.username === currentUser.username);
            
            if (player) {
                const snapshot = await userRef.once('value');
                
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const newTotalScore = (userData.totalScore || 0) + (player.score || 0);
                    const newGamesPlayed = (userData.gamesPlayed || 0) + 1;
                    
                    await userRef.update({
                        totalScore: newTotalScore,
                        gamesPlayed: newGamesPlayed
                    });
                    
                    currentUser.totalScore = newTotalScore;
                    currentUser.gamesPlayed = newGamesPlayed;
                    updateUserStats();
                }
            }
        }
        
        // Show results
        showScreen('result');
        domElements.result.resultRoomCode.textContent = roomState.code;
        
        const winner = playersArray[0] || {};
        domElements.result.winnerName.textContent = winner.name || '-';
        
        // Display final results
        domElements.result.finalResults.innerHTML = '<h3 style="margin-bottom: 15px; color: var(--text);">Hasil Akhir:</h3>';
        
        playersArray.forEach((player, index) => {
            const isCurrentUser = player.userId === currentUser.id || 
                                 player.username === currentUser.username;
            const resultElement = document.createElement('div');
            resultElement.className = 'leaderboard-item';
            if (isCurrentUser) resultElement.classList.add('you');
            if (index < 3) resultElement.classList.add('top-3');
            
            resultElement.innerHTML = `
                <div class="rank">${index + 1}</div>
                <div class="player-info">
                    <div class="player-avatar">${player.name.charAt(0).toUpperCase()}</div>
                    <div class="player-details">
                        <div class="player-name">
                            ${player.name}
                            ${isCurrentUser ? '<span class="player-you">Anda</span>' : ''}
                            ${index === 0 ? '<i class="fas fa-crown" style="color: var(--warning); margin-left: 5px;"></i>' : ''}
                        </div>
                        <div class="player-stats">
                            <span class="role-badge role-${player.role || 'anggota'}">${player.role || 'anggota'}</span>
                        </div>
                    </div>
                </div>
                <div class="player-score">${player.score || 0}</div>
            `;
            domElements.result.finalResults.appendChild(resultElement);
        });
        
        // Clean up room
        const roomRef = window.firebaseConfig.database.ref('rooms/' + roomState.code);
        await roomRef.remove();
        
        // Leave voice chat
        leaveVoiceChat();
        
        // Reset states
        roomState = {
            code: '',
            players: {},
            gameStarted: false,
            currentQuestion: 0,
            status: 'waiting',
            answers: {}
        };
        
        gameState.gameStarted = false;
        gameState.playersAnswered.clear();
        gameState.hasAnswered = false;
        gameState.allPlayersAnswered = false;
        uiState.isVoiceChatEnabled = false;
        uiState.autoNextQuestion = false;
        
        showToast('Game selesai!');
        
    } catch (error) {
        console.error('Error ending game:', error);
        showToast('Gagal menghitung hasil');
    } finally {
        hideLoading();
    }
}

// Play again
function playAgain() {
    showScreen('lobby');
}

// ===============================
// ADMIN FUNCTIONS
// ===============================

// Show admin panel
function showAdminPanel() {
    domElements.admin.modal.classList.add('active');
    domElements.admin.loginSection.classList.remove('hidden');
    domElements.admin.dashboardSection.classList.add('hidden');
    
    // Clear form
    domElements.admin.username.value = '';
    domElements.admin.password.value = '';
    domElements.admin.loginError.style.display = 'none';
}

// Hide admin panel
function hideAdminPanel() {
    domElements.admin.modal.classList.remove('active');
}

// Admin login
async function adminLogin() {
    const username = domElements.admin.username.value.trim();
    const password = domElements.admin.password.value.trim();
    
    if (!username || !password) {
        showError(domElements.admin.loginError, 'Username dan password harus diisi!');
        return;
    }
    
    showLoading('Memproses login admin...');
    
    try {
        // Check admin credentials
        if (window.firebaseConfig.ADMIN_CREDENTIALS[username] && 
            window.firebaseConfig.ADMIN_CREDENTIALS[username] === password) {
            
            // Set admin role
            if (currentUser.id && !currentUser.isGuest) {
                // Update existing user to admin
                const userRef = window.firebaseConfig.database.ref('users/' + currentUser.id);
                await userRef.update({
                    role: username === 'developer' ? 'developer' : 'admin',
                    isAdmin: true
                });
                
                currentUser.role = username === 'developer' ? 'developer' : 'admin';
                currentUser.isAdmin = true;
            } else {
                // Create admin session
                currentUser = {
                    id: 'admin_' + Date.now(),
                    username: username,
                    role: username === 'developer' ? 'developer' : 'admin',
                    isAdmin: true,
                    isGuest: false,
                    totalScore: 0,
                    gamesPlayed: 0,
                    lastLogin: Date.now(),
                    createdAt: Date.now()
                };
            }
            
            saveUserSession();
            updateUserUI();
            
            hideAdminPanel();
            showToast(`Login berhasil sebagai ${currentUser.role}!`);
            
            // Load admin dashboard if needed
            loadAdminDashboard();
            
        } else {
            showError(domElements.admin.loginError, 'Kredensial admin salah!');
        }
        
    } catch (error) {
        console.error('Admin login error:', error);
        showError(domElements.admin.loginError, 'Terjadi kesalahan. Coba lagi!');
    } finally {
        hideLoading();
    }
}

// Load admin dashboard
async function loadAdminDashboard() {
    domElements.admin.loginSection.classList.add('hidden');
    domElements.admin.dashboardSection.classList.remove('hidden');
    
    const dashboardSection = document.getElementById('adminDashboardSection');
    dashboardSection.innerHTML = `
        <h3 style="margin-bottom: 20px; color: var(--text);">Admin Dashboard - ${currentUser.role.toUpperCase()}</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
            <div style="background: var(--surface-light); padding: 20px; border-radius: var(--border-radius-sm); text-align: center;">
                <div style="font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 8px;" id="adminTotalUsers">0</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Total Users</div>
            </div>
            <div style="background: var(--surface-light); padding: 20px; border-radius: var(--border-radius-sm); text-align: center;">
                <div style="font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 8px;" id="adminTotalQuestions">0</div>
                <div style="font-size: 12px; color: var(--text-secondary);">Total Questions</div>
            </div>
        </div>
        
        <div style="margin-bottom: 25px;">
            <h4 style="color: var(--text); margin-bottom: 15px;">Quick Actions</h4>
            <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                <button class="btn-primary" onclick="showScreen('categoryManagement'); hideAdminPanel();">
                    <i class="fas fa-layer-group"></i> Kelola Kategori (Admin Only)
                </button>
                <button class="btn-primary" onclick="showScreen('questionManagement'); hideAdminPanel();">
                    <i class="fas fa-question-circle"></i> Kelola Soal (Admin Only)
                </button>
                <button class="btn-primary" onclick="addSampleQuestions()">
                    <i class="fas fa-plus-circle"></i> Tambah Soal Contoh
                </button>
                ${currentUser.role === 'developer' ? 
                    `<button class="btn-primary" onclick="resetAllData()">
                        <i class="fas fa-redo"></i> Reset Data Demo
                    </button>` : ''
                }
            </div>
        </div>
        
        <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid var(--border);">
            <button class="btn-secondary" onclick="logoutAdmin()" style="width: 100%;">
                <i class="fas fa-sign-out-alt"></i> Logout Admin
            </button>
        </div>
    `;
    
    await loadAdminStats();
}

// Logout admin (back to user account)
function logoutAdmin() {
    if (currentUser.isGuest) {
        logout();
    } else {
        // Revert to regular user role
        currentUser.role = 'anggota';
        currentUser.isAdmin = false;
        saveUserSession();
        updateUserUI();
        hideAdminPanel();
        showToast('Kembali ke akun regular');
    }
}

// Load admin stats
async function loadAdminStats() {
    try {
        const usersRef = window.firebaseConfig.database.ref('users');
        const usersSnapshot = await usersRef.once('value');
        const totalUsers = usersSnapshot.exists() ? Object.keys(usersSnapshot.val()).length : 0;
        document.getElementById('adminTotalUsers').textContent = totalUsers;
        
        const questionsRef = window.firebaseConfig.database.ref('questions');
        const questionsSnapshot = await questionsRef.once('value');
        const defaultQuestions = questionsSnapshot.exists() ? Object.keys(questionsSnapshot.val()).length : 0;
        
        // Add user questions count
        const userQuestionsCount = Object.values(window.questionManager.userQuestions || {}).reduce(
            (total, questions) => total + questions.length, 0
        );
        
        document.getElementById('adminTotalQuestions').textContent = defaultQuestions + userQuestionsCount;
        
    } catch (error) {
        console.error('Error loading admin stats:', error);
    }
}

// Add sample questions
async function addSampleQuestions() {
    if (currentUser.role !== 'admin' && currentUser.role !== 'developer') {
        showToast('Hanya admin yang dapat menambah soal!');
        return;
    }
    
    showLoading('Menambahkan soal contoh...');
    
    try {
        // Add sample questions from database
        for (const category in QUESTION_DATABASE) {
            const questions = QUESTION_DATABASE[category];
            for (const question of questions) {
                // Check if question already exists
                const exists = window.questionManager.userQuestions[category]?.some(
                    q => q.text === question.text
                );
                
                if (!exists) {
                    window.questionManager.addQuestion(category, {
                        ...question,
                        addedBy: 'System',
                        addedAt: Date.now()
                    });
                }
            }
        }
        
        // Save to Firebase
        await window.questionManager.saveUserQuestions();
        
        // Update category question counts
        for (const category of gameState.categories) {
            const count = window.questionManager.getQuestionCount(category.id);
            await window.firebaseConfig.database.ref('categories/' + category.id + '/questionCount').set(count);
        }
        
        showToast('Soal contoh berhasil ditambahkan!');
        await loadCategories(); // Reload categories with updated counts
        updateQuestionsList();
        
    } catch (error) {
        console.error('Error adding sample questions:', error);
        showToast('Gagal menambahkan soal contoh');
    } finally {
        hideLoading();
    }
}

// Reset all data (developer only)
async function resetAllData() {
    if (currentUser.role !== 'developer') {
        showToast('Hanya developer yang dapat mereset data!');
        return;
    }
    
    if (!confirm('PERINGATAN: Ini akan menghapus semua data demo. Lanjutkan?')) return;
    
    showLoading('Meriset data demo...');
    
    try {
        // Clear rooms
        await window.firebaseConfig.database.ref('rooms').remove();
        
        // Clear user questions
        window.questionManager.userQuestions = {};
        await window.questionManager.saveUserQuestions();
        
        // Reset category question counts
        const categoriesRef = window.firebaseConfig.database.ref('categories');
        const snapshot = await categoriesRef.once('value');
        
        if (snapshot.exists()) {
            const categories = snapshot.val();
            const updates = {};
            
            Object.keys(categories).forEach(categoryId => {
                updates[`${categoryId}/questionCount`] = 0;
            });
            
            await categoriesRef.update(updates);
        }
        
        showToast('Data demo berhasil direset!');
        await loadCategories();
        
    } catch (error) {
        console.error('Error resetting data:', error);
        showToast('Gagal meriset data');
    } finally {
        hideLoading();
    }
}

// ===============================
// UTILITY FUNCTIONS
// ===============================

// Show screen
function showScreen(screenName) {
    Object.values(domElements.screens).forEach(screen => {
        if (screen) screen.classList.remove('active');
    });
    
    if (domElements.screens[screenName]) {
        domElements.screens[screenName].classList.add('active');
        gameState.currentScreen = screenName;
        
        // Special handling for screens
        switch(screenName) {
            case 'dashboard':
                updateGlobalStats();
                break;
            case 'leaderboard':
                filterLeaderboard('all');
                break;
            case 'lobby':
                // Reset room forms
                document.querySelectorAll('.room-action').forEach(action => {
                    action.classList.remove('selected');
                });
                domElements.lobby.roomCreateSection.classList.add('hidden');
                domElements.lobby.roomJoinSection.classList.add('hidden');
                uiState.activeRoomType = null;
                
                // Auto-fill player name
                if (domElements.lobby.playerName && !domElements.lobby.playerName.value) {
                    domElements.lobby.playerName.value = currentUser.username;
                }
                break;
            case 'categoryManagement':
                updateCategoryList();
                break;
            case 'questionManagement':
                updateQuestionCategorySelect();
                updateQuestionsList();
                break;
        }
    }
}

// Show error
function showError(element, message) {
    if (!element) return;
    element.querySelector('span').textContent = message;
    element.style.display = 'flex';
}

// Show toast
function showToast(message) {
    if (!domElements.utility.toast || !domElements.utility.toastMessage) return;
    
    domElements.utility.toastMessage.textContent = message;
    domElements.utility.toast.classList.remove('hidden');
    
    setTimeout(() => {
        domElements.utility.toast.classList.add('hidden');
    }, 3000);
}

// Show loading
function showLoading(text) {
    if (domElements.utility.loadingOverlay) {
        domElements.utility.loadingOverlay.classList.add('active');
    }
    if (domElements.utility.loadingText && text) {
        domElements.utility.loadingText.textContent = text;
    }
}

// Hide loading
function hideLoading() {
    if (domElements.utility.loadingOverlay) {
        domElements.utility.loadingOverlay.classList.remove('active');
    }
}

// Toggle sound
function toggleSound() {
    if (!domElements.lobby.soundToggleBtn) return;
    
    uiState.isSoundEnabled = !uiState.isSoundEnabled;
    
    if (uiState.isSoundEnabled) {
        domElements.lobby.soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        showToast('Sound diaktifkan');
    } else {
        domElements.lobby.soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        showToast('Sound dimatikan');
    }
}

// ===============================
// DASHBOARD IMPROVEMENTS
// ===============================

// Update dashboard sections based on role
function updateDashboardSections() {
    // Hide category management for non-admin users
    const categorySection = document.querySelector('.dashboard-section:nth-child(3)');
    if (categorySection) {
        if (currentUser.role !== 'admin' && currentUser.role !== 'developer') {
            categorySection.style.display = 'none';
        } else {
            categorySection.style.display = 'flex';
        }
    }
    
    // Hide admin panel for non-admin users
    const adminSection = document.querySelector('.dashboard-section:nth-child(4)');
    if (adminSection) {
        if (currentUser.role !== 'admin' && currentUser.role !== 'developer') {
            adminSection.style.display = 'none';
        } else {
            adminSection.style.display = 'flex';
        }
    }
}

// ===============================
// INITIALIZATION
// ===============================

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initGame().then(() => {
        updateDashboardSections();
    });
});