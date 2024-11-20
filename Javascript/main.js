let Main = {
    onLocationView: false,

    onPageLoad: function() {
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
    },

    /**
     * Given one of the song/fanfare data objects, traverses through and grabs the flat data values, sorted
     * @param dataObject - the data object
     */
    getFlatDataValues: function(getFanfares) {
        let dataValues = [];
        let cssClassToCheck = getFanfares ? "fanfare-name" : "song-name";
        let elements = document.getElementsByClassName(cssClassToCheck);
        for (let element of elements) {
            dataValues.push(element.id.split("||")[1]);
        }
        return dataValues.sort();
    }
};