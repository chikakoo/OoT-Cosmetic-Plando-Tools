@echo off

rem Modify this line so it points to your sequence directory
set SequenceFolder=C:\Users\Chika\Documents\Video Games\Nintendo 64\OOT Randomizer\Custom Sequences

set SequenceJs=..\Javascript\Data\rawSequencePaths.js
if exist %SequenceJs% del %SequenceJs%

echo let RawSequencePaths = [>>%SequenceJs%
for /r "%SequenceFolder%" %%f in (*.ootrs) do (
  echo %%f
  echo String.raw`%%f`, >> %SequenceJs%
)
echo ];>>%SequenceJs%

pause