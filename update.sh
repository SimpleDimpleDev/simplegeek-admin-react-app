#!/bin/bash

# Run git pull to update the repository
git pull

# Run the build script
./build.sh

# Run the stop script
./stop.sh

# Run the run script
./run.sh

# chmod +x ./update.sh
