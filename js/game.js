/*jslint browser: true, nomen: true */
/*globals Facade */

(function () {

    'use strict';

    var Game = function () {

        this.scenes = [];

        this.stage = new Facade(document.querySelector('canvas'));

        this.stage.draw(this.callback.bind(this, this.stage));

    };

    Game.prototype.callback = function () {

        var currentScene = this.getCurrentScene();

        if (currentScene) {

            currentScene._draw(this);

        }

    };

    Game.prototype.getCurrentScene = function () {

        if (this.scenes.length) {

            return this.scenes[this.scenes.length - 1];

        }

        return false;

    };

    Game.prototype.popScene = function () {

        var currentScene = this.scenes.pop();

        if (currentScene) {

            currentScene._destory(this);

        }

        currentScene = this.getCurrentScene();

        if (currentScene) {

            currentScene._init(this);

        }

        return this.scenes.length;

    };

    Game.prototype.pushScene = function (scene) {

        var currentScene = this.getCurrentScene();

        if (currentScene) {

            if (!currentScene.pauseState) {

                currentScene.pauseState = document.createElement('img');

            }

            currentScene.pauseState.setAttribute('src', this.stage.exportBase64());

            currentScene._pause(this);

        }

        scene._init(this);

        return this.scenes.push(scene);

    };

    Game.Scene = function (label) {

        this.label = label;

        this._init = function () { return undefined; };
        this._destory = function () { return undefined; };
        this._draw = function (game) { game.stage.clear(); };
        this._pause = function (game) { this.destory().call(this, game); };

    };

    Game.Scene.prototype.init = function (func) {

        if (typeof func === 'function') { this._init = func; }

        return this._init;

    };

    Game.Scene.prototype.destory = function (func) {

        if (typeof func === 'function') { this._destory = func; }

        return this._destory;

    };

    Game.Scene.prototype.draw = function (func) {

        if (typeof func === 'function') { this._draw = func; }

        return this._draw;

    };

    Game.Scene.prototype.pause = function (func) {

        if (typeof func === 'function') { this._pause = func; }

        return this._pause;

    };

    window.Game = Game;

}());
