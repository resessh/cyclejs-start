#!/usr/bin/env bash

# Clean
mkdir -p public/assets
rm nohup.out 2>/dev/null

# .pug
nohup pug src --out public -w &
pug_pid=$!
trap "kill -15 $pug_pid &>/dev/null" 2 15

# .styl
nohup stylus --use bootstrap-styl -w src/styles/style.styl -o public/assets/style.css &
stylus_pid=$!
trap "kill -15 $stylus_pid &>/dev/null" 2 15

# .ts
nohup watchify -d src/scripts/main.ts \
    -p [ tsify ] \
    -o 'babel --compact true --presets es2015 --plugins transform-es2015-modules-commonjs > public/assets/main.js' &
watchify_pid=$!
trap "kill -15 $watchify_pid &>/dev/null" 2 15

# Server
nohup browser-sync start --config bs-config.js &
browsersync_pid=$!
trap "kill -15 $browsersync_pid &>/dev/null" 2 15

tail -f nohup.out
