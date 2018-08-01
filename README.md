# Tomogotchi
The classical game of tomogotchi
<!-- toc -->

- [Overview](#overview)
- [System Requirements](#installation)
- [How To Play](#getting-started)
- [Commands](#commands)
  * [start](#start)
  * [stop](#stop)
  * [pause](#pause)
  * [resume](#resume)
  * [pet](#pet)
  * [play](#play)
  * [feed](#feed)
  * [get-vitals](#get-vitals)
- [Implementation Details](#implementation details)
- [Unit Test](#unit test)
<!-- tocstop -->

## Overview
- It is a virtual pet game. The game start when a pet is created. 
- The pet goes through infant --> teen --> adult --> old --> heaven
- Everyday it needs play time and feeding time
- It follows daily routine of Sitting idle --> Pooping --> Sleeping
- Enjoy

## System Requirements
- node
- yarn/ npm

## How To Play
- `yarn install`
- `yarn run start`
- `tomogotchi` prompt appears
- `start`
- `pet <name of pet>`
- `play`
- `feed`
- Auto complete feature is on
- Type help anytime to see available commands
- `exit` To exit the app

## Commands

### start
This is like starting the clock of life. Pet cannot be created without starting the clock.

### pause
You can pause the game with it when it gets too hot.

### resume
Resume the game if it is paused

### pet
```
pet <name>
```
Creates the pet with that name

### play
Play with pet. Increases happiness. Increases hunger. Cannot play when sleeping

### feed
Feed the pet. Increases happiness. Decreases hunger. Cannot feed when sleeping

### get-vitals
Check the vitals (hunger, happiness) of the pet

## Implementation Details
- Vorpal is used for cli farmework
- Architecture is such that states, action, etc. can be extended easily
- Everything is as much decoupled as possible.
- Can be easily extended to multiple pets at the same time.
- Can be extended to become a RESTful app by swapping the ui.js
- All configurations are in config.js

## Unit Test
```
yarn run test
```
**Warning**: In unit test, there is a pending promise problem. It has to be resolved. But testcases run fine.
