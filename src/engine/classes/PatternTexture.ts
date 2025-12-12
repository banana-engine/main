// import: local classes
import { EngineInstance } from 'engine/EngineInstance'

// import: local interfaces
import { ImageWrap } from 'engine/interfaces/ImageWrap'
import { PatternTextureOptions } from 'engine/interfaces/PatternTextureOptions'

// import: local types
import { PatternRepeatMode } from 'engine/types/PatternRepeatMode.js'

// declaration
/**
 * Similar to `BasicTexture` but it's rendered using `CanvasPattern`s.
 */
export class PatternTexture {
    // texture data
    image: ImageWrap
    repeat: PatternRepeatMode

    // engine stuff
    parentEngine: EngineInstance

    // constructor & methods
    constructor(parentEngine: EngineInstance, options: PatternTextureOptions) {
        if (!(parentEngine instanceof EngineInstance))
            throw new Error(`PatternTexture constructor recieved invalid parent engine!`)
        this.parentEngine = parentEngine
        if (!options)
            throw new Error(`PatternTexture requires one paramater: <options>.`)
        if (!options.path || typeof options.path !== 'string')
            throw new Error(`PatternTexture constructor called with an invalid image path! \'options.path\' must be of type \'string\', recieved \'${typeof options.path}\'.`)
        this.image = this.parentEngine.loadImageToCache(options.path)
        if (!['repeat', 'repeat-x', 'repeat-y', 'no-repeat'].includes(options.repeat)) {
            console.warn(`Invalid pattern repeat mode \'%s\'! This PatternTexture will use \'repeat\' by default.`, options.repeat)
            this.repeat = 'repeat'
        } else {
            this.repeat = options.repeat
        }
    }
}