h help default:
	@echo "Use : make [action]" \
	&& echo "Actions:" \
	&& echo " → client_set (alias cs): install angular dependencies" \
	&& echo " → client_up (alias cu): serve the client on http://localhost:4200" \
	&& echo " → client_open (alias co): serve the client and open it in the browser" \
	&& echo " → client_build (alias cb): build the client for prod" \
	&& echo " → client_deploy (alias cd): build and deploy the client to github pages"

client_set cs:
	@echo "Installing angular dependencies..." \
		&& cd eqviz-client && npm install -n

client_up cu:
	@echo "Serving EqViz client on http://localhost:4200..." \
		&& cd eqviz-client && ng serve

client_open co:
	@echo "Serving EqViz client (opening it in browser)..." \
		&& cd eqviz-client && ng serve --open

client_test ct:
	@echo "Running EqViz client unit tests..." \
		&& cd eqviz-client && ng test

client_build cb:
	@echo "Building EqViz client (in builds folder)..." \
		&& cd eqviz-client && ng build

client_deploy cd:
	@echo "Deploying your local EqViz client build on github pages (https://jean-tissot.github.io/EqViz/)..." \
		&& cd eqviz-client && ng deploy --base-href=/EqViz/