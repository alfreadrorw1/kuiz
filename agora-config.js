// Agora Voice Chat Configuration
const AGORA_CONFIG = {
    appId: "2f8c4e30d3f64547afd0ab5b32b6b023",
    token: null, // In production, use token from your server
    channelPrefix: "tebakmulti_voice_",
    codec: 'vp8',
    mode: 'rtc'
};

// Voice Chat Manager
class VoiceChatManager {
    constructor() {
        this.client = null;
        this.localAudioTrack = null;
        this.remoteUsers = {};
        this.isJoined = false;
        this.isMicEnabled = false;
        this.volumeInterval = null;
    }

    // Initialize Agora client
    async initialize() {
        try {
            this.client = AgoraRTC.createClient({ 
                mode: AGORA_CONFIG.mode, 
                codec: AGORA_CONFIG.codec 
            });
            
            // Handle remote user events
            this.client.on('user-published', async (user, mediaType) => {
                await this.client.subscribe(user, mediaType);
                if (mediaType === 'audio') {
                    user.audioTrack.play();
                    this.remoteUsers[user.uid] = user;
                    this.updateVoicePlayers();
                }
            });

            this.client.on('user-unpublished', (user, mediaType) => {
                if (mediaType === 'audio') {
                    delete this.remoteUsers[user.uid];
                    this.updateVoicePlayers();
                }
            });

            this.client.on('user-joined', (user) => {
                this.remoteUsers[user.uid] = user;
                this.updateVoicePlayers();
            });

            this.client.on('user-left', (user) => {
                delete this.remoteUsers[user.uid];
                this.updateVoicePlayers();
            });

            console.log('Agora client initialized');
        } catch (error) {
            console.error('Failed to initialize Agora client:', error);
        }
    }

    // Join voice channel
    async joinChannel(channelName, uid) {
        try {
            if (!this.client) await this.initialize();
            
            // Generate token (in production, get from server)
            const token = AGORA_CONFIG.token || null;
            
            await this.client.join(
                AGORA_CONFIG.appId,
                channelName,
                token,
                uid || null
            );

            // Create and publish local audio track
            this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            await this.client.publish([this.localAudioTrack]);
            
            this.isJoined = true;
            this.isMicEnabled = true;
            
            // Start volume monitoring
            this.startVolumeMonitoring();
            
            console.log(`Joined voice channel: ${channelName}`);
            return true;
        } catch (error) {
            console.error('Failed to join voice channel:', error);
            return false;
        }
    }

    // Leave voice channel
    async leaveChannel() {
        try {
            if (this.localAudioTrack) {
                this.localAudioTrack.close();
                this.localAudioTrack = null;
            }
            
            if (this.client && this.isJoined) {
                await this.client.leave();
                this.isJoined = false;
                this.isMicEnabled = false;
            }
            
            // Stop volume monitoring
            this.stopVolumeMonitoring();
            
            // Clear remote users
            this.remoteUsers = {};
            this.updateVoicePlayers();
            
            console.log('Left voice channel');
        } catch (error) {
            console.error('Failed to leave voice channel:', error);
        }
    }

    // Toggle microphone
    async toggleMicrophone() {
        if (this.localAudioTrack) {
            if (this.isMicEnabled) {
                await this.localAudioTrack.setEnabled(false);
                this.isMicEnabled = false;
            } else {
                await this.localAudioTrack.setEnabled(true);
                this.isMicEnabled = true;
            }
            this.updateVoicePlayers();
            return this.isMicEnabled;
        }
        return false;
    }

    // Start volume monitoring
    startVolumeMonitoring() {
        this.volumeInterval = setInterval(() => {
            this.updateVoicePlayers();
        }, 500);
    }

    // Stop volume monitoring
    stopVolumeMonitoring() {
        if (this.volumeInterval) {
            clearInterval(this.volumeInterval);
            this.volumeInterval = null;
        }
    }

    // Update voice players UI
    updateVoicePlayers() {
        const voicePlayersContainer = document.getElementById('voicePlayers');
        if (!voicePlayersContainer) return;

        // Clear container
        voicePlayersContainer.innerHTML = '';

        // Add local player
        const localPlayer = document.createElement('div');
        localPlayer.className = 'voice-player';
        localPlayer.innerHTML = `
            <div class="voice-player-avatar">${getUserInitial()}</div>
            <div class="voice-player-name">${getUserName()}</div>
            <div class="voice-player-status ${this.isMicEnabled ? 'talking' : 'muted'}">
                ${this.isMicEnabled ? '🎤 Aktif' : '🔇 Muted'}
            </div>
        `;
        voicePlayersContainer.appendChild(localPlayer);

        // Add remote players
        Object.values(this.remoteUsers).forEach(user => {
            const isTalking = this.isUserTalking(user);
            const remotePlayer = document.createElement('div');
            remotePlayer.className = `voice-player ${isTalking ? 'talking' : ''}`;
            remotePlayer.innerHTML = `
                <div class="voice-player-avatar">${getUserInitial(user.uid)}</div>
                <div class="voice-player-name">User ${user.uid}</div>
                <div class="voice-player-status ${isTalking ? 'talking' : ''}">
                    ${isTalking ? '🎤 Berbicara' : '🔇 Diam'}
                </div>
            `;
            voicePlayersContainer.appendChild(remotePlayer);
        });
    }

    // Check if user is talking (simplified)
    isUserTalking(user) {
        // In a real app, you would check audio levels
        // This is a simplified version
        return Math.random() > 0.7;
    }
}

// Helper functions
function getUserInitial(uid = null) {
    if (uid && window.currentUser && uid.includes(window.currentUser.id)) {
        return window.currentUser.username.charAt(0).toUpperCase();
    }
    return 'U';
}

function getUserName(uid = null) {
    if (uid && window.currentUser && uid.includes(window.currentUser.id)) {
        return window.currentUser.username;
    }
    return 'User';
}

// Create global voice chat manager instance
window.voiceChatManager = new VoiceChatManager();