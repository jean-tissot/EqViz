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
- To set this project (install dependencies): run `make client_set` (or `make cs`)
- To serve this project (for development): run `make client_open` (or `make co`).  
Run `make client_up` (or `make cu`) to serve without opening in browser
- To run unit tests (via [Karma](https://karma-runner.github.io)): run `make client_test`(or `make ct`)
- To build this project: run `make client_build` (or `make cb`)
