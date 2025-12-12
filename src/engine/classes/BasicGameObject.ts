// import: local classes
import { Emitter } from 'engine/classes/Emitter.js'
import { PatternTexture } from 'engine/classes/PatternTexture.js'
import { EngineInstance } from 'engine/EngineInstance.js'

// import: local interfaces
import { BasicGameObjectOptions } from 'engine/interfaces/BasicGameObjectOptions.js'
import { Transformation } from 'engine/interfaces/Transformation.js'

// import: local types
import { Vector2 } from 'engine/types/Vector2.js'
import { Texture } from 'engine/types/Texture.js'

// code

/**
 * A basic in-game object, with one texture.
 * - It is recommended to create these using `EngineInstance.createBasicGameObject()`, rather than `new BasicGameObject(...)`.
 */
export class BasicGameObject extends Emitter {
    // position, scale rotation, & speed
    position    : Vector2 = [0, 0]
    scale       : Vector2 = [1, 1]
    rotation    : number  = 0
    velocity    : Vector2 = [0, 0]

    // options
    options: BasicGameObjectOptions

    // texture stuff
    texture     : Texture

    // engine stuff
    parentEngine: EngineInstance
    
    // constructor & methods
    constructor(parentEngine: EngineInstance, options?: BasicGameObjectOptions) {
        super()
        if (!(parentEngine instanceof EngineInstance))
            throw new Error(`BasicGameObject constructor recieved invalid parentEngine!`)
        if (!options?.texture?.path || typeof options?.texture?.path !== 'string')
            throw new Error(`BasicGameObject constructor called with an invalid image path! \'options.texture.path\' must be of type \'string\', recieved \'${typeof options?.texture?.path}\'.`)
        this.parentEngine = parentEngine
        this.options = {
            texture: {
                path: options?.texture.path,
                repeat: options?.texture.repeat ?? 'repeat'
            }
        }
        if (options?.texture?.repeat)
            this.texture = this.parentEngine.createPatternTexture({
                path: this.options.texture.path,
                repeat: this.options.texture.repeat
            })
        else
            this.texture = this.parentEngine.createBasicTexture({
                path: this.options.texture.path
            })
    }
    update(dt: number) {
        // update position w/ speed
        this.position[0] += this.velocity[0]
        this.position[1] += this.velocity[1]

        // emit update event to allow for other code being ran every update
        this.emit('update')
    }
    render(ctx: CanvasRenderingContext2D) {
        // skip rendering if no texture is loaded
        if (!this.texture)
            return

        let tex = this.texture
        let img = tex.image

        // edge case check - is the part image loaded?
        if (!img.loaded)
            return

        // get relative position, scale, & rotation
        let transform: Transformation = {
            position: [
                this.position[0] - this.parentEngine.camera.position[0],
                this.position[1] - this.parentEngine.camera.position[1]
            ],
            scale: [
                this.scale[0],
                this.scale[1]
            ],
            rotation: this.rotation * (Math.PI / 180)
        }
        // render
        let width  = img.image.naturalWidth  * transform.scale[0]
        let height = img.image.naturalHeight * transform.scale[1]
        if (transform.rotation == 0) { // if rotation is the default value, render it without saving canvas state
            /* 
                check if the current texture is a `PatternTexture`, 
                if so, use patterns, if not, draw normally
            */
            if (tex instanceof PatternTexture) {
                ctx.fillStyle = this.parentEngine.loadPatternToCache(tex).pattern
                ctx.fillRect(transform.position[0] - width / 2, transform.position[1] - height / 2, width, height)
            } else
                ctx.drawImage(img.image, transform.position[0] - width / 2, transform.position[1] - height / 2, width, height)
        } else { 
            // apply position, & rotation the the object, then render it
            ctx.save() // save the previous canvas state
            transform.position[0] !== 0.0 && transform.position[1] !== 0.0 ? ctx.translate(transform.position[0], transform.position[1]) : void 0
            transform.rotation    !== 0.0                                  ? ctx.rotate(transform.rotation)                              : void 0
            /* 
                check if the current texture is a `PatternTexture`, 
                if so, use patterns, if not, draw normally
            */
            if (tex instanceof PatternTexture) {
                ctx.fillStyle = this.parentEngine.loadPatternToCache(tex).pattern
                ctx.fillRect(0 - width / 2, 0 - height / 2, width, height)
            } else
                // draw the image
                ctx.drawImage(img.image, 0 - width / 2, 0 - height / 2, width, height)
            
            // restore the canvas state back to what it was before
            ctx.restore()
        }

        // emit render event to allow for other code being ran every render cycle
        this.emit('render')
    }
}