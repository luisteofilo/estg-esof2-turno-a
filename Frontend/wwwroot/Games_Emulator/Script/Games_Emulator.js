
    async function playGame(gameId) {
    try {
    console.log("GameId received:", gameId);


    const response = await fetch(`http://localhost:5295/games/${gameId}`);
    if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
}


    const responseText = await response.text();


    const roms = JSON.parse(responseText);


    const rom = roms.find(r => r.gameId === gameId);

    if (rom) {
    console.log("Rom found:", rom);


    const hexString = rom.rom;
    const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));


    const romBlob = new Blob([byteArray], { type: 'application/octet-stream' });


    const romObject = {
    rom: romBlob,
    fileName: rom.file_name ? String(rom.file_name) : '',
    gameId: String(rom.gameId),
    description: rom.description ? String(rom.description) : ''

};

    console.log("Roms received:", romObject);


    emulator_trigger(romObject);
} else {
    console.error("Rom not found for gameId:", gameId);
}
} catch (error) {
    console.error("Fetch error:", error.message);
}
}


    function emulator_trigger(romObject) {
    const { rom, fileName } = romObject;

    console.log("Game ROM Blob:", rom);
    console.log("File Name:", fileName);

    const parts = fileName.split(".");
    const core = getCoreFromExtension(parts.pop());

    console.log("Starting emulator setup...");

    let enableDebug = true;
    let enableThreads = false;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get("debug") == 1) {
    enableDebug = true;
    console.log("Debug is enabled");
} else {
    console.log("Debug is disabled");
}

    if (urlParams.get("threads") == 1) {
    if (window.SharedArrayBuffer) {
    enableThreads = true;
    console.log("Threads are enabled");
} else {
    console.warn(
    "Threads are disabled as SharedArrayBuffer is not available. Threads requires two headers to be set when sending you html page. See https://stackoverflow.com/a/68630724"
    );
    console.log("Threads are disabled");
}
} else {
    console.log("Threads are disabled");
}

    const div = document.createElement("div");
    const sub = document.createElement("div");
    const script = document.createElement("script");

    sub.id = "game";
    div.id = "display";

    // Remover elementos top e box se existirem
    const top = document.getElementById("top");
    if (top) top.remove();

    const box = document.getElementById("box");
    if (box) box.remove();

    div.appendChild(sub);
    document.body.appendChild(div);

    // Configurações do EmulatorJS
    window.EJS_player = "#game";
    window.EJS_gameName = parts.join(".");
    window.EJS_biosUrl = "";
    window.EJS_gameUrl = URL.createObjectURL(rom);
    window.EJS_core = core;
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    window.EJS_startOnLoaded = false;
    window.EJS_DEBUG_XX = enableDebug;
    window.EJS_disableDatabases = true;
    window.EJS_threads = enableThreads;
    window.EJS_fullscreenOnLoaded = false;

    EJS_Buttons = {
    playPause: true,
    restart: true,
    mute: true,
    settings: false,
    fullscreen: true,
    saveState: true,
    loadState: true,
    screenRecord: true,
    gamepad: true,
    cheat: false,
    volume: true,
    saveSavFiles: true,
    loadSavFiles: true,
    quickSave: false,
    quickLoad: false,
    screenshot: true,
    cacheManager: false,
};

    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(script);

    // Mostrar controles de estado salvo se existir o elemento
    const controls = document.getElementById("controls");
    if (controls) controls.style.display = "flex";

    // Evento de dragover e dragleave para o elemento box, se existir
    if (box) {
    box.ondragover = () => box.setAttribute("drag", true);
    box.ondragleave = () => box.removeAttribute("drag");
}
}

    function getCoreFromExtension(extension) {
    switch (extension.toLowerCase()) {
    case "nes":
    case "fds":
    case "unif":
    case "unf":
    return "nes";
    case "smc":
    case "fig":
    case "sfc":
    case "gd3":
    case "gd7":
    case "dx2":
    case "bsx":
    case "swc":
    return "snes";
    case "z64":
    case "n64":
    return "n64";
    case "pce":
    return "pce";
    case "ngp":
    case "ngc":
    return "ngp";
    case "ws":
    case "wsc":
    return "ws";
    case "col":
    case "cv":
    return "coleco";
    case "d64":
    return "vice_x64sc";
    case "gba":
    case "gb":
    return extension;
    default:
    return "nes"; // Default to NES if extension is not recognized
}
}

    console.log("Initialized.");
