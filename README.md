# OoT Cosmetic Plando Tools
For Ocarina of Time randomizers - provides a way to sort though and filter sequences to select specific ones for a cosmetic plandomizer. 

## Prerequisites
This is set up in a specific way for a specific set of sequences, so it may not be compatible, depending on how your sequences are set up.

The _Scripts/create-raw-sequence-paths.bat_ script has certain assumptions is makes when creating the paths to your sequence files, so it would have to be modified if you'd like it to behave differently:
* Only works with **.ootrs** sequences
* Assumes that each **sequence filename is the same as the name in the meta file**
  * After running the script, you _could_ modify _Javascript/Data/rawSequencePaths.js_ to fix any files that do not meet this criteria

## Setup
* In _Scripts/create-raw-sequence-paths.bat_, change the SequenceFolder variable to point at your sequence directory
* Run _Scripts/create-raw-sequence-paths.bat_ to create _Javascript/Data/rawSequencePaths.js_

## Running the App
* If you don't need a local server, opening _index.html_ in a browser is all you need to do, as it's just a simple html/js site
* If you need to host a local server, run _runApp.bat_ to start a node server (default port is 25565)
  * Change the port in _app.js_ if desired
