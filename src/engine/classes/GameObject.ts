// import: local classes
import { Emitter } from 'engine/classes/Emitter.js'
import { EngineInstance } from 'engine/EngineInstance.js'

// import: local interface
import { RenderModel } from 'engine/interfaces/RenderModel.js'
import { AnimationModel } from 'engine/interfaces/AnimationModel.js'
import { ImageWrap } from 'engine/interfaces/ImageWrap.js'
import { Transformation } from 'engine/interfaces/Transformation.js'

// import: local types
import { Vector2 } from 'engine/types/Vector2.js'

// code
let lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * An in-game object.
 * - It is recommended not to create these using `new GameObject(...)`, but rather `EngineInstance.addGameObject()`.
 */
export class GameObject extends Emitter {
    // position, rotation, & speed
    position        : Vector2 = [0, 0]
    rotation        : number  = 0
    velocity        : Vector2 = [0, 0]

    // engine stuff
    parentEngine    : EngineInstance

    // model stuff
    currentAnimation: string
    currentModel    : string
    models          : Record<string, {
        partImages: Record<string, ImageWrap>
        model: RenderModel
    }> = {}
    animations      : Record<string, {
        time: number
        model: AnimationModel
    }> = {}
    
    // constructor & methods
    constructor(parentEngine: EngineInstance) {
        super()
        if (!(parentEngine instanceof EngineInstance))
            throw new Error('Game object recieved invalid parent engine.')
        this.parentEngine = parentEngine
    }
    loadModel(data: RenderModel) {
        // validate render model
        if (typeof data !== 'object')
            throw new TypeError(`Model data must be of type \'object\'. (typeof data != ${typeof data})`)
        if (!('name' in data))
            throw new TypeError(`The input provided is not a valid RenderModel.`)

        // load render model
        this.models[data.name] = {
            partImages: {},
            model: data
        }
        // add images from the render model
        for (let key in this.models[data.name].model.parts) {
            let part = this.models[data.name].model.parts[key]
            this.models[data.name].partImages[key] = this.parentEngine.loadImage(part.imagePath)
        }
    }
    loadAnimation(data: AnimationModel) {
        // validate animatio
        if (typeof data !== 'object')
            throw new TypeError(`Model data must be of type \'object\'. (typeof data != ${typeof data})`)
        if (!('name' in data))
            throw new TypeError(`The input provided is not a valid AnimationModel.`)

        // load animation
        this.animations[data.name] = {
            time: 0,
            model: data
        }
    }
    applyModel(name: string) {
        // check if there's a model loaded with the specified name
        if (!(name in this.models))
            throw new TypeError(`No animation named \'${name}\` is currently loaded.`)

        // switch models
        this.currentModel = name
    }
    applyAnimation(name: string) {
        // check if there's an animation loaded with the specified name
        if (!(name in this.animations))
            throw new TypeError(`No animation named \'${name}\` is currently loaded.`)

        // switch animation
        this.currentAnimation = name
        this.animations[this.currentAnimation].time = performance.now() / 1000
    }
    getPartOffset(key: string): Transformation {
        let animation = this.animations[this.currentAnimation]?.model
        let animType = Object.keys(animation?.parts[key] ?? {}).every(k => Number.isFinite(Number(k))) ? 1 : 0
        let t = performance.now() / 1000
        
        if (animType === 0)
            // legacy animation type
            return {
                position: [
                    animation?.parts[key]?.position[0] ?? 0,
                    animation?.parts[key]?.position[1] ?? 0
                ],
                rotation: (animation?.parts[key]?.rotation ?? 0) as number,
                scale: [
                    animation?.parts[key]?.scale[0] ?? animation?.parts[key]?.scale ?? 1.0,
                    animation?.parts[key]?.scale[1] ?? animation?.parts[key]?.scale ?? 1.0
                ]
            }
        else if (animType === 1) {
            // new animation type
            // get all values in time
            let keys          = Object.keys(animation?.parts[key]).sort((a, b) => Number.parseFloat(a) - Number.parseFloat(b))
            let time          = t % Number.parseFloat(keys[keys.length - 1])

            // get current & next index
            let currentIndex  = keys.findLastIndex(k => Number.parseFloat(k) <= time)
            let nextIndex     = currentIndex + 1

            // get the keys for the current & next index
            let current       = keys[currentIndex]
            let next          = keys[nextIndex   ] ?? keys[0]

            // get the time values for the current & next index
            let currentNumber = Number.parseFloat(keys[currentIndex]           )
            let nextNumber    = Number.parseFloat(keys[nextIndex   ] ?? keys[0])

            // get the part data for the current & next index
            let currentPart   = animation?.parts[key][current]
            let nextPart      = animation?.parts[key][next   ]

            // get the interpolation value
            let interp        = (time - currentNumber) / (nextNumber - currentNumber)

            // get the position, scale, and rotation w/ interpolation
            let final: Transformation = {
                position: [
                    lerp(currentPart.position[0], nextPart.position[0], interp),
                    lerp(currentPart.position[1], nextPart.position[1], interp)
                ],
                rotation: lerp(currentPart.rotation, nextPart.rotation, interp),
                scale: [
                    lerp(currentPart.scale[0], nextPart.scale[0], interp),
                    lerp(currentPart.scale[1], nextPart.scale[1], interp)
                ]
            }

            // if scaleX and scaleY are equal, compress it to one number
            if (final.scale[0] === final.scale[1])
                final.scale = final.scale[0]

            // return the final output
            return final
        }
    }
    update(dt: number) {
        // update position w/ speed
        this.position[0] += this.velocity[0]
        this.position[1] += this.velocity[1]

        // emit update event to allow for other code being ran every update
        this.emit('update')
    }
    render(ctx: CanvasRenderingContext2D) {
        // skip rendering if no model is loaded
        if (!this.models[this.currentModel])
            return

        // get model & animation data
        let { model }      = this.models[this.currentModel]
        let { partImages } = this.models[this.currentModel]
        let animation  = this.animations[this.currentAnimation]?.model

        // calculate & draw
        for (let key in model.parts) {
            // get part data & image data
            let part = model.parts[key]
            let img  = partImages[key]

            // edge case check - is `part` or `img` defined?
            if (!part || !img)
                continue

            // edge case check - is the part image loaded?
            if (!img.loaded)
                continue

            // calculate part positions
            var partAnimated: Transformation
            if (animation) {
                partAnimated = this.getPartOffset(key)
            } else {
                partAnimated = {
                    position: [0, 0],
                    rotation: 0,
                    scale: [1, 1]
                }
            }

            // get relative position, scale, & rotation
            let transform: Transformation = {
                position: [
                    this.position[0] + part.position[0] + partAnimated.position[0] - this.parentEngine.camera.position[0],
                    this.position[1] + part.position[1] + partAnimated.position[1] - this.parentEngine.camera.position[1]
                ],
                scale: [
                    (part.scale[0] ?? part.scale) * (partAnimated.scale[0] ?? partAnimated.scale),
                    (part.scale[1] ?? part.scale) * (partAnimated.scale[1] ?? partAnimated.scale)
                ],
                rotation: (this.rotation + part.rotation + partAnimated.rotation) * (Math.PI / 180)
            }
            // render
            if (transform.rotation == 0) { // if rotation is the default value, render it without saving canvas state
                let width  = img.image.naturalWidth  * transform.scale[0]
                let height = img.image.naturalHeight * transform.scale[1]
                ctx.drawImage(img.image, transform.position[0] - width / 2, transform.position[1] - height / 2, width, height)
            } else {
                // apply position, scale, and rotation the the object, then render it
                ctx.save()
                transform.position[0] !== 0.0 && transform.position[1] !== 0.0 ? ctx.translate(transform.position[0], transform.position[1]) : void 0
                transform.scale   [0] !== 1.0 && transform.scale   [1] !== 1.0 ? ctx.scale(transform.scale[0], transform.scale[1])           : void 0
                transform.rotation    !== 0.0                                  ? ctx.rotate(transform.rotation)                              : void 0
                ctx.drawImage(img.image, 0 - img.image.naturalWidth / 2, 0 - img.image.naturalHeight / 2, img.image.naturalWidth, img.image.naturalHeight)
                ctx.restore()
            }
        }

        // emit render event to allow for other code being ran every render cycle
        this.emit('render')
    }
}