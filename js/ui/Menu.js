// Start menu + customization UI
import {Texture,Sprite,Assets, Rectangle, Container,AnimatedSprite} from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
import { startGame } from '/js/config.js';


export async function MenuLoader2(app) { // Try kolang ilagay kasi baka maganda pag mas lighter background, tangallin nlng if di nyo bet
    // Preload 
    const textures = await Promise.all([
        Texture.from('assets/images/title/BackgroundGif/1.png'),
        Texture.from('assets/images/title/BackgroundGif/2.png'),
        Texture.from('assets/images/title/BackgroundGif/3.png'),
        Texture.from('assets/images/title/BackgroundGif/4.png'),
        Texture.from('assets/images/title/BackgroundGif/5.png'),
        Texture.from('assets/images/title/BackgroundGif/6.png'),
        Texture.from('assets/images/title/BackgroundGif/7.png'),
        Texture.from('assets/images/title/BackgroundGif/8.png')
    ]);

    const anim = new AnimatedSprite(textures);

    anim.animationSpeed = 0.15;  // Speed
    anim.loop = true; // Loop
    anim.play(); // Start Animation

    anim.width = app.screen.width;
    anim.height = app.screen.height;

    anim.zIndex = 10;  // Layer lng

    app.stage.addChild(anim);

    // Title 
    const MenuTitle_Texture = await Texture.from('assets/images/title/Title_Card.png');
    const MenuTitle = new Sprite(MenuTitle_Texture);

    app.stage.addChild(MenuTitle)

    MenuTitle.width = 450;
    MenuTitle.height = 200;

    MenuTitle.x = 30;
    MenuTitle.y = 5;
    MenuTitleAnim(app,MenuTitle)
}


export async function MenuLoader(app) { // Main Menu Naten

    const MenuBackground_Texture = await Texture.from('assets/images/Background/Alt_Background.png')
    const MenuBg = new Sprite(MenuBackground_Texture);
    
    const MenuTitle_Texture = await Texture.from('assets/images/title/Title_Card.png');
    const MenuTitle = new Sprite(MenuTitle_Texture);

    app.stage.addChild(MenuBg);
    app.stage.addChild(MenuTitle)

    MenuTitle.width = 450;
    MenuTitle.height = 200;

    MenuTitle.x = 30;
    MenuTitle.y = 5;
    MenuTitleAnim(app,MenuTitle)
    MenuBg.width = app.screen.width;
    MenuBg.height = app.screen.height;

    await MenuUILoader(app)
}

async function MenuTitleAnim(app,MenuTitle) { // Adds Animation for the title
    let speed = 0.3;       // pixels per frame
    let direction = 1;     
    let minY = 5;
    let maxY = 15;

    app.ticker.add(() => {
        // Move title
        MenuTitle.y += speed * direction;

        if (MenuTitle.y >= maxY || MenuTitle.y <= minY) {
            direction *= -1;
        }
    });
}



export async function MenuUILoader(app, onStartClick) { // UI ng Menu Itself
    const MenuTile_Size = 170;
    const MenuContainer = new Container();

    Assets.load("assets/images/title/menu/Menu_Tilesheet.png").then((baseTexture) => { // Maps the asset from the PNGSHEETS
    const MenuTexture = new Texture(
        baseTexture,
        new Rectangle(16,435,MenuTile_Size,MenuTile_Size,));

        // Container
        MenuContainer.width = MenuTile_Size + 100;
        MenuContainer.height = MenuTile_Size;

        MenuContainer.x = app.screen.width / 2 - 100;
        MenuContainer.y = app.screen.height / 2 - 30 ;
        
        // Menu
        const Menu = new Sprite(MenuTexture);

        Menu.width = MenuContainer.width + 250;
        Menu.height = Menu.width;

        Menu.x =  0;
        Menu.y = 0;
        
        //MenuText
        const MenuUI_TileSize = 64;
        const MenuUI_Texture = new Texture(
        baseTexture,
        new Rectangle(160,0,MenuUI_TileSize + 50, MenuUI_TileSize - 16 ));

        // Start Button
        const StartButton = new Sprite(MenuUI_Texture);

        StartButton.width = Menu.width / 2 + 25;
        StartButton.height = 51;

        StartButton.x = 35;
        StartButton.y = 35;

        // Container of the Menu Buttons
        app.stage.addChild(MenuContainer);
        MenuContainer.addChild(Menu)
        MenuContainer.addChild(StartButton);

        // Setting Button
        const SettingUI_Texture = new Texture(
        baseTexture,
        new Rectangle(160,50,MenuUI_TileSize + 50, MenuUI_TileSize - 16 ));

        const SettingButton = new Sprite(SettingUI_Texture);

        SettingButton.width = StartButton.width;
        SettingButton.height = StartButton.height;

        SettingButton.x = 35;
        SettingButton.y = 90;

        MenuContainer.addChild(SettingButton)

        // Exit Button
        const ExitUI_Texture = new Texture(
        baseTexture,
        new Rectangle(160,100,MenuUI_TileSize + 50, MenuUI_TileSize - 16 ));

        const ExitButton = new Sprite(ExitUI_Texture);

        ExitButton.width = StartButton.width;
        ExitButton.height = StartButton.height;

        ExitButton.x = 35;
        ExitButton.y = 150;

        MenuContainer.addChild(ExitButton)
        MenuContainer.addChild(SettingButton)

        // Hover Effects & aND Fucntion click
        const StartButton_originalScaleY = StartButton.scale.y;
        const StartButton_originalScaleX = StartButton.scale.x;

        const SettingButton_originalScaleY = SettingButton.scale.y;
        const SettingButton_originalScaleX = SettingButton.scale.x;

        const ExitButton_originalScaleY = ExitButton.scale.y;
        const ExitButton_originalScaleX = ExitButton.scale.x;

        // Sets button if clickable
        StartButton.eventMode = 'static';
        StartButton.buttonMode = true;
        SettingButton.eventMode = 'static';
        SettingButton.buttonMode = true;

        ExitButton.eventMode = 'static';
        ExitButton.buttonMode = true;

        // Start Button
        StartButton.pivot.set(StartButton.width / 2 - 17, StartButton.height / 2);
        StartButton.x += StartButton.width / 2;
        StartButton.y += StartButton.height / 2;

        // Setting Button
        SettingButton.pivot.set(SettingButton.width / 2 - 17, SettingButton.height / 2);
        SettingButton.x += SettingButton.width / 2;
        SettingButton.y += SettingButton.height / 2;

        // Exit Button
        ExitButton.pivot.set(ExitButton.width / 2 - 17, ExitButton.height / 2);
        ExitButton.x += ExitButton.width / 2;
        ExitButton.y += ExitButton.height / 2;

        // Function of Buttons
        StartButton.on('pointerover', () => { // <- When Hovering
            StartButton.scale.set(StartButton_originalScaleX * 1.1, StartButton_originalScaleY * 1.1); // 10% bigger
        });

        StartButton.on('pointerout', () => { // <- When Not Hovering
            StartButton.scale.set(StartButton_originalScaleX, StartButton_originalScaleY); // reset size
        });

        StartButton.on('pointerdown', () => { // <- When Clicked
            startGame(app)
        });


        SettingButton.on('pointerover', () => {
            SettingButton.scale.set(SettingButton_originalScaleX * 1.1, SettingButton_originalScaleY * 1.1); // 10% bigger
        });

        SettingButton.on('pointerout', () => {
            SettingButton.scale.set(SettingButton_originalScaleX, SettingButton_originalScaleY); // reset size
        });

        SettingButton.on('pointerdown', () => {
            ControlManual(app)
        });

        ExitButton.on('pointerover', () => {
            ExitButton.scale.set(ExitButton_originalScaleX * 1.1, ExitButton_originalScaleY * 1.1); // 10% bigger
        });

        ExitButton.on('pointerout', () => {
            ExitButton.scale.set(ExitButton_originalScaleX, ExitButton_originalScaleY); // reset size
        });

        ExitButton.on('pointerdown', () => {
            console.log("Start Button Clicked!");
        });
    });
}

function ControlManual(app) { // Logic for Setting Button

// Manual Picture
    const ManualTexture = Texture.from('/assets/images/title/menu/ControlManual.png');
    const Manual = new Sprite(ManualTexture)

    Manual.width = app.screen.width;
    Manual.height = app.screen.height;

    Manual.anchor.set(0);
    Manual.x = -1;
    ManualTexture.y = 0;

    app.stage.addChild(Manual)

// Go Back Button
    const BackButton_Texture = Texture.from("assets/images/title/menu/BackButton.png");
    const BackButton = new Sprite(BackButton_Texture);

    BackButton.width = 100;
    BackButton.height = 40;

    BackButton.x = Manual.width - 130;
    BackButton.y = Manual.height / 2 + 200;

    app.stage.addChild(BackButton);

// Go Back Function
    BackButton.eventMode = 'static';
    BackButton.buttonMode = true;

    BackButton.pivot.set(BackButton.width / 2 - 17, BackButton.height / 2);
    const BackButton_originalScaleY = BackButton.scale.y;
    const BackButton_originalScaleX = BackButton.scale.x;

    BackButton.on('pointerover', () => {
            BackButton.scale.set(BackButton_originalScaleX * 1.1, BackButton_originalScaleY * 1.1); // 10% bigger
        });

        BackButton.on('pointerout', () => {
            BackButton.scale.set(BackButton_originalScaleX, BackButton_originalScaleY); // reset size
        });

        BackButton.on('pointerdown', () => {
            app.stage.removeChild(Manual)
            app.stage.removeChild(BackButton)
        });
}