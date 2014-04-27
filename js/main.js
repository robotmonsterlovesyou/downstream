/*jslint browser: true */
/*globals Game, Facade*/

(function () {

    'use strict';

    var game = new Game(),
        titleScene = new Game.Scene('title'),
        gameScene = new Game.Scene('game'),
        pauseScene = new Game.Scene('pause');
        // endGameScene = new Game.Scene('end-game'),
        // leaderboardScene = new Game.Scene('leaderboard'),
        // creditsScene = new Game.Scene('credits');

    function checkCollision(a, b) {

        var test = false;

        if (a && !(a instanceof SAT.Box)) { a = setVector(a); }
        if (b && !(b instanceof SAT.Box)) { b = setVector(b); }

        if (a instanceof SAT.Vector && b instanceof SAT.Box) {

            test = SAT.pointInPolygon(a, b.toPolygon());

        } else if (b instanceof SAT.Vector && a instanceof SAT.Box) {

            test = SAT.pointInPolygon(b, a.toPolygon());

        } else if (a instanceof SAT.Box && b instanceof SAT.Box) {

            test = SAT.testPolygonPolygon(a.toPolygon(), b.toPolygon());

        }

        return test;

    }

    function setVector(obj) {

        var vector;

        if (obj.x !== 'undefined' && typeof obj.x !== 'undefined') {

            vector = new SAT.Vector(obj.x, obj.y);

            if (typeof obj.width !== 'undefined' && typeof obj.height !== 'undefined') {

                vector = new SAT.Box(vector, obj.width, obj.height);

            }

        }

        return vector;

    }

    function setEntityVector(entity) {

        var metrics = entity.getAllMetrics();

        entity.__vector = setVector(metrics);

        return entity.__vector;

    }

    function getEntityVector(entity) {

        if (typeof entity.__vector === 'undefined') {

            setEntityVector(entity);

        }

        return entity.__vector;

    }

    titleScene.init(function (game) {

        if (!this.assets && !this.methods) {

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

                    e.preventDefault();

                    game.pushScene(gameScene);

                }

            };

        }

        game.stage.canvas.addEventListener('click', this.methods.handlePressToStart);
        document.addEventListener('keydown', this.methods.handlePressToStart);

    });

    titleScene.destory(function (game) {

        game.stage.canvas.removeEventListener('click', this.methods.handlePressToStart);
        document.removeEventListener('keydown', this.methods.handlePressToStart);

    });

    titleScene.pause(function (game) {

        titleScene.destory().call(this, game);

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
            keyMapping: { 37: 'left', 38: 'up', 39: 'right', 40: 'down', 27: 'escape' },
            activeKeys: { left: false, down: false, right: false, up: false, escape: false }
        };

        if (!this.assets && !this.methods) {

            this.assets = {};
            this.methods = {};

            this.assets.player = new Facade.Rect({
                x: game.stage.width() / 2,
                y: game.stage.height() - 100,
                width: 65,
                height: 65,
                fillStyle: '#FCFCFC',
                anchor: 'center'
            });

            this.methods.handleKeyInteraction = function (e) {

                if (!e.metaKey && Object.keys(self.data.keyMapping).indexOf(String(e.keyCode)) !== -1) {

                    e.preventDefault();

                    if (e.type === 'keydown') {

                        self.data.activeKeys[self.data.keyMapping[e.keyCode]] = true;

                    } else if (e.type === 'keyup') {

                        self.data.activeKeys[self.data.keyMapping[e.keyCode]] = false;

                    }

                }

            };

            this.methods.handleWindowBlur = function () {

                game.pushScene(pauseScene);

            };

        }

        document.addEventListener('keydown', this.methods.handleKeyInteraction);
        document.addEventListener('keyup', this.methods.handleKeyInteraction);

        window.addEventListener('blur', this.methods.handleWindowBlur);

    });

    gameScene.destory(function (game) {

        document.removeEventListener('keydown', this.methods.handleKeyInteraction);
        document.removeEventListener('keyup', this.methods.handleKeyInteraction);

        window.removeEventListener('blur', this.methods.handleWindowBlur);

    });

    gameScene.pause(function (game) {

        gameScene.destory().call(this, game);

    });

    gameScene.draw(function (game) {

        if (this.data.activeKeys.escape) {

            game.pushScene(pauseScene);

            this.data.activeKeys.escape = false;

        }

        game.stage.clear();

        if (this.data.activeKeys.left) {

            this.assets.player.setOptions({ x: this.assets.player.getOption('x') - 2 });

            setEntityVector(this.assets.player);

        } else if (this.data.activeKeys.right) {

            this.assets.player.setOptions({ x: this.assets.player.getOption('x') + 2 });

            setEntityVector(this.assets.player);

        }

        game.stage.addToStage(this.assets.player);

    });

    pauseScene.init(function (game) {

        if (!this.assets && !this.methods) {

            this.assets = {};
            this.methods = {};

            this.assets.pause = new Facade.Text('PAUSE', {
                y: 150,
                fontFamily: 'Helvetica Neue',
                fontSize: 70,
                fillStyle: '#FCFCFC',
                width: game.stage.width(),
                textAlignment: 'center'
            });

        }

        document.addEventListener('keydown', gameScene.methods.handleKeyInteraction);

    });

    pauseScene.draw(function (game) {

        if (gameScene.data.activeKeys.escape) {

            game.popScene();

            gameScene.data.activeKeys.escape = false;

        }

        game.stage.clear();

        if (gameScene.pauseState.complete) {

            game.stage.context.save();

            game.stage.context.globalAlpha = 0.1;

            game.stage.context.drawImage(gameScene.pauseState, 0, 0);

            game.stage.context.restore();

        }

        game.stage.addToStage(this.assets.pause);

    });

    pauseScene.destory(function (game) {

        document.removeEventListener('keydown', gameScene.methods.handleKeyInteraction);

    });

    game.pushScene(gameScene);

}());
