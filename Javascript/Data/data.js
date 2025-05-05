/** 
 * Song data from the original game
 */
let OriginalSongNames = [
    "Fire Temple",
    "Shadow Temple",
    "Horse Race",
    "Fairy Fountain",
    "Lost Woods",
    "Kotake and Koume",
    "Potion Shop",
    "Kakariko Adult",
    "Castle Underground",
    "Fire Boss",
    "Miniboss Battle",
    "Goron City",
    "Kakariko Child",
    "Deku Tree",
    "Fairy Flying",
    //"Kaepora Gaebora", // Using a seq file to prevent issues with fanfares
    "Battle",
    "Chamber of the Sages",
    "Dodongos Cavern",
    "Shooting Gallery",
    "Water Temple",
    "Lon Lon Ranch",
    "Mini-game",
    "Jabu Jabu",
    "Market",
    "Gerudo Valley",
    "Shop",
    "Inside Deku Tree",
    "Title Theme",
    "House",
    "Kokiri Forest",
    "Windmill Hut",
    "Sheik Theme",
    "Ganon Battle",
    "Forest Temple",
    "Castle Escape",
    "Castle Courtyard",
    "Spirit Temple",
    "Ganondorf Theme",
    "Ingo Theme",
    "Zelda Theme",
    "Zoras Domain",
    "Temple of Time",
    "Ice Cavern",
    "Boss Battle",
    "Hyrule Field",
    "Ganondorf Battle"
];

/** 
 * Fanfare data from the original game
 */
let OriginalFanfareNammes = [
    "Ganondorf Appears",
    "Ganons Rainbow Bridge",
    "Heart Piece Get",
    "Zelda Turns Around",
    "Game Over",
    "Learn Song",
    "Epona Race Goal",
    "Spirit Stone Get",
    "Master Sword",
    "Medallion Get",
    "Treasure Chest",
    "Door of Time",
    "Heart Container Get",
    "Item Get",
    "Boss Defeated",
    "Escape from Ranch"
];
    
/**
 * These will be constructed from the data above based on the filepaths
 */
let RawSongNames = [];
let RawFanfareNames = [];

/**
 * This will be an array of the following objects (created from above):
 * - Directory, with directories under them
 * - At the end, will be an array of all the song names
 */
let SongData = {};

/**
 * This will be an array of the following objects (created from above):
 * - Directory, with directories under them
 * - At the end, will be an array of all the song names
 */
let FanfareData = {};

/**
 * An object consisting of key/value pairs linking location dropdowns to their current values
 */
let CurrentSaveData = {};