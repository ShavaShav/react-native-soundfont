#!/usr/bin/env bash

if [ -d "./android/src/main/res/raw" ]; then 
    node ./unpackSounds.js
else 
    echo "Installing sound font libraries, this may take a while..."
    npm install --prefix . --save-dev --quiet 7zip-bin node-7z
    node ./unpackSounds.js
    npm uninstall --quiet 7zip-bin node-7z
fi