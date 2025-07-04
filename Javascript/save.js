let Save = {
    /**
     * Saves the song names into a text document
     * @param {boolean} saveAsJson - True to save as JSON, false to save as TXT
     */
    saveSongNames: function(saveAsJson) {
        let includeArtist = document.getElementById("includeArtistsCheckbox").checked;

        let saveTextSongTitle = "======\nSONGS\n======\n";
        let saveTextSongs = this._getSongList(false, includeArtist);
        let saveTextFanfareTitle = "\n=========\nFANFARES\n=========\n";
        let saveTextFanfares = this._getSongList(true, includeArtist);

        let saveObj; // Either a string or an object
        let ext = "txt";
        let fileType = "plain";
        if (saveAsJson) {
            ext = "json";
            fileType = "json";
            let objectToSave = {};
            if (saveTextSongs.length > 0) {
                objectToSave["songs"] = [];
                saveTextSongs.forEach(song => objectToSave["songs"].push(song));
            }
            if (saveTextFanfares.length > 0) {
                objectToSave["fanfares"] = [];
                saveTextFanfares.forEach(fanfare => objectToSave["fanfares"].push(fanfare));
            }
            saveObj = encodeURIComponent(JSON.stringify(objectToSave, null, 2))
        } else {
            saveObj = "";
            if (saveTextSongs.length > 0) {
                saveObj += `${saveTextSongTitle}${saveTextSongs.join("\n")}\n`;
            }
            if (saveTextFanfares.length > 0) {
                saveObj += `${saveTextFanfareTitle}${saveTextFanfares.join("\n")}`;
            }
        }

        let dataStr = `data:text/${fileType};charset=utf-8,${saveObj}`;
        let downloadAnchorNode = document.createElement('a');

        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `songText.${ext}`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },

    /**
     * Gets the newline-delimited string of songs
     * @param {boolean} getFanfares - Whether to get fanfares instead of songs
     * @param {boolean} includeArtist - Whether to include the artist at the start of the song
     * @returns 
     */
    _getSongList: function(getFanfares, includeArtist) {
        var songList = SongView.getSelectedSongs(getFanfares);
        if (songList.length === 0) {
            // Get all songs if none were selected
            songList = SongView.getSelectedSongs(getFanfares, true);
        }

        return songList.map(song => includeArtist ? song : song.replace(/^.* - /, ""));
    },

    saveJSON: function() {
        let tempExportObj = CurrentSaveData;
        if (!Main.onLocationView) {
            tempExportObj = document.getElementById("fillAllCheckbox").checked
                ? this._getFilledSaveData()
                : this._getSaveData();
        }

        let exportObj = {};

        Locations.concat(LowPriorityLocations).forEach(loc => {
            if (tempExportObj[loc]) {
                exportObj[loc] = tempExportObj[loc];
            }
        });

        FanfareLocations.concat(LowPriorityFanfareLocations).forEach(loc => {
            if (tempExportObj[loc]) {
                exportObj[loc] = tempExportObj[loc];
            }
        });

        this._sanitizeExportObj(exportObj);

        let saveObj = { bgm: exportObj };
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveObj, null, 2));
        let downloadAnchorNode = document.createElement('a');

        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "songPlando.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },

    /**
     * Goes through the given object and cleans up the names of the original OoT Songs, since they should only contian the song/fanfare name
     * @param exportObj - the object to sanitize
     */
    _sanitizeExportObj: function(exportObj) {
        let originalSongPrefix = "Ocarina of Time - ";
        let originalFanfarePrefix = "F - Ocarina of Time - ";
        Object.keys(exportObj).forEach(loc => {
            let seqName = exportObj[loc];
            let seqNoPrefix = seqName.replace(originalSongPrefix, "");
            if (seqName.startsWith(originalSongPrefix) &&
                 OriginalSongNames.includes(seqNoPrefix) // Specifically, Kaepora Gaebora
            ) {
                exportObj[loc] = seqNoPrefix;
            } else if (seqName.startsWith(originalFanfarePrefix)) {
                exportObj[loc] = seqName.replace(originalFanfarePrefix, "");
            }
        });
    },

    populateSaveObject: function() {
        CurrentSaveData = this._getSaveData();
    },

    completelyFillSaveObject: function() {
        if (!Main.onLocationView) {
            throw "Tried to completely fill save object, but wasn't on the location view!";
        }

        CurrentSaveData = this._getFilledSaveData();
    },

    /**
     * Gets the save data
     * @returns 
     */
    _getSaveData: function() {
        let saveData = {};

        this._insertIntoSaveData(saveData, false);
        this._insertIntoSaveData(saveData, true);
        this._fillLockedInfoData(saveData);

        return saveData;
    },

    /**
     * Inserts one set of all selected songs or fanfares into the given save data object
     * @param {Object} saveData - The save data
     * @param {boolean} isFanfare - Whether this is for fanfares
     */
    _insertIntoSaveData: function(saveData, isFanfare) {
        let selectedSongData = SongView.getSelectedArtistsAndSongs(isFanfare);
        if (!selectedSongData || selectedSongData.length === 0) {
            return; // Nothing selected!
        }

        let songLocationList = isFanfare 
            ? this._getFanfareLocationList()
            : this._getSongLocationList();

        if (Main.onLocationView) {
            selectedSongData = selectedSongData.filter(songData => !LocationView.getLockedSongs().includes(songData.song));
            songLocationList = songLocationList.filter(loc => !LocationView.getLockedLocations().includes(loc));
        }

        for (let i = 0; i < selectedSongData.length && i < songLocationList.length; i++) {
            this._insertLocationIntoSaveData(saveData, songLocationList[i], selectedSongData[i]);
        } 
    },

    /**
     * Gets the save data and completely fills the blank songs, if there are any selected
     * Locked locations will be excluded, but the entire song list is used for each fill in this case
     * @returns
     */
    _getFilledSaveData: function() {
        let saveData = {};

        this._insertAllIntoSaveData(saveData, false);
        this._insertAllIntoSaveData(saveData, true);
        this._fillLockedInfoData(saveData);

        return saveData;
    },

    /**
     * Inserts the selected songs or fanfares into the given save data object until all locations are filled out
     * @param {Object} saveData - The save data
     * @param {boolean} isFanfare - Whether this is for fanfares
     */
    _insertAllIntoSaveData: function(saveData, isFanfare) {
        let selectedSongs = SongView.getSelectedArtistsAndSongs(isFanfare);
        if (!selectedSongs || selectedSongs.length === 0) {
            return; // Nothing selected!
        }

        let locationList = isFanfare
            ? this._getFanfareLocationList()
            : this._getSongLocationList();

        selectedSongs = selectedSongs.filter(songData => !LocationView.getLockedSongs().includes(songData.song))
        let songLocationList = locationList.filter(loc => !LocationView.getLockedLocations().includes(loc));
        
        for (let locIndex = 0, i = 0; locIndex < songLocationList.length; locIndex++, i++) {
            // Refill the songs if necessary
            if (selectedSongs.length - 1 < i) {
                selectedSongs = SongView.getSelectedArtistsAndSongs(isFanfare);
                i = 0;
            }
            
            this._insertLocationIntoSaveData(saveData, songLocationList[locIndex], selectedSongs[i]);
        }
    },

    /**
     * Inserts the given artists/song for the given location into the save data
     * @param {Object} saveData - The save data
     * @param {string} location - The location
     * @param {Object} songData - {artist: string, song: string}
     */
    _insertLocationIntoSaveData: function(saveData, location, songData) {
        saveData[`loc-artist|${location}`] = songData.artist;
        saveData[location] = songData.song;
    },

    /**
     * Fills the given save data object with the locked info
     * @param {Object} saveData 
     */
    _fillLockedInfoData: function(saveData) {
        let _this = this;
        LocationView.getLockedLocations()
            .concat(LocationView.getLockedLocations(true))
            .forEach(loc => {
                _this._insertLocationIntoSaveData(
                    saveData, loc, LocationView.getArtistAndSongByLocation(loc));
            });
    },

    _getSongLocationList: function() {
        return [...Locations].shuffle().concat([...LowPriorityLocations].shuffle());
    },

    _getFanfareLocationList: function() {
        return [...FanfareLocations].shuffle().concat([...LowPriorityFanfareLocations].shuffle());
    },

    /**
     * Saves the state of the form so it can be loaded back later
     */
    saveState: function() {
        let exportObj = this._getSaveStateObject();
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
        let downloadAnchorNode = document.createElement('a');

        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `songPlandoState.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },

    _getSaveStateObject: function() {
        let state = { 
            textFields: {},
            checkboxes: {},
            dropdowns: {}
        };
        let inputElements = document.getElementsByTagName('input');
        for (let inputElement of inputElements) {
            if (inputElement.type === "checkbox" && inputElement.checked) {
                state.checkboxes[inputElement.id] = true;
            }
            else if (inputElement.type === "text" && inputElement.value && inputElement.value.trim() !== "") {
                state.textFields[inputElement.id] = inputElement.value;
            }
        }

        // Store the dropdowns as the text value in case more songs get added
        let dropdownElements = document.getElementsByTagName('select');
        for (let dropdownElement of dropdownElements) {
            let dropdownValue = dropdownElement.selectedOptions[0].innerText;
            if (dropdownValue && dropdownValue.trim() !== "") {
                state.dropdowns[dropdownElement.id] = dropdownValue;
            }
        }

        return state;
    },

    /**
     * Loads the state of the from from the save file
     */
    loadState: function() {
        if (typeof window.FileReader !== 'function') {
            alert("The file API isn't supported on this browser yet.");
            return;
        }

        let input = document.getElementById('fileInput');
        if (input) { input.remove(); }

        input = dce("input", "nodisp");
        input.id = "fileInput";
        input.type = "file";
        input.onchange = this.onFileUploaded.bind(this);
        document.body.appendChild(input);

        input.click(); // Select a file
    },

    onFileUploaded: function() {
       let  input = document.getElementById('fileInput');
        if (!input) {
            alert("Um, couldn't find the fileinput element.");
        } else if (!input.files) {
            alert("This browser doesn't seem to support the `files` property of file inputs.");
        } else if (!input.files[0]) {
            alert("Please select a file before clicking 'Load'");
        } else {
            file = input.files[0];
            let fr = new FileReader();
            fr.onload = this._onFileLoaded.bind(this);
            fr.readAsText(file);
        }
    },

    /**
     * Called when the file is loaded
     */
    _onFileLoaded: function(event) {
        let lines = event.target.result;
        let loadedObject = JSON.parse(lines); 
        this._loadSaveFile(loadedObject);

        alert("State loaded successfully!");
    },

    /**
     * Loads the save file and assign all the appropriate values to the UI
     * @param loadedObject - the object with the UI data
     */
    _loadSaveFile: function(loadedObject) {
        let inputElements = document.getElementsByTagName('input');
        for (let inputElement of inputElements) {
            if (inputElement.type === "checkbox") {
                inputElement.checked = loadedObject.checkboxes[inputElement.id] || false;
            }
            else if (inputElement.type === "text") {
                inputElement.value = loadedObject.textFields[inputElement.id] || "";
            }
        }

        let dropdownElements = document.getElementsByTagName('select');
        for (let dropdownElement of dropdownElements) {
            dropdownElement.value = loadedObject.dropdowns[dropdownElement.id] || "";

            if (dropdownElement.value) {
                dropdownElement.onchange();
            }
        }

        // Apply the regex filter in case it was modified
        SongView.applyFilter();
    }
};