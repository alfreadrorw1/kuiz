// Agora Voice Chat Configuration
const AGORA_CONFIG = {
    appId: "2f8c4e30d3f64547afd0ab5b32b6b023",
    token: null,
    channelPrefix: "tebakmulti_voice_"
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
            this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
            
            // Handle remote user events
            this.client.on("user-published", async (user, mediaType) => {
                await this.client.subscribe(user, mediaType);
                
                if (mediaType === "audio") {
                    user.audioTrack.play();
                    this.remoteUsers[user.uid] = user;
                    this.updateVoicePlayers();
                }
            });

            this.client.on("user-unpublished", (user, mediaType) => {
                if (mediaType === "audio") {
                    delete this.remoteUsers[user.uid];
                    this.updateVoicePlayers();
                }
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
            
            await this.client.join(
                AGORA_CONFIG.appId,
                channelName,
                AGORA_CONFIG.token,
                uid || null
            );

            // Create and publish local audio track
            this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            await this.client.publish([this.localAudioTrack]);
            
            this.isJoined = true;
            this.isMicEnabled = true;
            
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
            return this.isMicEnabled;
        }
        return false;
    }

    // Update voice players UI
    updateVoicePlayers() {
        const voicePlayersContainer = document.getElementById('voicePlayers');
        if (!voicePlayersContainer) return;

        voicePlayersContainer.innerHTML = '';
        
        // Add local player
        const localPlayer = document.createElement('div');
        localPlayer.className = `voice-player ${this.isMicEnabled ? 'talking' : 'muted'}`;
        localPlayer.innerHTML = `
            <div class="voice-player-avatar">${this.getUserInitial()}</div>
            <div class="voice-player-name">${this.getUserName()}</div>
            <div class="voice-player-status ${this.isMicEnabled ? 'talking' : 'muted'}">
                ${this.isMicEnabled ? '🎤 Aktif' : '🔇 Muted'}
            </div>
        `;
        voicePlayersContainer.appendChild(localPlayer);

        // Add remote players
        Object.values(this.remoteUsers).forEach(user => {
            const remotePlayer = document.createElement('div');
            remotePlayer.className = 'voice-player';
            remotePlayer.innerHTML = `
                <div class="voice-player-avatar">${this.getUserInitial(user.uid)}</div>
                <div class="voice-player-name">User ${user.uid}</div>
                <div class="voice-player-status">
                    🔊 Berbicara
                </div>
            `;
            voicePlayersContainer.appendChild(remotePlayer);
        });
    }

    // Helper functions
    getUserInitial(uid = null) {
        if (uid && window.currentUser && uid.includes(window.currentUser.id)) {
            return window.currentUser.username.charAt(0).toUpperCase();
        }
        return 'U';
    }

    getUserName(uid = null) {
        if (uid && window.currentUser && uid.includes(window.currentUser.id)) {
            return window.currentUser.username;
        }
        return 'User';
    }
}

// Create global voice chat manager instance
window.voiceChatManager = new VoiceChatManager();