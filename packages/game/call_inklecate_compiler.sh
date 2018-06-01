#!/bin/sh -e

case "$(uname -s)" in
 CYGWIN*|MINGW32*|MSYS*)
 eval $INKLECATE_COMPILER $1 $2 $3
 ;;

 *)
 eval wine start /b /wait /unix $INKLECATE_COMPILER $1 $2 $3
 ;;
esac

