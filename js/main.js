/*jslint browser: true */
/*globals Game, Facade*/

(function () {

    'use strict';

    var game = new Game(),
        titleScene = new Game.Scene('title'),
        gameScene = new Game.Scene('game');
        // endGameScene = new Game.Scene('end-game'),
        // leaderboardScene = new Game.Scene('leaderboard'),
        // creditsScene = new Game.Scene('credits');

    titleScene.init(function (game) {

        this.assets = {};
        this.methods = {};

        this.assets.title = new Facade.Text('Downstream', {
            y: 150,
            fontFamily: 'Helvetica Neue',
            fontSize: 70,
            fillStyle: '#FCFCFC',
            width: game.stage.width(),
            textAlignment: 'center'
        });

        this.assets.subtitle = new Facade.Text('An Iceberg’s Tale of Adventure', {
            y: 250,
            fontFamily: 'Helvetica Neue',
            fontSize: 24,
            fillStyle: '#FCFCFC',
            width: game.stage.width(),
            textAlignment: 'center'
        });

        this.assets.presstostart = new Facade.Text('Press Any Button To Start', {
            y: 500,
            fontFamily: 'Helvetica Neue',
            fontSize: 24,
            fillStyle: '#FCFCFC',
            width: game.stage.width(),
            textAlignment: 'center'
        });

        this.methods.handlePressToStart = function (e) {

            if (!e.metaKey) {

                game.pushScene(gameScene);

            }

        };

        game.stage.canvas.addEventListener('click', this.methods.handlePressToStart);
        document.addEventListener('keydown', this.methods.handlePressToStart);

    });

    titleScene.destory(function (game) {

        game.stage.canvas.removeEventListener('click', this.methods.handlePressToStart);
        document.removeEventListener('keydown', this.methods.handlePressToStart);

        delete this.assets.title;
        delete this.assets.subtitle;
        delete this.assets.presstostart;

        delete this.methods.handlePressToStart;

        delete this.assets;
        delete this.methods;

    });

    titleScene.draw(function (game) {

        game.stage.clear();

        game.stage.addToStage(this.assets.title);
        game.stage.addToStage(this.assets.subtitle);
        game.stage.addToStage(this.assets.presstostart);

    });

    gameScene.init(function (game) {

        var self = this;

        this.data = {
            keyMapping: { 37: 'left', 38: 'up', 39: 'right', 40: 'down' },
            activeKeys: { left: false, down: false, right: false, up: false }
        };
        this.assets = {};
        this.methods = {};

        this.assets.player = new Facade.Rect({
            x: game.stage.width() / 2,
            y: game.stage.height() - 100,
            width: 100,
            height: 100,
            fillStyle: '#FCFCFC',
            anchor: 'center'
        });

        this.methods.handleKeyPress = function (e) {

            if (Object.keys(self.data.keyMapping).indexOf(String(e.keyCode)) !== -1) {

                e.preventDefault();

                self.data.activeKeys[self.data.keyMapping[e.keyCode]] = true;

            }

        };

        this.methods.handleKeyRelease = function (e) {

            if (Object.keys(self.data.keyMapping).indexOf(String(e.keyCode)) !== -1) {

                e.preventDefault();

                self.data.activeKeys[self.data.keyMapping[e.keyCode]] = false;

            }

        };

        document.addEventListener('keydown', this.methods.handleKeyPress);
        document.addEventListener('keyup', this.methods.handleKeyRelease);

    });

    gameScene.destory(function () {

        delete this.data.keyMapping;
        delete this.data.activeKeys;
        delete this.assets.player;

        delete this.data;
        delete this.assets;

    });

    gameScene.draw(function (game) {

        game.stage.clear();

        if (this.data.activeKeys.up) {

            this.assets.player.setOptions({ y: this.assets.player.getOption('y') - 5 });

        } else if (this.data.activeKeys.down) {

            this.assets.player.setOptions({ y: this.assets.player.getOption('y') + 5 });

        }

        if (this.data.activeKeys.left) {

            this.assets.player.setOptions({ x: this.assets.player.getOption('x') - 5 });

        } else if (this.data.activeKeys.right) {

            this.assets.player.setOptions({ x: this.assets.player.getOption('x') + 5 });

        }

        game.stage.addToStage(this.assets.player);

    });

    game.pushScene(titleScene);

}());
