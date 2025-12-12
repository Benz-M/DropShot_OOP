import { Text } from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';

export class TimerSystem {
    constructor(app) {
        this.app = app;
        this.timeRemaining = 120; // 2 minutes in seconds (2:00)
        this.isRunning = false;
        this.hasEnded = false;
        
        // PixiJS Text for the timer display
        this.timerText = new Text('2:00', {
            fontFamily: 'ArcadeFont',
            fontSize: 35,
            fill: 0xffffff, 
            align: 'center',
            stroke: 0x000000, 
            strokeThickness: 2
        });
        
        // Position the timer at the top center of the screen
        this.timerText.x = this.app.screen.width / 2;
        this.timerText.y = 60;
        this.timerText.anchor.set(0.5, 0.5);
        
        this.app.stage.addChild(this.timerText);
    }
    
    //Start the timer countdown
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.hasEnded = false;
        
        // Add the ticker to update the timer every frame
        this.app.ticker.add(this.update, this);
    }
    
    // Stop the timer
    stop() {
        this.isRunning = false;
        this.app.ticker.remove(this.update, this);
    }
    
    // reset the timer to initial value
    reset() {
        this.timeRemaining = 120;
        this.hasEnded = false;
        this.updateDisplay();
    }
    

    // Just Update the timer - called every frame
    update() {
        if (!this.isRunning) return;
        
        // Decrease time by delta time 
        this.timeRemaining -= this.app.ticker.deltaTime * 0.016;
        
        // Ensure time doesn't go below 0
        if (this.timeRemaining < 0) {
            this.timeRemaining = 0;
        }
        
        // Update the display
        this.updateDisplay();
        
        // Check if timer has reached 0:00
        if (this.timeRemaining <= 0 && !this.hasEnded) {
            this.hasEnded = true;
            console.log('ended');
            this.stop();
        }
    }
    
    // Update the timer text display in MM:SS format
    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = Math.floor(this.timeRemaining % 60);
        
        // Format as MM:SS with leading zeros
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.timerText.text = timeString;
    }
    
    //Get the remaining time in seconds
    getTimeRemaining() {
        return this.timeRemaining;
    }
    
    // Check if timer has ended
    isTimerEnded() {
        return this.hasEnded;
    }
    
    // Destroy the timer and remove it from the stage
    destroy() {
        this.stop();
        this.app.stage.removeChild(this.timerText);
        this.timerText.destroy();
    }
}

/**
 * Initialize and start the timer
 * @param {Application} app - The PixiJS application
 * @returns {TimerSystem} - The timer system instance
 */
export function initializeTimer(app) {
    const timer = new TimerSystem(app);
    timer.start();
    return timer;
}
