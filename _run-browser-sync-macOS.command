#!/bin/bash
CURRENT_DIR=$(dirname $_)
cd $CURRENT_DIR
browser-sync start --server --cors --files="css/*.css, **/*.html"