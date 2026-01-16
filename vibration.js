// Vibration Manager for Mobile Haptic Feedback
class VibrationManager {
    constructor() {
        this.enabled = this.loadSetting();
        this.supported = this.checkSupport();
        
        if (this.supported) {
            console.log('Vibration API supported');
        } else {
            console.log('Vibration API not supported');
        }
    }

    checkSupport() {
        // Check if vibration API is available
        return !!(navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate);
    }

    vibrate(pattern) {
        if (!this.enabled || !this.supported) return;
        
        try {
            // Try standard API first
            if (navigator.vibrate) {
                navigator.vibrate(pattern);
                return;
            }
            // Fallback for older browsers
            if (navigator.webkitVibrate) {
                navigator.webkitVibrate(pattern);
                return;
            }
            if (navigator.mozVibrate) {
                navigator.mozVibrate(pattern);
                return;
            }
        } catch (e) {
            console.warn('Vibration failed:', e);
        }
    }

    // Enemy destroyed - short pulse
    enemyDestroyed() {
        this.vibrate(50);
    }

    // Player hit - double vibration
    playerHit() {
        this.vibrate([100, 50, 100]);
    }

    // Power-up collected - light tap
    powerUpCollected() {
        this.vibrate(30);
    }

    // Boss defeated - strong pattern
    bossDefeated() {
        this.vibrate([200, 100, 200, 100, 200]);
    }

    // Enable/disable vibration
    setEnabled(enabled) {
        this.enabled = enabled;
        this.saveSetting();
    }

    isEnabled() {
        return this.enabled && this.supported;
    }

    // Load setting from localStorage
    loadSetting() {
        const saved = localStorage.getItem('baseInvadersVibration');
        if (saved !== null) {
            return saved === 'true';
        }
        // Default: enabled if supported
        return true;
    }

    // Save setting to localStorage
    saveSetting() {
        localStorage.setItem('baseInvadersVibration', this.enabled.toString());
    }
}

// Create global vibration manager
window.vibrationManager = new VibrationManager();
