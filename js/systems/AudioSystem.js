// Just Handles AudioSystem Class Creation 
export class AudioSystem {
    // Private fields
    #sounds = new Map();
    #music = new Map();
    #currentMusic = null;
    #musicVolume = 0.5;
    #sfxVolume = 0.7;
    #isMuted = false;

    constructor() {}

    // Load audio files
    async loadSound(name, url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = url;
            audio.preload = 'auto';

            audio.addEventListener('canplaythrough', () => {
                this.#sounds.set(name, audio);
                resolve(audio);
            });

            audio.addEventListener('error', (e) => {
                console.error(`Failed to load sound: ${name}`, e);
                reject(e);
            });

            audio.load();
        });
    }

    async loadMusic(name, url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = url;
            audio.preload = 'auto';
            audio.loop = true;

            audio.addEventListener('canplaythrough', () => {
                this.#music.set(name, audio);
                resolve(audio);
            });

            audio.addEventListener('error', (e) => {
                console.error(`Failed to load music: ${name}`, e);
                reject(e);
            });

            audio.load();
        });
    }

    // Play background music
    playMusic(name) {
        if (this.#isMuted) return;

        // Stop current music
        if (this.#currentMusic) {
            this.#currentMusic.pause();
            this.#currentMusic.currentTime = 0;
        }

        const music = this.#music.get(name);
        if (music) {
            music.volume = this.#musicVolume;
            music.play().catch(e => console.log('Audio play failed:', e));
            this.#currentMusic = music;
        }
    }

    // Play sound effects
    playSound(name) {
        if (this.#isMuted) return;

        const sound = this.#sounds.get(name);
        sound.volume = this.#sfxVolume;

        sound.play().catch(e => console.log('Sound play failed:', e));

        sound.addEventListener('ended', () => {
            sound.remove();
            });
    }

    stopMusic() {
        if (this.#currentMusic) {
            this.#currentMusic.pause();
            this.#currentMusic.currentTime = 0;
            this.#currentMusic = null;
        }
    }

    // Volume controls
    setMusicVolume(volume) {
        this.#musicVolume = Math.max(0, Math.min(1, volume));
        if (this.#currentMusic) {
            this.#currentMusic.volume = this.#musicVolume;
        }
    }

    setSFXVolume(volume) {
        this.#sfxVolume = Math.max(0, Math.min(1, volume));
    }

    // Mute/unmute
    toggleMute() {
        this.#isMuted = !this.#isMuted;

        if (this.#currentMusic) {
            this.#currentMusic.volume = this.#isMuted ? 0 : this.#musicVolume;
        }

        return this.#isMuted;
    }

    // Cleanup
    destroy() {
        this.stopMusic();
        this.#sounds.clear();
        this.#music.clear();
    }
}

// Start menu music helper — this stays public as usual
export function startMenuMusic(app, menuMusicStarted) {
    const playMusic = () => {
        if (!menuMusicStarted) {
            app.audio.playMusic('mainMenu');
            menuMusicStarted = true;
        }
    };

    playMusic();

    const startMusicOnInteraction = () => {
        if (!menuMusicStarted) {
            playMusic();
            document.removeEventListener('click', startMusicOnInteraction);
            document.removeEventListener('keydown', startMusicOnInteraction);
        }
    };

    document.addEventListener('click', startMusicOnInteraction, { once: true });
    document.addEventListener('keydown', startMusicOnInteraction, { once: true });

    return menuMusicStarted;
}
