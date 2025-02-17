let Locations = [
    "Hyrule Field",
    "Dodongos Cavern",
    "Kakariko Adult",
    "Boss Battle",
    "Inside Deku Tree", // Used for grottos
    "Market",
    "Title Theme",
    "House",
    "Jabu Jabu",
    "Kakariko Child",
    "Fairy Fountain",
    "Fire Temple",
    "Forest Temple",
    "Lon Lon Ranch",
    "Goron City",
    "Miniboss Battle",
    "Temple of Time",
    "Kokiri Forest",
    "Lost Woods",
    "Spirit Temple",
    "Windmill Hut",
    "Shooting Gallery",
    "Zoras Domain",
    "Shop",
    "Ice Cavern",
    "Shadow Temple",
    "Water Temple",
    "Gerudo Valley",
    "Potion Shop",
    "Castle Underground", // Inside Ganon's Castle
    "Fire Boss",
    "Mini-game",

    // Remapped sequences
    "Sheik Theme", // GTG
    "Fairy Flying", // Inside the Deku Tree
    "Deku Tree", // Lake Hylia (the original song is the cutscene Deku Tree song, which is never heard)
    "Castle Escape", // Hyrule/Ganon's Castle Outside
    "Kotake and Koume", // Death Mountain Trail
    "Ganondorf Theme", // Zora's River
    "Ganon Battle", // Sacred Forest Meadow
    "Ganondorf Battle", // Zora's Fountain
    "Zelda Theme", // Thieves' Hideout
    "Ingo Theme", // Death Mountain Crater
    "Horse Race", // Gerudo Fortress
    "Battle", // Haunted Wasteland
    "Castle Courtyard", // Desert Colossus
    "Chamber of the Sages" // Graveyard/Outside ToT
];

let LowPriorityLocations = [
    // Chance that the song that gets mapped here won't even work due to a rando bug
    "Kaepora Gaebora"
];

/**
 * An object mapping location names to different names to display to the user
 * This is to handle remapped names in a user-friendly way
 */
let LocationDisplayNames = {
    // Locations
    "Sheik Theme": "Gerudo Training Grounds",
    "Fairy Flying": "Inside the Deku Tree",
    "Inside Deku Tree": "Grottos",
    "Deku Tree": "Lake Hylia",
    "Castle Escape": "Castle",
    "Kotake and Koume": "Death Mountain Trail",
    "Ganondorf Theme": "Zora's River",
    "Ganon Battle": "Sacred Forest Meadow",
    "Ganondorf Battle": "Zora's Fountain",
    "Zelda Theme": "Thieves' Hideout",
    "Ingo Theme": "Death Mountain Crater",
    "Horse Race": "Gerudo Fortress",
    "Battle": "Haunted Wasteland",
    "Castle Courtyard": "Desert Colossus",
    "Castle Underground": "Inside Ganon's Castle", // This name is confusing, so renaming
    "Chamber of the Sages": "Graveyard/Outside ToT",
    "Windmill Hut": "BotW/Windmill",

    // Fanfares
    "Zelda Turns Around": "Rescue Prisoner"
};

let FanfareLocations = [
    "Game Over",
    "Boss Defeated",
    "Item Get",
    "Heart Container Get",
    "Treasure Chest",
    "Spirit Stone Get",
    "Heart Piece Get",
    "Epona Race Goal",
    "Master Sword"
];

let LowPriorityFanfareLocations = [
    "Ganondorf Appears",
    "Escape from Ranch",
    "Door of Time",
    "Ganons Rainbow Bridge",
    "Zelda Turns Around" // Heard when talking to rescused gorons or guards
];

// Disabled locations - never heard due to rando
// "Learn Song",
// "Medallion Get",