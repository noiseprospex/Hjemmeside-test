let banner, logo;
let font1;
let categorySelect;
let categories;
let beatContainerHeight, beatContainerWidth, beatContainerMargin, bannerHeight;

let beats = [];

function preload() {
    banner = loadImage("assets/images/banner.JPG");
    logo = loadImage("assets/images/logo.png")
    font1 = loadFont('assets/font1.ttf');
}

function setup() {
    beatContainerHeight = 60;
    beatContainerMargin = 10;

    bannerHeight = windowWidth*0.4

	createCanvas(windowWidth, bannerHeight+windowHeight*0.1+max(windowWidth,windowHeight)*(175/1908)+catalogue.length*(beatContainerHeight+beatContainerMargin)+beatContainerMargin);
    
    

    beatContainerWidth = width/2;
    
    initCategories();

    drawInterface();
    createBeatSelection();
}

function windowResized() {
    bannerHeight = windowWidth*0.4

    createCanvas(windowWidth, windowHeight+catalogue.length*(beatContainerHeight+beatContainerMargin)+beatContainerMargin);

    drawInterface();
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
        let y = bannerHeight+windowHeight*0.1+max(windowWidth,windowHeight)*(175/1908)+(beatContainerHeight+beatContainerMargin)*this.i;
        
        strokeWeight(max(windowWidth,windowHeight)*(2/1908)); fill(255);
        rect(width*1/4, y, width/2, beatContainerHeight);

        textSize(max(windowWidth,windowHeight)*(18/1908)); fill(0); textAlign(LEFT, CENTER);
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

    //top menu
    fill(240); strokeWeight(0);
    rect(0,0,width,windowHeight*0.1);
    image(logo,windowWidth*0.01,windowHeight*0.01,windowHeight*0.08,windowHeight*0.08);

    drawLinkBoxes();

    textAlign(CENTER, CENTER);
    fill(0); strokeWeight(max(windowWidth,windowHeight)*(1/1908)); textSize(max(windowWidth,windowHeight)*(18/1908));
    text("Contact me: noiseprospex@gmail.com", windowWidth/2, windowHeight*0.05)

    //banner
    image(banner,0, windowHeight*0.1, width, bannerHeight);

    textSize(max(windowWidth,windowHeight)*(60/1908)); 
    textFont(font1); 
    text3D("Noise by Prospex", width/2, windowHeight*0.1+bannerHeight*0.5, 2, 1);

    textSize(max(windowWidth,windowHeight)*(20/1908)); 
    textFont("Helvetica");
    text3D("Experimental trap beats", width/2, windowHeight*0.1+bannerHeight*0.5+max(windowWidth,windowHeight)/40, 2, 1);

    fill(0);    
    text("Choose snippet category:", width/2, windowHeight*0.1+bannerHeight+max(windowWidth,windowHeight)/30);
    
    textSize(max(windowWidth,windowHeight)*(14/1908));
    text("This website is for showcasing snippets for beats i made. If you like any of them, save the WIP number and contact me on my socials or gmail.", width/2, windowHeight*0.1+bannerHeight+max(windowWidth,windowHeight)/100)

    strokeWeight(max(windowWidth,windowHeight)*(2/1908));
    line(width*1/4, windowHeight*0.1+bannerHeight+max(windowWidth,windowHeight)*(150/1908), width*3/4, windowHeight*0.1+bannerHeight+max(windowWidth,windowHeight)*(150/1908));

    initCategorySelector();
}

let anchorInstagram,anchorYoutube,anchorSoundcloud,anchorSpotify;

function drawLinkBoxes() {
    if(anchorInstagram) {
        anchorInstagram.remove();
        anchorYoutube.remove();
        anchorSoundcloud.remove();
        anchorSpotify.remove();
    }

    let marginX = 5*1.8, marginY = 5*1.8;

    anchorInstagram = createA("https://www.instagram.com/noiseprospex/","");
    anchorInstagram.class("fa fa-instagram");
    anchorInstagram.position(marginX+windowWidth*0.01+windowHeight*0.1,windowHeight*0.05-marginY);
    
    anchorYoutube = createA("https://www.youtube.com/@NoiseProspex","");
    anchorYoutube.class("fa fa-youtube");
    anchorYoutube.position(marginX+windowWidth*0.01+windowHeight*0.1+51,windowHeight*0.05-marginY);

    anchorSoundcloud = createA("https://soundcloud.com/noise-prospex","");
    anchorSoundcloud.class("fa fa-soundcloud");
    anchorSoundcloud.position(marginX+windowWidth*0.01+windowHeight*0.1+105,windowHeight*0.05-marginY);

    anchorSpotify = createA("https://open.spotify.com/artist/5boaCl3zJ17mNdK6gfcgn4?si=MzExQYgsRM67S8t8qZ-FVg","");
    anchorSpotify.class("fa fa-spotify");
    anchorSpotify.position(marginX+windowWidth*0.01+windowHeight*0.1+165,windowHeight*0.05-marginY);
}

function initCategories() {
    categories = ["Newest"];

    for(let i = 0; i  < catalogue.length; i++) {
        let c = catalogue[i].category || "";
        if (c.length > 0 && categories.indexOf(c) === -1) categories.push(c);
    }
}

function initCategorySelector() {
    if(categorySelect) categorySelect.remove()
    categorySelect = createSelect();
    
    for(let i = 0; i  < categories.length; i++) {
        categorySelect.option(categories[i]);
    }

    let dropdownWidth = windowWidth/4;
    categorySelect.position(windowWidth/2-dropdownWidth/2, bannerHeight+windowHeight*0.1+max(windowWidth,windowHeight)*(100/1908));
    categorySelect.size(dropdownWidth, max(windowWidth,windowHeight)*(30/1908))

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