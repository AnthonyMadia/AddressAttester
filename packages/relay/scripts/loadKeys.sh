#!/bin/sh

rm -rf ./keys

cp -r ../../node_modules/@unirep/circuits/zksnarkBuild/. ./keys

cp -r ../circuits/zksnarkBuild/. ./keys

rm -rf ./keys/*.ptau