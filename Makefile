IN = .
OUT = $(IN)/out
CONFIG = $(IN)/config
PORT = 8888
NODE_BIN = ./node_modules/.bin

all: clean html css js images

debug: clean html-debug css-debug js-debug images

watch: clean html-watch css-watch js-watch images serve

html:
	@echo "compiling minified html"
	@$(NODE_BIN)/jade $(IN)/index.jade --out $(OUT) --obj $(CONFIG)/config.js --no-debug --path $(IN)

html-debug:
	@echo "compiling html (no minification)"
	$(NODE_BIN)/jade $(IN)/index.jade --out $(OUT) --obj $(CONFIG)/config.js --path $(IN) --pretty

html-watch:
	@echo "watching html for changes"
	$(NODE_BIN)/jade $(IN)/index.jade --out $(OUT) --obj $(CONFIG)/config.js --watch --path $(IN) --pretty&

html-clean:
	@echo "cleaning out html files"
	@rm $(OUT)/*.html ||:

html-client:
	$(NODE_BIN)/clientjade $(IN)/thumb/thumb.jade > $(IN)/templates.js

css:
	@echo "compiling minified css"
	@$(NODE_BIN)/stylus --out $(OUT) $(IN)/styles.styl

css-debug:
	@echo "compiling css (no minification)"
	@$(NODE_BIN)/stylus --out $(OUT) --line-numbers $(IN)/styles.styl

css-watch:
	@echo "watching css for changes"
	$(NODE_BIN)/stylus --out $(OUT) --line-numbers --watch $(IN)/styles.styl&

css-clean:
	@echo "cleaning out css files"
	@rm $(OUT)/*.css ||:

js: js-statics html-client
	@echo "compressing js files"
	@$(NODE_BIN)/r.js -o mainConfigFile=main.js name=main out=$(OUT)/main.js optimize=uglify2

js-debug: js-statics html-client
	@echo "copying all js files to target directory"
	@rsync -avm --include='*.js' -f 'hide,! */' . $(OUT)  --exclude 'components/' --exclude 'node_modules/'
	##@find . \( -name node_modules -o -name components \) -prune -o -name "*.js" | cpio -pdm $(OUT)
	@mkdir -p $(OUT)/components/jquery
	@cp components/jquery/jquery.js $(OUT)/components/jquery/jquery.js

js-watch: html-client 
	ln -s ../components ../third-party ../js ../bootstrap ../main.js ../templates.js -t $(OUT)

js-statics: build-dirs
	@echo "copying requirejs"
	@cp components/requirejs/require.js $(OUT)/components/requirejs/require.js

js-clean:
	echo "cleaning out js files"
	@rm -r $(OUT)/components ||:
	@rm -r $(OUT)/third-party ||:
	@rm -r $(OUT)/js ||:
	@rm -r $(OUT)/bootstrap ||:
	@rm $(OUT)/*.js ||:
	@rm -r $(OUT)/**/*.js ||:

serve:
	node ./serve $(OUT) $(PORT)

clean: html-clean css-clean js-clean images-clean

build-dirs:
	@mkdir -p $(OUT)/components/
	@mkdir -p $(OUT)/components/requirejs
	@mkdir -p $(OUT)/components/jquery

images:
	cp -r $(IN)/images $(OUT)

images-clean:
	echo "cleaning out images"
	@rm -r $(OUT)/images ||:

.PHONY: clean serve images
