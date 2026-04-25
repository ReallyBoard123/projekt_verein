#!/bin/bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
cd /home/reallyboard/git/projekt_verein/backend
./gradlew bootRun --no-daemon
