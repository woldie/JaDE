#!/bin/bash -e

# JaDE - A roguelike game engine for HTML.
# <br />Copyright (C) 2018  Woldrich, Inc.
#
# <p><a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
#   <img alt="Creative Commons License" style="border-width:0"
#        src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>
#   <br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
#     Creative Commons Attribution-ShareAlike 4.0 International License
#   </a>.

echo Compiling $3

case "$(uname -s)" in
 CYGWIN*|MINGW32*|MSYS*)
 eval $INKLECATE_COMPILER $1 $2 $3
 ;;

 *)
 eval wine start /b /wait /unix $INKLECATE_COMPILER $1 $2 $3
 ;;
esac
