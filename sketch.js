let banner, logo;
let font1;
let categorySelect;
let categories;
let beatContainerHeight, beatContainerWidth, beatContainerMargin;

let beats = [];

function preload() {
    banner = loadImage("assets/images/banner.JPG");
    logo = loadImage("assets/images/logo.png")
    font1 = loadFont('assets/font1.ttf');
}

function setup() {
    beatContainerHeight = 60;
    beatContainerMargin = 10;

	createCanvas(windowWidth, banner.height+150+catalogue.length*(beatContainerHeight+beatContainerMargin)+beatContainerMargin);
    
    beatContainerWidth = width/2;
    
    
    initCategories();
    initCategorySelector();
    createBeatSelection();
}

class beat {
    constructor(path, category, tags, i) {
        this.path = path;
        this.category = category;

        this.name = this.path.replace("assets/beats/", "");

        if(tags.length>0) { this.tags = [this.category+", "+tags]; }
        else { this.tags = [this.category]; }

        this.i = i;
    }

    show() {
        let y = 150+banner.height+(beatContainerHeight+beatContainerMargin)*this.i;
        
        strokeWeight(2); fill(255);
        rect(width*1/4, y, width/2, beatContainerHeight);

        textSize(18); fill(0); textAlign(LEFT, CENTER);
        text(this.name, width/2-beatContainerWidth/2+beatContainerMargin, y+beatContainerHeight/2);


        if (!this.player) {
            this.player = createAudio(this.path);
            beats.push(this.player);
            this.player.elt.addEventListener('play', () => {
                for (let b of beats) {
                    if (b !== this.player) {
                        try { b.stop(); } catch (e) {}
                    }
                }
            });
        }

        this.player.position(width/2-beatContainerWidth/3, y+beatContainerHeight/6);
        this.player.size(beatContainerWidth/3,beatContainerHeight*0.7);
        this.player.showControls();

        text("Tags: "+this.tags, width/2+beatContainerMargin, y+beatContainerHeight/2);
    }

    hide() {
        if (this.player) {
            try { this.player.remove(); } catch (e) {}
            let idx = beats.indexOf(this.player);
            if (idx !== -1) beats.splice(idx, 1);
            this.player = null;
        }
    }
}

function createBeatSelection() {
    drawInterface();

    clearBeatPlaybacks();

    let sel = categorySelect ? categorySelect.value() : "Newest";

    let displayIndex = 0;
    for(let track = 0; track < catalogue.length; track++) {
        let item = catalogue[track];
        let doShow = false;

        if (!sel || sel === "Newest") doShow = true;
        else {
            let sc = sel.toLowerCase();
            let ic = (item.category || "").toLowerCase();
            if (ic.indexOf(sc.replace(/beats?/g, '').trim()) !== -1) doShow = true;
        }

        if (doShow) {
            let currentBeat = new beat(item.path, item.category, item.tags || "", displayIndex);
            currentBeat.show();
            displayIndex++;
        }
    }
}

function drawInterface() {
    background(240);

    image(banner, 0, 0);

    textSize(60); textFont(font1); textAlign(CENTER, CENTER);
    text3D("Noise by Prospex", width/2, banner.height/2, 2, 1);

    textSize(20); textFont("Helvetica");
    text3D("Experimental trap beats", width/2, banner.height/2+50, 2, 1);

    fill(0); 
    text("Choose snippet category:", width/2, banner.height+60);

    textSize(14);
    text("This website is for showcasing snippets for beats i made. If you like any of them, save the WIP number and contact me on my socials or gmail.", width/2, banner.height+20)

    strokeWeight(2);
    line(width*1/4, banner.height+125, width*3/4, banner.height+125);

    drawTopMenu();
}

function drawTopMenu() {
    fill(240); strokeWeight(0);
    rect(0,0,width,100);

    image(logo,10,10,80,80);

    let anchorInstagram = createA("https://www.instagram.com/noiseprospex/","");
    anchorInstagram.class("fa fa-instagram");
    anchorInstagram.position(110,40);

    let anchorYoutube = createA("https://www.youtube.com/@NoiseProspex","");
    anchorYoutube.class("fa fa-youtube");
    anchorYoutube.position(110+51,40);

    let anchorSoundcloud = createA("https://soundcloud.com/noise-prospex","");
    anchorSoundcloud.class("fa fa-soundcloud");
    anchorSoundcloud.position(110+105,40);

    let anchorSpotify = createA("https://open.spotify.com/artist/5boaCl3zJ17mNdK6gfcgn4?si=MzExQYgsRM67S8t8qZ-FVg","");
    anchorSpotify.class("fa fa-spotify");
    anchorSpotify.position(276,40);

    fill(0); strokeWeight(1); textSize(18);
    text("Contact me: noiseprospex@gmail.com", width/2, 50)
}

function initCategories() {
    categories = ["Newest"];

    for(let i = 0; i  < catalogue.length; i++) {
        let c = catalogue[i].category || "";
        if (c.length > 0 && categories.indexOf(c) === -1) categories.push(c);
    }
}

function initCategorySelector() {
    categorySelect = createSelect();
    
    for(let i = 0; i  < categories.length; i++) {
        categorySelect.option(categories[i]);
    }

    let dropdownWidth = width/4;
    categorySelect.position(width/2-dropdownWidth/2, banner.height+80);
    categorySelect.size(dropdownWidth, 30)

    categorySelect.changed(createBeatSelection);
}

function clearBeatPlaybacks() {
    for (let i = beats.length-1; i >= 0; i--) {
        try { beats[i].remove(); } catch (e) {}
    }
    beats = [];
}

function text3D(str, x, y, offsetX, offsetY) {
    fill(0);
    text(str, x+offsetX, y+offsetY);
    fill(255);
    text(str, x, y);
}