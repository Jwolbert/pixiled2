export default {
    poisoned: function(gameObject) {
        return {
        effected: {
            alpha: { start: 1, end: 0.2, ease: 'Expo.easeOut' },
            quantity: 1,
            frequency: 200,
            angle: { min: 0, max: 360 },
            // alpha: { min: 0, max: 1 },
            speed: 10,
            // gravityY: 100,
            lifespan: { min: 1500, max: 2000 },
            follow: gameObject,
            // blendMode: 'SCREEN',
            scale: 0.5,
        },
    }},
    chilled: function(gameObject) {
        return {
        effected: {
            alpha: { start: 0.8, end: 0.2, ease: 'Expo.easeOut' },
            quantity: 1,
            frequency: 200,
            angle: { min: 0, max: 360 },
            // alpha: { min: 0, max: 1 },
            speed: 10,
            // gravityY: 100,
            lifespan: { min: 1500, max: 2000 },
            follow: gameObject,
            // blendMode: 'SCREEN',
            // scale: 0.25,
        },
    }},
    vampireBite: function(gameObject) {
        return {
            flight: {
                // alpha: { start: 1, end: 0.5, ease: 'Expo.easeOut' },
                quantity: 0,
                frequency: 200,
                angle: { min: 0, max: 360 },
                // alpha: { min: 0, max: 1 },
                speed: 20,
                // gravityY: 100,
                lifespan: { min: 1500, max: 2000 },
                follow: gameObject,
                // blendMode: 'SCREEN',
                // scale: 0.25,
            },
            explosion: {
                alpha: 0.5,
                quantity: 1,
                frequency: 1,
                angle: { min: 0, max: 360 },
                speed: 0,
                lifespan: { min: 1600, max: 2000 },
                gravityY: 0,
                follow: gameObject,
                // blendMode: 'ADD',
                deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(gameObject?.x, gameObject?.y, 48) },
                maxParticles: 1,
                scale: { start: 0.2, end: 1, ease: 'Expo.easeOut' },
            },
            fizzle: {
                alpha: { start: 0, end: 1, ease: 'Expo.easeOut' },
                quantity: 0,
                frequency: 200,
                angle: { min: 0, max: 360 },
                speed: 0,
                lifespan: { min: 12400, max: 13000 },
                follow: gameObject,
                // blendMode: 'ADD',
                emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 32) },
                deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(gameObject?.x, gameObject?.y, 48) },
                maxParticles: 1,
            },
        }
    },
    slash: function(gameObject) {
        return {
            flight: {
                // alpha: { start: 1, end: 0.5, ease: 'Expo.easeOut' },
                quantity: 0,
                frequency: 200,
                angle: { min: 0, max: 360 },
                // alpha: { min: 0, max: 1 },
                speed: 20,
                // gravityY: 100,
                lifespan: { min: 1500, max: 2000 },
                follow: gameObject,
                // blendMode: 'SCREEN',
                // scale: 0.25,
            },
            explosion: {
                alpha: 0.5,
                quantity: 1,
                frequency: 1,
                angle: { min: 0, max: 360 },
                speed: 0,
                lifespan: { min: 1600, max: 2000 },
                gravityY: 0,
                follow: gameObject,
                // blendMode: 'ADD',
                deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(gameObject?.x, gameObject?.y, 48) },
                maxParticles: 1,
                scale: { start: 0.2, end: 1, ease: 'Expo.easeOut' },
            },
            fizzle: {
                alpha: { start: 0, end: 1, ease: 'Expo.easeOut' },
                quantity: 0,
                frequency: 200,
                angle: { min: 0, max: 360 },
                speed: 0,
                lifespan: { min: 12400, max: 13000 },
                follow: gameObject,
                // blendMode: 'ADD',
                emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 32) },
                deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(gameObject?.x, gameObject?.y, 48) },
                maxParticles: 1,
            },
        }
    },
    bloodOrb: function(gameObject) {
        return {
        flightParticle: [0],
        explosionParticle: [1, 2],
        fizzleParticle: [0],
        flight: {
            // alpha: { start: 1, end: 0.5, ease: 'Expo.easeOut' },
            quantity: 1,
            frequency: 200,
            angle: { min: 0, max: 360 },
            // alpha: { min: 0, max: 1 },
            speed: 20,
            // gravityY: 100,
            lifespan: { min: 1500, max: 2000 },
            follow: gameObject,
            // blendMode: 'SCREEN',
            // scale: 0.25,
            maxParticles: 1,
        },
        explosion: {
            // alpha: { start: 1, end: 0.1, ease: 'Expo.easeOut' },
            quantity: 15,
            frequency: 1,
            angle: { min: 0, max: 360 },
            speed: 200,
            lifespan: { min: 1600, max: 2000 },
            gravityY: 0,
            follow: gameObject,
            // blendMode: 'ADD',
            deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(gameObject?.x, gameObject?.y, 48) },
            maxParticles: 15,
        },
        fizzle: {
            // alpha: { start: 1, end: 0.4, ease: 'Expo.easeOut' },
            quantity: 25,
            frequency: 0,
            angle: { min: 0, max: 360 },
            speed: 30,
            lifespan: { min: 2400, max: 3000 },
            follow: gameObject,
            // blendMode: 'ADD',
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 32) },
            deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(gameObject?.x, gameObject?.y, 48) },
            maxParticles: 25,
        },
    }},
    poisonOrb: function(gameObject) {
        return {
        flight: {
            scale: { start: 0.1, end: 1, ease: 'Expo.easeOut' },
            alpha: { start: 1, end: 0.1, ease: 'Expo.easeOut' },
            quantity: 1,
            frequency: 200,
            angle: { min: 0, max: 360 },
            // alpha: { min: 0, max: 1 },
            speed: 10,
            // gravityY: 100,
            lifespan: { min: 1500, max: 2000 },
            follow: gameObject,
            // blendMode: 'SCREEN',
        },
        explosion: {
            alpha: { start: 1, end: 0.1, ease: 'Expo.easeOut' },
            quantity: 10,
            frequency: 1,
            angle: { min: 0, max: 360 },
            speed: 3,
            lifespan: { min: 1600, max: 2000 },
            gravityY: 0,
            follow: gameObject,
            // blendMode: 'ADD',
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 40) },
            deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(gameObject?.x, gameObject?.y, 48) },
            maxParticles: 10,
        },
        fizzle: {
            scale: { start: 0.1, end: 1, ease: 'Expo.easeOut' },
            alpha: { start: 1, end: 0.1, ease: 'Expo.easeOut' },
            quantity: 2,
            frequency: 200,
            angle: { min: 0, max: 360 },
            speed: 3,
            delay: 50,
            lifespan: { min: 1600, max: 2000 },
            follow: gameObject,
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 40) },
            deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(gameObject?.x, gameObject?.y, 48) },
        },
    }},
    iceOrb: function(gameObject) {
        return {
        flight: {
            // alpha: { start: 1, end: 0.5, ease: 'Expo.easeOut' },
            quantity: 1,
            frequency: 200,
            angle: { min: 0, max: 360 },
            // alpha: { min: 0, max: 1 },
            speed: 20,
            // gravityY: 100,
            lifespan: { min: 1500, max: 2000 },
            follow: gameObject,
            // blendMode: 'SCREEN',
            // scale: 0.25,
        },
        explosion: {
            // alpha: { start: 1, end: 0.1, ease: 'Expo.easeOut' },
            quantity: 15,
            frequency: 1,
            angle: { min: 0, max: 360 },
            speed: 200,
            lifespan: { min: 1600, max: 2000 },
            gravityY: 0,
            follow: gameObject,
            // blendMode: 'ADD',
            deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(gameObject?.x, gameObject?.y, 48) },
            maxParticles: 15,
        },
        fizzle: {
            // alpha: { start: 1, end: 0.4, ease: 'Expo.easeOut' },
            quantity: 40,
            frequency: 0,
            angle: { min: 0, max: 360 },
            speed: 20,
            lifespan: { min: 2400, max: 3000 },
            follow: gameObject,
            // blendMode: 'ADD',
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 32) },
            deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(gameObject?.x, gameObject?.y, 48) },
            maxParticles: 40,
        },
    }},
};