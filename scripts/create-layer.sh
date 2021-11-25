#!/usr/bin/env bash

mkdir -p layer && \
cd layer && \
rm -rf * && \
mkdir nodejs && \
cd nodejs && \
cp ../../package.json ../../yarn.lock . && \
yarn install --production && \
rm package.json yarn.lock && \
cd .. && \
zip -r -q $1 nodejs && \
mv $1 ../ && \
cd .. && \
rm -rf layer && \
echo "OK"
