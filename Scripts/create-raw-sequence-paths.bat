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

REM Validate that no .ootrs file exists that doesn't match the "Artist - Song" pattern
echo.
echo =================
echo.

setlocal EnableDelayedExpansion
for /r "%SequenceFolder%" %%f in (*.ootrs) do (
    set "name=%%~nxf"

    REM Remove " - " if it exists
    set "check=!name: - =!"

    REM If nothing changed, the pattern was not found
    if "!check!"=="!name!" (
        echo WARNING - .ootrs file found with invalid format: !name!
    )
)

REM Validate that there's no raw .seq file out there, as this usually indicates
REM that the .ootrs file was not actually copied
for /r "%SequenceFolder%" %%f in (*.seq) do (
  echo WARNING - Raw .seq file found: %%~nxf
)

echo.
pause