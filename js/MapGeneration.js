import {Texture,Sprite,TilingSprite} from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';

export class BaseMap {
    constructor() {
        this.StartBlock = null;
        this.NetLocation = null;   // initialize it as null
    }

    async Background_INI(app) {
        const Bg_Texture = Texture.from('assets/images/Background/Background3.jpg');
        const Background = new Sprite(Bg_Texture);
        
        Background.width = app.screen.width;
        Background.height = app.screen.height - 50;
        app.stage.addChild(Background);
    }

    async Floor_INI(app) {
        const MiddleBlock_Texture = Texture.from('assets/images/floor/Middle_Tile.png');

        // Start and End sprites
        const StartBlock = new Sprite();
        const EndBlock = new Sprite();

        StartBlock.width = 0;
        StartBlock.height = 50;

        EndBlock.width = 0;
        EndBlock.height = 50;

        StartBlock.x = 0;
        StartBlock.y = app.screen.height - StartBlock.height;

        EndBlock.x = app.screen.width - EndBlock.width;
        EndBlock.y = app.screen.height - EndBlock.height;

        // Middle floor
        const middleWidth = app.screen.width - StartBlock.width - EndBlock.width;
        const MiddleBlock = new TilingSprite(MiddleBlock_Texture, middleWidth, 50);

        MiddleBlock.x = StartBlock.width;
        MiddleBlock.y = app.screen.height - 50;
        MiddleBlock.tileScale.y = 1;

        app.stage.addChild(StartBlock);
        app.stage.addChild(MiddleBlock);
        app.stage.addChild(EndBlock);

        this.StartBlock = StartBlock; // store into the class
        return StartBlock;
    }

    async Net_INI(app) {
        const NetTexture = Texture.from('assets/images/match/Net.png');
        const Net = new Sprite(NetTexture);

        Net.width = 100;
        Net.height = 100;

        Net.x = app.screen.width / 2 - 45;
        Net.y = 350;

        app.stage.addChild(Net);
        this.NetLocation = Net
        return Net;
    }
}
