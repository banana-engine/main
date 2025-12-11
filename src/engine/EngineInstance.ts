// import: local classes
import { GameObject } from './classes/GameObject.js'
import { Emitter    } from './classes/Emitter.js'

// import: local interfaces
import { Camera } from './interfaces/Camera.js'
import { ImageWrap } from './interfaces/ImageWrap.js'

/**
 * An instance of the Banana engine.  
 * - i think i was hungry when initially naming this package lol  
 * @param parent The element to run the Engine on.
 */
export class EngineInstance extends Emitter {
    canvas     : HTMLCanvasElement
    ctx        : CanvasRenderingContext2D
    gameObjects: GameObject[] = []
    camera     : Camera = { position: [ 0, 0 ], rotation: 0 }
    imageCache : ImageWrap[] = []
    constructor(parent: HTMLElement) {
        // super() - to allow for using methods from `Emitter`, and using `this` in this constructor
        super()

        // create canvas & context
        this.canvas = document.createElement('canvas')
        this.ctx    = this.canvas.getContext('2d')

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
    addGameObject(): GameObject {
        let obj = new GameObject(this)
        this.gameObjects.push(obj)
        return obj
    }
    loadImage(uri: string): ImageWrap {
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
        let imageWrap = {
            url,
            image,
            loaded: false
        }

        // when the image loads...
        $(image).on('load', () => {
            // set the `loaded` property to `true`
            imageWrap.loaded = true
        })

        // add the wrapped image to the cache
        this.imageCache.push(imageWrap)

        // return the wrapped image
        return imageWrap
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