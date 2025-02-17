let LocationView = {
    _sortedLocations: Locations
        .sort((a, b) => {
            let item1 = LocationDisplayNames[a] || a;
            let item2 = LocationDisplayNames[b] || b;
            if (item1 < item2) { return -1; }
            if (item1 > item2) { return 1; }
            return 0;
        })
        .concat(LowPriorityLocations.sort()),
    _sortedFanfares: FanfareLocations.sort().concat(LowPriorityFanfareLocations.sort()),

    initialize: function() {
        this._createDropdowns(document.getElementById("songLocationDropdowns"), false);
        this._createDropdowns(document.getElementById("fanfareDropdowns"), true);
    },

    getLockedSongs: function(isForFanfares) {
        let lockedSongs = [];
        let locationList = isForFanfares ? this._sortedFanfares : this._sortedLocations;
        let _this = this;
        locationList.forEach(loc => {
            if (document.getElementById(_this._getLockCheckboxId(loc)).checked) {
                let songName = document.getElementById(_this._getSongDropdownId(loc)).value;
                if (songName) {
                    lockedSongs.push(songName);
                }
            }
        });
        return lockedSongs;
    },

    getLockedLocations: function(isForFanfares) {
        let lockedLocations = [];
        let locationList = isForFanfares ? this._sortedFanfares : this._sortedLocations;
        let _this = this;
        locationList.forEach(loc => {
            if (document.getElementById(_this._getLockCheckboxId(loc)).checked) {
                lockedLocations.push(loc);
            }
        });
        return lockedLocations;
    },

    getArtistAndSongByLocation: function(location) {
        let artistDropdown = document.getElementById(this._getArtistDropdownId(location));
        let songDropdown = document.getElementById(this._getSongDropdownId(location));
        return {
            artist: artistDropdown ? artistDropdown.value : "",
            song: songDropdown ? songDropdown.value : ""
        };
    },

    _createDropdowns: function(dropdownContainer, isForFanfares) {
        let locationList = isForFanfares ? this._sortedFanfares : this._sortedLocations;
        let _this = this;
        locationList.forEach(loc => { 
            let label = dce("div", "song-location-label");
            label.innerText = LocationDisplayNames[loc] || loc;

            let checkbox = dce("input", "lock-checkbox");
            checkbox.id = this._getLockCheckboxId(loc);
            checkbox.type = "checkbox";

            let container = dce("div");
            container.appendChild(label);
            container.appendChild(_this._createArtistDropdown.call(_this, loc, isForFanfares));
            container.appendChild(_this._createSongDropdown.call(_this, loc));
            container.appendChild(checkbox);
            dropdownContainer.appendChild(container);
        });
    },

    _createArtistDropdown: function(forLocation, isForFanfare) {
        let dropdown = this._createDropdown(this._getArtistDropdownId(forLocation));
        let artists = isForFanfare
            ? Object.keys(Main.fanfareData)
            : Object.keys(Main.songData);

        artists.forEach(artist => {
            let optionElement = dce("option");
            optionElement.value = artist;
            optionElement.innerText = artist;
            dropdown.appendChild(optionElement);
        });

        let _this = this;
        dropdown.onchange = function() {
            if (!dropdown.value) {
                delete CurrentSaveData[forLocation];
            }
            _this._populateSongDropdown(forLocation, dropdown.value, isForFanfare);
        }

        return dropdown;
    },

    _createSongDropdown: function(forLocation) {
        let dropdown = this._createDropdown(this._getSongDropdownId(forLocation));
        dropdown.onchange = function() {
            CurrentSaveData[forLocation] = dropdown.value;
        }
        return dropdown;
    },

    _populateSongDropdown: function(forLocation, forArtist, isForFanfare) {
        let dropdown = document.getElementById(this._getSongDropdownId(forLocation));
        dropdown.innerHTML = "";
        delete CurrentSaveData[forLocation];

        let songs = isForFanfare
            ? Main.fanfareData[forArtist]
            : Main.songData[forArtist];

        if (!songs) {
            return;
        }

        songs.forEach(song => {
            let optionElement = dce("option");
            optionElement.value = song;
            optionElement.innerText = song;
            dropdown.appendChild(optionElement);
        });

        CurrentSaveData[forLocation] = dropdown.value;
    },

    _createDropdown: function(dropdownId) {
        let dropdown = dce("select");
        dropdown.id = dropdownId;

        let defaultOption = dce("option");
        defaultOption.value = "";
        dropdown.appendChild(defaultOption);

        return dropdown;
    },

    _getArtistDropdownId: function(locName) {
        return `artistDropdown|${locName}`;
    },

    _getSongDropdownId: function (locName) {
        return `songDropdown|${locName}`;
    },

    _getLockCheckboxId: function(locName) {
        return `lockCheckbox|${locName}`;
    },

    /**
     * Fills the dropdowns with random selections from the song pool
     */
    fillDropdowns: function() {
        Save.populateSaveObject();
        this._refreshDropdowns();
    },

    /**
     * Fills the dropdowns with random selections from the song pool
     * Keeps filling if there are any blanks left
     */
    fillAllDropdowns: function() {
        Save.completelyFillSaveObject();
        this._refreshDropdowns();
    },

    /**
     * Fills the dropdowns with the current save object value
     */
    _refreshDropdowns: function() {
        let dropdownElements = document.getElementsByTagName('select');
        for (let dropdown of dropdownElements) {
           dropdown.value = "";
        }

        let _this = this;
        let artistData = {};
        let songData = {};

        Object.keys(CurrentSaveData).forEach(key => {
            let value = CurrentSaveData[key];

            if (key.startsWith("loc-artist|")) {
                let locName = key.split("|")[1];
                artistData[locName] = value;
            } else {
                songData[key] = value;
            }
        });

        Object.keys(artistData).forEach(locName => {
            let artistDropdown = document.getElementById(_this._getArtistDropdownId(locName));
            artistDropdown.value = artistData[locName];
            artistDropdown.onchange(); // Fills the song dropdown
        });

        Object.keys(songData).forEach(locName => {
            let songDropdown = document.getElementById(_this._getSongDropdownId(locName));
            songDropdown.value = songData[locName];
            songDropdown.onchange(); // Sets the save data
        });
    }
};