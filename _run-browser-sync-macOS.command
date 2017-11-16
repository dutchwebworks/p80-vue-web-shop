#!/bin/sh
# Run NPM `browser-sync` with static synchronized webserver from the current directory
# And watch & refresh connected browsers when these file-types change
CURRENT_DIR=$(dirname $_)
cd $CURRENT_DIR
browser-sync start --server --cors --files="css/*.css, **/*.html"