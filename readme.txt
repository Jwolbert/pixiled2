1. 'yarn install'
2. make sure webpack is installed.
3. 'yarn dev'
4. 'node app.js'
5. 'node src/server/main.js'
6. navigate your browser to http://localhost:3333/index.html
7. (optional) set debug = true inside of src/scenes/MainScene.js

MainScene.js is the main entry point for the game engine. However, there are some UI and configuration
that is setup inside of src/index.js.

src/server/main.js is the game server.

TODO:
Switch to a more efficient websocket datatype than JSON(this will prolly be a bitch).
Add two layers to the scene, one pure black and one black gradient from center to use with fog of war bitmask.
Add more weapons
Create DB
Implement client auth
Implement concept of rooms(1 room per node process) and redirect clients to rooms whenever they want to join a game

BUGS:
Colors stopped working whenever effects are applied to players
Dagger weapon needs a rework after fireball was added