#!/bin/bash

set -e

rm -rf ./dist
npx webpack --config webpack.prod.js
sed -E -i.bak 's/"\/style.css"/"\/style.css?'`git rev-parse HEAD`'"/g' dist/*.html
sed -E -i.bak 's/"\/script.js"/"\/script.js?'`git rev-parse HEAD`'"/g' dist/*.html
rm dist/*.bak
rm dist/style.js
