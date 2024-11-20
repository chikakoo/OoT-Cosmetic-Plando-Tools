let LocationView = {
    _sortedLocations: Locations
        .sort((a, b) => {
            let item1 = LocationDisplayNames[a] || a;
            let item2 = LocationDisplayNames[b] || b;
            if (item1 < item2) { return -1; }
            if (item1 > item2) { return 1; }
            return 0;
        })
        .concat(LowPriotityLocations.sort()),
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
                let songName = document.getElementById(_this._getDropdownId(loc)).value;
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

    getSongByLocation: function(location) {
        let dropdown = document.getElementById(this._getDropdownId(location));
        return dropdown ? dropdown.value : "";
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
            container.appendChild(_this._createDropdown.call(_this, loc, isForFanfares));
            container.appendChild(checkbox);
            dropdownContainer.appendChild(container);
        });
    },

    _createDropdown: function(forLocation, isForFanfare) {
        let dropdown = dce("select");
        dropdown.id = this._getDropdownId(forLocation);
        dropdown.onchange = function() {
            CurrentSaveData[forLocation] = dropdown.value;
        }

        let defaultOption = dce("option");
        defaultOption.value = "";
        dropdown.appendChild(defaultOption);

        let options = Main.getFlatDataValues(isForFanfare)
        options.forEach(option => {
            let optionElement = dce("option");
            optionElement.value = option;
            optionElement.innerText = option;
            dropdown.appendChild(optionElement);
        });

        return dropdown;
    },

    _getDropdownId: function(locName) {
        return `dropdown|${locName}`;
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
        Object.keys(CurrentSaveData).forEach(locName => {
            let dropdown = document.getElementById(_this._getDropdownId(locName));
            dropdown.value = CurrentSaveData[locName];
        });
    }
};