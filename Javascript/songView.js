let SongView = {
    _songCssClass: "song-name",
    _fanfareCssClass: "fanfare-name",
    _showingFanfares: true, // this gets toggled off at the start

    initialize: function() {
        this._populateData(RawSongNames, SongData, "Custom Music\\");
        this._populateData(RawFanfareNames, FanfareData, "Custom Fanfares\\");
        this._displayData(false);
        this._displayData(true);
        this.toggleFanfares();
    },

    toggleFanfares: function() {
        let showFanfares = !this._showingFanfares;
        let elements = document.getElementsByClassName('folder-1');
        for (let element of elements) {
            let isFanfareElement = containsCssClass(element, "fanfare-container");
            if (isFanfareElement) {
                addOrRemoveCssClass(element, "nodisp", !showFanfares);
            } else {
                addOrRemoveCssClass(element, "nodisp", showFanfares);
            }
        }
        this._showingFanfares = showFanfares;

        document.getElementById("toggleFanfareButton").innerText = showFanfares
            ? "Show Songs"
            : "Show Fanfares";
    },

    /**
     * Blurs the input field if enter is pressed so that the filer can be applied
     * @param event 
     */
    onFilterKeyPress: function(event) {
        if (event.key === "Enter") {
            event.target.blur();
        }
    },

    /**
     * Apply the regex filter - hides song containers and any empty resulting groups
     */
    applyFilter: function() {
        let inputFilter = document.getElementById("inputFilter");
        let regex = inputFilter.value;

        let cssClassToCheck = this._showingFanfares ? this._fanfareCssClass : this._songCssClass;
        let containerElements = document.getElementsByClassName("folder-1");
        for (let containerElement of containerElements) {
            let isAnyVisible = false;
            let songNameContainers = Array.from(containerElement.getElementsByClassName("song-name-container"));

            for (let songNameContainer of songNameContainers) {
                let inputElements = Array.from(songNameContainer.getElementsByClassName(cssClassToCheck));

                for (let element of inputElements) {
                    let elementName = element.name.split("||")[1];
                    let songInfoArray = elementName.split(" - ");
                    if (songInfoArray.length < 2) {
                        throw `Song with unexpected split: ${elementName}`;
                    }
                    let songName = songInfoArray[songInfoArray.length - 1];
        
                    // Hide the song contianer itself - case intensive regex match
                    let flags = document.getElementById("inputFilterFlags").value;
                    let hideSongName = flags
                        ? !new RegExp(regex, flags).test(songName)
                        : !new RegExp(regex).test(songName);

                    addOrRemoveCssClass(songNameContainer, "nodisp", hideSongName);
    
                    // If we didn't mark the visible flag, do so if this song is visible
                    if (!isAnyVisible && !hideSongName) {
                        isAnyVisible = true;
                    }

                    // Check the entire parent now to see if we should hide it (covers sub folders)
                    // Not very efficient, but doesn't really matter

                    // Get the parent input elements of the song name container
                    let parentInputElements = Array.from(songNameContainer.parentElement.getElementsByClassName(cssClassToCheck));
                    addOrRemoveCssClass(
                        songNameContainer.parentElement, 
                        "nodisp", 

                        // Hide if the ALL song name containers are hidden
                        // The song name containers are the parents of the input elements
                        parentInputElements.every(element => containsCssClass(element.parentElement, "nodisp")));
                }
            }

            // Hide the entire group if necessary
            addOrRemoveCssClass(containerElement, "nodisp", !isAnyVisible);
        }

        Main.updateSaveButton();
    },

    /**
     * Gets the selected songs - that is, those that are checked and not filtered out
     * @param {boolean} checkFanfares - whether this is for fanfares
     * @param {boolean} ignoreCheckbox - (optional) whether to ignore the checkbox state - false by default
     * @returns The selected songs
     */
    getSelectedSongs: function(checkFanfares, ignoreCheckbox) {
        let selectedSongs = [];
        let cssClassToCheck = checkFanfares ? this._fanfareCssClass : this._songCssClass;
        let elements = document.getElementsByClassName(cssClassToCheck);
        for (let element of elements) {
            if ((element.checked || ignoreCheckbox) && !containsCssClass(element.parentElement, "nodisp")) {
                selectedSongs.push(element.id.split("||")[1]);
            }
        }
        return selectedSongs;
    },

    selectAll: function(selectAll) {
        let cssClassToCheck = this._showingFanfares ? this._fanfareCssClass : this._songCssClass;
        let elements = document.getElementsByClassName(cssClassToCheck);
        for (let element of elements) {
            if (!containsCssClass(element.parentElement, "nodisp")) {
                element.checked = selectAll;
            }
        }
        
        Main.updateSaveButton();
    },

    _populateData: function(rawData, dataObject, directoryStartString) {
        let mainData = directoryStartString === "Custom Fanfares\\"
            ? Main.fanfareData 
            : Main.songData;

        rawData.forEach(rawSongName => {
            let directory = rawSongName.substring(rawSongName.lastIndexOf(directoryStartString)).replace(directoryStartString, "");
            
            folder1 = "";
            folder2 = "";
            songName = "";
            directory.split("\\").forEach(path => {
                if (path.endsWith(".ootrs")) {
                    songName = path.replace(".ootrs", "");
                    return;
                }

                if (folder1 === "") {
                    folder1 = path;
                    return;
                }
                
                if (folder2 === "") {
                    folder2 = path;
                    return;
                }

                throw "Song found that doesn't fit the structure!";
            });

            if (!songName) {
                throw "Song found that doesn't fit the structure! No song name found!";
            }

            // Master of Time songs have this prefix
            if (folder2 === "Master of Time") {
                songName = `(MoT) ${songName}`;
            }

            if (folder2) {
                dataObject[folder1] = dataObject[folder1] || {};
                dataObject[folder1][folder2] = dataObject[folder1][folder2] || { data: [] };
                dataObject[folder1][folder2].data.push(songName);
            } else {
                dataObject[folder1] = dataObject[folder1] || { data: [] };
                dataObject[folder1].data.push(songName);
            }

            mainData[folder1] = mainData[folder1] || [];
            mainData[folder1].push(songName);
        });
    },

    _displayData: function(displayFanfares) {
        let mainDiv = document.getElementById("songView");
        let dataObject = displayFanfares ? FanfareData : SongData;
        let checkboxCssClass = displayFanfares ? this._fanfareCssClass : this._songCssClass;
        let _this = this;
        Object.keys(dataObject).sort().forEach(path => {
            let pathContainer = _this._createGroupCheckBoxDiv(path, undefined, displayFanfares);
            let songDataValues = dataObject[path];
            Object.keys(songDataValues).sort().forEach(path2 => {
                if (path2 === "data") {
                    dataObject[path].data.sort().forEach(songName => {
                        _this._createSongNameDiv(pathContainer, path, "none", songName, checkboxCssClass);
                    });
                    return;
                }

                let pathContainer2 = _this._createGroupCheckBoxDiv(path, path2, displayFanfares);
                pathContainer.appendChild(pathContainer2);

                dataObject[path][path2].data.sort().forEach(songName => {
                    _this._createSongNameDiv(pathContainer2, path, path2, songName, checkboxCssClass);
                })
            })

            mainDiv.appendChild(pathContainer);
        });
    },

    _createGroupCheckBoxDiv: function(path, path2, displayFanfares) {
        let pathPrefix = displayFanfares ? "fanfarePath" : "path";
        let pathId = path2 ? `${pathPrefix}-${path}-${path2}` : `${pathPrefix}-${path}`;
        let inputPathId = `input-${pathId}`;

        let pathContainer = dce("div", `folder-${path2 ? 2 : 1}`);
        pathContainer.id = pathId;

        if (!path2 && displayFanfares) {
            addCssClass(pathContainer, "fanfare-container");
        }

        let pathCheckbox = dce("input");
        pathCheckbox.type = "checkbox";
        pathCheckbox.id = inputPathId;
        pathCheckbox.name = inputPathId;
        pathCheckbox.onchange = this._toggleCheckboxesForGroup.bind(event, pathId);
        pathContainer.appendChild(pathCheckbox);

        let pathLabel = dce("label");
        pathLabel.htmlFor = inputPathId;
        pathLabel.innerText = path2 ? path2 : path;
        pathContainer.appendChild(pathLabel);

        return pathContainer;
    },

    _createSongNameDiv: function(parent, folder1, folder2, songName, cssClass) {
        let inputId = `input-${folder1}-${folder2}||${songName}`;

        let songNameInput = dce("input", cssClass);
        songNameInput.id = inputId;
        songNameInput.name = inputId;
        songNameInput.type = "checkbox";
        songNameInput.onchange = Main.updateSaveButton.bind(this);

        let songNameLabel = dce("label");
        songNameLabel.htmlFor = inputId;
        songNameLabel.innerText = songName;

        let songNameContainer = dce("div", "song-name-container")
        songNameContainer.appendChild(songNameInput);
        songNameContainer.appendChild(songNameLabel);

        parent.appendChild(songNameContainer);
    },

    _toggleCheckboxesForGroup: function(groupId, event) {
        let state = event.target.checked;
        let elements = document.getElementById(groupId).getElementsByTagName('input');
        for (let element of elements) {
            // Don't change the state for disabled groups
            if (!containsCssClass(element.parentElement, "nodisp")) {
                element.checked = state;
            }
        }

        Main.updateSaveButton();
    },

    /**
     * Selects all songs that are returned by the customSongFunction and deselects the rest
     */
    selectCustomSongs: function() {
        let songs = Save._getSongList(false, true);
        let fanfares = Save._getSongList(true, true);

        let songObj = {};
        let fanfareObj = {};
        
        songs.forEach(song => this._addToSongObject(songObj, song), this);
        fanfares.forEach(fanfare => this._addToSongObject(fanfareObj, fanfare), this);
        
        let songNamesToUse = this.customSongFunction({
            songs: songObj,
            fanfares: fanfareObj
        });
        this._checkCustomSongs(songNamesToUse);

        Main.updateSaveButton();
    },

    /**
     * Add the song object for the custom song list
     * @param {any} songObject - the song object to add to
     * @param {string} song - The name of the song, in the format <artist> - <song>
     * @returns The song object in the format: [<artist> - <song>]: { artist: string, song: string }
     */
    _addToSongObject: function(songObj, song) {
        let songName = song.replace(/^F - /, "");
        let tokens = songName.split(" - ");
        let artist = tokens[0];
        songName = songName.replace(/^.* - /, "");
        
        songObj[song] = {
            artist: artist,
            song: songName
        };
    },

    /**
     * Checks the checkboxes for the given custom songs
     * @param {Array<string>} songNames - The array of song names in the format: <artist> - <song>
     */
    _checkCustomSongs: function(songNames) {
        let checkboxes = [].slice.call(document.getElementsByTagName("input"))
            .filter(input => input.id.split("||").length == 2);

        checkboxes.forEach(checkbox => {
            let songName = checkbox.id.split("||")[1]; // Item 1 has the song name, 0 is related to the path
            checkbox.checked = songNames.includes(songName);
        });
    },

    /**
     * A function to be defined by the user, which will return the list of songs to select
     * @param {any} data - Data in the format: { songs: {}, fanfares: {} }
     * - Each array contains objects keyed by the song's identifier, being:
     * - [artist - song] = { artist: "", song: "" }
     * @return The songs/fanfares to check, but as an array of strings
     */
    customSongFunction: function(data) {
        return Object.keys(data.songs).concat(Object.keys(data.fanfares));
    }
};