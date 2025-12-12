// import: local classes
import { GameObject } from 'engine/classes/GameObject.js'
import { Emitter } from 'engine/classes/Emitter.js'
import { BasicTexture } from 'engine/classes/BasicTexture.js'
import { PatternTexture } from 'engine/classes/PatternTexture.js'

// import: local interfaces
import { Camera } from 'engine/interfaces/Camera.js'
import { ImageWrap } from 'engine/interfaces/ImageWrap.js'
import { EngineOptions } from 'engine/interfaces/EngineOptions.js'
import { BasicTextureOptions } from 'engine/interfaces/BasicTextureOptions.js'
import { PatternTextureOptions } from 'engine/interfaces/PatternTextureOptions.js'
import { PatternWrap } from './interfaces/PatternWrap.js'

/**
 * An instance of the Banana engine.  
 * - i think i was hungry when initially naming this package lol  
 * @param parent The element to run the Engine on.
 */
export class EngineInstance extends Emitter {
    canvas      : HTMLCanvasElement
    ctx         : CanvasRenderingContext2D
    gameObjects : GameObject[] = []
    camera      : Camera = { position: [ 0, 0 ], rotation: 0 }
    imageCache  : ImageWrap[] = []
    patternCache: PatternWrap[] = []
    options     : EngineOptions
    constructor(parent: HTMLElement, options?: EngineOptions) {
        // super() - to allow for using methods from `Emitter`, and using `this` in this constructor
        super()

        // handle engine options
        this.options = {
            debugMode: options.debugMode ?? false
        }

        // create canvas & context
        this.canvas = document.createElement('canvas')
        this.ctx    = this.canvas.getContext('2d', {
            colorType: 'float16'
        }) as CanvasRenderingContext2D

        // resize the canvas
        this.canvas.width  = innerWidth
        this.canvas.height = innerHeight

        // take in account the window resising
        $(window).on('resize', () => {
            // resize the canvas again
            this.canvas.width  = innerWidth
            this.canvas.height = innerHeight
        })

        // append canvas to parent element
        $(parent).append(this.canvas)
    }
    /**
     * Starts the game engine.
     */
    start(): void {
        let dt = 0
        let last = performance.now()
        let loop = () => {
            this.#update(dt)
            let now = performance.now()
            dt = (now - last) / 1000
            last = now
            requestAnimationFrame(loop)
        }
        loop()
    }
    /**
     * Creates a `GameObject`, and returns that object.
     * @returns The newly created `GameObject`.
     */
    createGameObject(): GameObject {
        // create GameObject
        let obj = new GameObject(this)

        // add it to the list of objects
        this.gameObjects.push(obj)

        // debug mode: log when the object is created
        if (this.options.debugMode)
            console.log(`Game object created! - %c${this.gameObjects.length}%c game object${this.gameObjects.length === 1 ? '' : 's'}`, `
                color: #00ff00;
            `, '')

        // returns the newly created GameObject
        return obj
    }
    createBasicTexture(options: BasicTextureOptions) {
        // create BasicTexture
        let obj = new BasicTexture(this, options)

        // debug mode: log when the object is created
        if (this.options.debugMode)
            console.log(`BasicTexture created!`)

        // returns the newly created BasicTexture
        return obj
    }
    createPatternTexture(options: PatternTextureOptions) {
        // create PatternTexture
        let obj = new PatternTexture(this, options)

        // debug mode: log when the object is created
        if (this.options.debugMode)
            console.log(`PatternTexture created!`)

        // returns the newly created PatternTexture
        return obj
    }
    /**
     * Loads an image into the `imageCache`, and returns said image.
     * - If the image is already in the cache, it'll return that image.
     * @param uri The URL to the image.
     * @returns The cached image.
     */
    loadImageToCache(uri: string): ImageWrap {
        // format url
        let url = URL.canParse(uri) 
            ? new URL(uri).href
            : uri
        
        /*
            if an image with this URL has already been loaded,
            don't create a new one; instead, return the existing image
        */
        let existing = this.imageCache.find(image => image.url === url)
        if (existing)
            return existing
        
        // create image element
        let image = new Image()
            image.src = url

        // wrap the image in an object
        let imageWrap: ImageWrap = {
            url,
            image,
            loaded: false
        }

        // when the image loads...
        $(image).on('load', () => {
            // set the `loaded` property to `true`
            imageWrap.loaded = true

            // debug mode: log when the image is loaded
            if (this.options.debugMode)
                console.log(`Image loaded to cache! - %c${url}%c | %c${this.imageCache.filter(i => i.loaded).length}%c images${this.imageCache.filter(i => i.loaded).length === 1 ? '' : 's'} loaded`, `
                    color: #00ffff;
                    font-style: italic
                `, '', `
                    color: #00ff00;
                `, '')
        })

        // add the wrapped image to the cache
        this.imageCache.push(imageWrap)

        // return the wrapped image
        return imageWrap
    }
    /**
     * Loads the canvas pattern for a `PatternTexture` into the `patternCache`.
     * - If the pattern is already in the cache, it'll return that pattern.
     * @param texture The texture to load the pattern for.
     */
    loadPatternToCache(texture: PatternTexture) {
        /*
            if the pattern for this texture has already been loaded,
            don't create a new one; instead, return the existing pattern
        */
        let existing = this.patternCache.find(pattern => pattern.texture === texture)
        if (existing)
            return existing
        
        // create pattern
        let pattern = this.ctx.createPattern(texture.image.image, texture.repeat)

        // wrap the pattern in an object
        let patternWrap: PatternWrap = {
            texture,
            pattern
        }

        // debug mode: log when the pattern is loaded into the cache
        if (this.options.debugMode)
            console.log(`Pattern loaded to cache! - %c${this.patternCache.length}%c pattern${this.patternCache.length === 1 ? '' : 's'} loaded`, `
                color: #00ff00;
            `, '')

        // add the wrapped pattern to the cache
        this.patternCache.push(patternWrap)

        // return the wrapped pattern
        return patternWrap
    }
    #update(dt: number): void {
        // clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // render every game object
        for (let object of this.gameObjects) {
            object.update(dt)
            object.render(this.ctx)
        }

        // emit update event to allow for other code being ran every update
        this.emit('update')
    }
}