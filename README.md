# OoT Cosmetic Plando Tools
For Ocarina of Time randomizers - provides a way to sort though and filter sequences to select specific ones for a cosmetic plandomizer. 

## Prerequisites
This is set up in a specific way for a specific set of sequences, so it may not be compatible, depending on how your sequences are set up.

The _Scripts/create-raw-sequence-paths.bat_ script has certain assumptions is makes when creating the paths to your sequence files, so it would have to be modified if you'd like it to behave differently:
* Only works with **.ootrs** sequences
* Assumes that each **sequence filename is the same as the name in the meta file**
  * After running the script, you _could_ modify _Javascript/Data/rawSequencePaths.js_ to fix any files that do not meet this criteria

## Setup for Randomizer
This app assumes that several changes was made to the randomizer. These changes do the following:
* Split up songs so that more songs can be heard (e.g. Hyrule Field and Death Mountain Trail would have differents songs)
* Adjust so that songs are heard at night in most areas (with a couple exceptions)

To make these changes make the changes indicated in _Scripts/PY Sequence Changes When Updating_. Not all of them are required for this app - here's a summary of what each part is for:
* Cosmetics.py
  * **OPTIONAL:** The block talking about disabling battle music is to essentially remove the actor in Goron City that adds Lost Woods music when close to that entrance. This music results in two sequences essentially playing at once, which can cause music cut outs. This is why this file also recommends disabling battle music (and puts this change in that block).
  * **REQUIRED:** The next block remaps uncommonly or never heard song sequences to common locations. For example, the Shiek Theme is mapped to Gerudo Training Ground (since it shares its song with Dodongo's Cavern). This results in more unique sequences heard in a seed. This app assumes that these changes are in place when creating the plando file.
  * **OPTIONAL:** The next block adjusts scene values so that songs can play at night - useful if you want to hear your custom sequences more often.
    * If using this, **disable receiving the Weird Egg/Pocket Egg** (recommended to use the Pocket Cucco/Chicken instead), as it will no longer hatch when it transitions from night to day in the overworld.
    * Doing this also disables the sound effect for when it becomes day or night.
    * Note that there's a note in the set of changes dividing the time-passing areas if you don't want to disable those specifically.
    * Does not apply to Lon Lon Ranch or child Hyrule Castle, as to not disrupt Malon's beautiful singing.
  * **OPTIONAL:** The next block disables rain effects in certain siturations so that music isn't interrupted.
    * Lake Hylia as adult, before Morpha is defeated (the rain as you approach the Water Temple)
    * Kakariko as adult, after the Nocturne cutscene when Bongo Bongo isn't defeated
    * Graveyard rain near the Royal Family Tomb, and with the first three medallions when Bongo Bongo isn't defeated
* Music.py
  * **OPTIONAL:** This modifies the cosmetic plando file so that the names match up with the changes in the required section above. Recommended to do this if you look at this log!

## Setup for This App
To let the app know where you sequence files are located.
* In _Scripts/create-raw-sequence-paths.bat_, change the SequenceFolder variable to point at your sequence directory
* Run _Scripts/create-raw-sequence-paths.bat_ to create _Javascript/Data/rawSequencePaths.js_

## Running the App
* If you don't need a local server, opening _index.html_ in a browser is all you need to do, as it's just a simple html/js site
* If you need to host a local server, run _runApp.bat_ to start a node server (default port is 25565)
  * Change the port in _app.js_ if desired
