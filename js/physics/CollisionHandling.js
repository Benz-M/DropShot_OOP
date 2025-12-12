class Collision { // Base Collision Class
    constructor(app, player1, player2,net) {
        this.app = app;
        this.player1 = player1;
        this.player2 = player2;
        this.net = net
    }

    // Placeholder for collision logic [Polymorphism]
    CollisionLogic() {}
}

export class WallCollision extends Collision { // Wall Collision Class
    constructor(app, player1, player2,net) {
        super(app, player1, player2,net);
    }

    CollisionLogic() { // Screen Boundary Collision Logic
        
        // Check if player loc is over the screen wallsa
        if (typeof this.player1.getX === 'function') {
            if (this.player1.getX() < 0) {
                this.player1.setPosition(3, this.player1.getY());
            }
        } else {
            if (this.player1.x < 0) this.player1.x = 3;
        }

        if (typeof this.player2.getX === 'function') {
            if (this.player2.getX() > this.app.screen.width - 4) {
                this.player2.setPosition(this.app.screen.width - 4, this.player2.getY());
            }
        } else {
            if (this.player2.x > this.app.screen.width - 4) this.player2.x = this.app.screen.width - 4;
        }
    }
}

export class NetCollision extends Collision { // Net Collision Class
    constructor(app, player1, player2,net) {
        super(app, player1, player2,net);
    }

    CollisionLogic() { // Net Collision Logic
        // Prevent players from crossing the net
        if (typeof this.player1.getX === 'function') {
            if (this.player1.getX() > this.net.x + 30) {
                this.player1.setPosition(this.net.x + 25, this.player1.getY());
            }
        } else {
            if (this.player1.x > this.net.x + 30) this.player1.x = this.net.x + 25;
        }

        if (typeof this.player2.getX === 'function') {
            if (this.player2.getX() < this.net.x + 70) {
                this.player2.setPosition(this.net.x + 70, this.player2.getY());
            }
        } else {
            if (this.player2.x < this.net.x + 70) this.player2.x = this.net.x + 70;
        }
    }
}

export class ShuttleCollision extends Collision { // Shuttlecock Collision Class
    constructor(app, player1, player2,net) {
        super(app, player1, player2,net);
    }

    CollisionLogic(shuttlecock,Net) { // Shuttlecock Collision Logic
        const pos = shuttlecock.getPosition();
        const vel = shuttlecock.getVelocity();
        const w = shuttlecock.getWidth();
        const h = shuttlecock.getHeight();

        // Screen bounds collisions
        if (pos.x > this.app.screen.width) {
            shuttlecock.setPosition(this.app.screen.width - 5, pos.y);
            shuttlecock.setVelocity(-vel.x, vel.y);
        }
        if (pos.x < 0) {
            shuttlecock.setPosition(5, pos.y);
            shuttlecock.setVelocity(-vel.x, vel.y);
        }
        if (pos.y < 0) {
            shuttlecock.setPosition(pos.x, 5);
            shuttlecock.setVelocity(vel.x, -vel.y);
        }
        if (pos.y > this.app.screen.height) {
            shuttlecock.setPosition(pos.x, this.app.screen.height - 5);
            shuttlecock.setVelocity(vel.x, -vel.y);
        }

        const netLeft = Net.x - Net.width / 2;
        const netRight = Net.x + Net.width / 2;
        const netTop = Net.y;
        const netBottom = Net.y + Net.height;

        // Net collision
        if (
            pos.x + w / 2 > netLeft &&
            pos.x - w / 2 < netRight &&
            pos.y + h / 2 > netTop &&
            pos.y - h / 2 < netBottom
        ) {
            if (pos.x < Net.x) {
                shuttlecock.setPosition(netLeft - w / 2, pos.y);
            } else {
                shuttlecock.setPosition(netRight + w / 2, pos.y);
            }
        }

        // FLOOR / LANDING (Handles Scoring)
        if (pos.y >= this.app.screen.height - 20) {
            console.log("Shuttlecock hit the floor!");
            if (pos.x < Net.x) {
                scoreData.player2Score++;
            } else {
                scoreData.player1Score++;
            }
            updateScoreUI();
            resetShuttlecock();
        }
    }
}