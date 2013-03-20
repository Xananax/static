IN = .
OUT = $(IN)/out
CONFIG = $(IN)/config
PORT = 8888
NODE_BIN = ./node_modules/.bin

all: clean html css js

debug: clean html-debug css-debug js-debug

watch: clean html-watch css-watch js-watch serve

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

js: js-statics
	@echo "compressing js files"
	@$(NODE_BIN)/r.js -o mainConfigFile=main.js name=main out=$(OUT)/main.js optimize=uglify2

js-debug: js-statics
	@echo "copying all js files to target directory"
	@rsync -avm --include='*.js' -f 'hide,! */' . $(OUT)  --exclude 'components/' --exclude 'node_modules/'
	##@find . \( -name node_modules -o -name components \) -prune -o -name "*.js" | cpio -pdm $(OUT)
	@mkdir -p $(OUT)/components/jquery
	@cp components/jquery/jquery.js $(OUT)/components/jquery/jquery.js

js-watch: js-debug
	##@find . \( -name node_modules -o -name components \) -prune -o -name "*.js" -execdir ln -s out/{}

js-statics: build-dirs
	@echo "copying requirejs"
	@cp components/requirejs/require.js $(OUT)/components/requirejs/require.js

js-clean:
	echo "cleaning out js files"
	@rm $(OUT)/*.js ||:
	@rm $(OUT)/**/*.js ||:

build-dirs:
	@mkdir -p $(OUT)/components/
	@mkdir -p $(OUT)/components/requirejs
	@mkdir -p $(OUT)/components/jquery

serve:
	node ./serve $(OUT) $(PORT)

clean: html-clean css-clean js-clean

.PHONY: clean serve