#!/bin/bash

cp .env.example .env
nano .env
yarn install
npm start
