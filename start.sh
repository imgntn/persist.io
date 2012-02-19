#!/bin/bash
sudo nodemon -w . -w server/rpc/ -w server/middleware -w client/code/main/ -w client/code/modules/ app.js


