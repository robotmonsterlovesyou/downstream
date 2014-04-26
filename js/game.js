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

            this.getCurrentScene()._destory.call(currentScene, this);

        }

        scene._init(this);

        return this.scenes.push(scene);

    };

    Game.Scene = function (label) {

        this.label = label;

        this._init = function () { return undefined; };
        this._destory = function () { return undefined; };
        this._draw = function (game) { game.stage.clear(); };

    };

    Game.Scene.prototype.init = function (func) {

        if (typeof func === 'function') { this._init = func; }

        return this;

    };

    Game.Scene.prototype.destory = function (func) {

        if (typeof func === 'function') { this._destory = func; }

        return this;

    };

    Game.Scene.prototype.draw = function (func) {

        if (typeof func === 'function') { this._draw = func; }

        return this;

    };

    window.Game = Game;

}());
