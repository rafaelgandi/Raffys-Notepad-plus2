# Bookmark Manager plugin for Notepad++ #
Copyright (C) 2015 ViRuSTriNiTy <cradle-of-mail at gmx.de>

##Screenshot##
![Screenshot.png](https://bitbucket.org/repo/jXX9MB/images/1744991217-Screenshot.png)

## Preamble ##
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.

## Introduction ##
This plugin adds simple bookmark functionality to Notepad++. 
Basically it provides shortcuts for defining / jumping to specific bookmarks as it is incorporated in many RAD tools.

Head for the download section (https://bitbucket.org/ViRuSTriNiTy/nppbookmarkmanager/downloads) to grab the latest build and copy the files from the ZIP archive to the Notepad++ plugin directory (by default this is %ProgramFiles(x86)%\Notepad++\plugins). You should see a new entry named "Bookmark Manager" in the "Plugins" menu after restarting Notepad++.

Feel free to file issues by using the Issue Tracker (https://bitbucket.org/ViRuSTriNiTy/nppbookmarkmanager/issues).

## Dependencies ##

- LodePNG, http://lodev.org/lodepng
- LosaXML, https://bitbucket.org/ViRuSTriNiTy/losaxml

## Changelog ##

### Version 0.1.0.86 ###
- updated about dialog
- fixed location of License.txt & README.md in Notepad++ plugin directory

### Version 0.1.0.84 ###
- fixed issue "The program can't start because libgcc_s_dw2-1.dll is missing from your computer."

### Version 0.1.0.66 ###
- added colorful marker graphics
- fixed bug in bookmark merge handling
- added auto line expanding when go-to bookmark command is executed and the associated line is not visible

### Version 0.1.0.59 ###
- added support for UTF-8 encoded XMLs with Unicode BOM
- enabled indentation in XML file output
- fixed non-visible bookmarks that were placed beyond EOF
- added command to clear bookmarks from current file & all files
- fixed wrong bookmark mapping approach
- added bookmark margin update when file is changed

### Version 0.1.0.0 ###
- initial release