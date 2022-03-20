# EqViz: Equalisation visualizer

The goal of this project is to make an implementation of [this new visualization of audio data](https://hal.archives-ouvertes.fr/hal-01807481).  
It should contain these features:

- Interactive visualization of audio data (captured by the microphone)
- Visualization of previously recorded sounds (imported or previously saved)
- Recording the audio signal for later analysis
- Export of the recording (webm format for audio, and png for visualization)

This project intents to be a standalone client. A server part could be added in the future.

## Development informations

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.7.  
Project was udpated from angular 12 to **angular 13**, so you need **angular cli version 13**.

### Angular installation
- You need to install NodeJs (you can [download nodejs](https://nodejs.org/en/download/) or install it via the command line interface if you have a packet manager)
- Once installed you should have npm (node package manager) installed too. To check if it is ok you can run `npm -v`. You may need to add npm to the PATH variable environment ([search on Google...](https://www.google.com/search?q=add+npm+to+path)).
- You can now install the Angular-CLI via the `npm i -g @angular/cli` command. To check if it is ok you can run `ng version`. You may need to add it also to the PATH (for example [on windows](https://stackoverflow.com/questions/37991556/ng-is-not-recognized-as-an-internal-or-external-command))
- You should also install make to use shorcut commands defined below (but you can do without it if you want)

### Setting, running, and deploying
- To set this project (install dependencies): run `make client_set` (or `make cs`)
- To serve this project (for development): run `make client_open` (or `make co`).    Run `make client_up` (or `make cu`) to serve without opening in browser
- To run unit tests (via [Karma](https://karma-runner.github.io)): run `make client_test`(or `make ct`)
- To build this project: run `make client_build` (or `make cb`)
- To build and deploy this project to [github pages](https://jean-tissot.github.io/EqViz/) : run `make client_deploy` (or `make cd`)
