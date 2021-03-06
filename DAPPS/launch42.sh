#!/bin/bash

# Run this once, but it does not hurt to run it every time
geth --datadir ~/.ethereum/net42 init ~/DAPPS/genesis42.json
# Run this every time you start your Geth "42", and add flags here as you need
geth --datadir ~/.ethereum/net42 --networkid 42 --nousb console
