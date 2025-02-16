/**
 * Leave prompt
 */
window.onbeforeunload = function() {
    return "Please make sure you save before leaving!";
};

let Main = {
    onLocationView: false,

    // Populated by _populateData - a struture containing all top-level artists and an array of all songs by it
    songData: {},
    fanfareData: {},

    onPageLoad: function() {
        if (typeof RawSequencePaths === "undefined") {
            document.body.innerHTML = "Sequence paths not found! Please run <strong>Scripts/create-raw-sequence-paths.bat</strong> (see the readme for details).";
            return;
        }

        this.initializeData();
        SongView.initialize();
        LocationView.initialize();
    },

    initializeData: function() {
        RawSequencePaths.forEach(path => {
            if (path.includes("\\Custom Music\\")) {
                RawSongNames.push(path);
            } else if (path.includes("\\Custom Fanfares\\")) {
                RawFanfareNames.push(path);
            } else {
                console.log("WARNING: The following path did not contain the expected path to a sequence!");
                console.log(path);
            }
        });

        this._fillLocationTitles();
        this._populateOriginalSongs();
        this._populateOriginalFanfares();
    },

    /**
     * Populates the titles of the locations to include the number of songs/fanfares
     */
    _fillLocationTitles: function() {
        let songTitleElement = document.getElementById("songLocationsTitle");
        songTitleElement.innerText = `Song Locations (${Locations.length + LowPriotityLocations.length})`;

        let fanfareTitleElment = document.getElementById("fanfareLocationsTitle");
        fanfareTitleElment.innerText = `Fanfare Locations (${FanfareLocations.length + LowPriorityFanfareLocations.length})`;
    },

    /**
     * Populate the original song names - we're spoofing like it's on the filesystem so that it shows up where we want it to
     */
    _populateOriginalSongs: function() {
        OriginalSongNames.forEach(song => {
            RawSongNames.push(`Custom Music\\Zelda\\Ocarina of Time\\OoT - ${song}.ootrs`);
        });
    },

    /**
     * Populate the original fanfare names - we're spoofing like it's on the filesystem so that it shows up where we want it to
     */
    _populateOriginalFanfares: function() {
        OriginalFanfareNammes.forEach(song => {
            RawFanfareNames.push(`Custom Fanfares\\Zelda\\Ocarina of Time\\F - OoT - ${song}.ootrs`);
        });
    },

    switchViews: function() {
        this.onLocationView = !this.onLocationView;
        toggleCssClass(document.getElementById("songView"), "nodisp");
        toggleCssClass(document.getElementById("songViewHeader"), "nodisp");
        toggleCssClass(document.getElementById("locationView"), "nodisp");
        toggleCssClass(document.getElementById("locationViewHeader"), "nodisp");
    },

    updateSaveButton() {
        let selectedSongsString = `${SongView.getSelectedSongs(false).length} | ${SongView.getSelectedSongs(true).length}`;
        document.getElementById("saveButton").innerText = `Save (${selectedSongsString})`;
    }
};