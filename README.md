# coffee-dashboard-dapp

A DApp based on node.js and genesis ethereum blockchain on the backend side + vue.js as frontend library.

## Setup
The only development dependency of this project is [Node.js](https://nodejs.org) (>= 8 recommended), make sure you have it installed.

Then type in following commands:

```
git clone https://github.com/pierback/coffee-dashboard-dapp 
cd coffee-dashboard-dapp
yarn install
```

## Quickstart
Starts DApp and blockchain concurrently. 

```
yarn start
```

## Development
Open two separate terminal windows/tabs and execute only just one of the following commands in each window regarding given order. (Recommended for debbugging)

```
1. yarn bchain
2. yarn dev
```
The first command starts the blockchain and the second the DApp. 
It's important to start the blockchain first and after that you're ready to go to boot up the DApp. 
If the execution order is switched, the DApp won't be able to connect to the blockchain and will break on start up.

## Structure

```
./src contains the whole frontend, which is based on vue-components
./blockchain contains the genesis ethereum blockchain
./api contains the backend based on node.js & express
```
