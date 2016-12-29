all: node_modules calcScore
clean:
	rm calcScore *.hi *.o
	rm -r node_modules
node_modules: package.json
	npm install
calcScore: calcScore.hs
	ghc calcScore.hs -o calcScore
