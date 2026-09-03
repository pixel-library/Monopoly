#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd /home/rudra/monopoly
npx vite --host 0.0.0.0 --port 3000
