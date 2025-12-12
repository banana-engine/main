// import: local classes
import { EngineInstance } from 'engine/EngineInstance'

// import: local interfaces
import { ImageWrap } from 'engine/interfaces/ImageWrap';
import { RepeatingTextureOptions } from 'engine/interfaces/RepeatingTextureOptions';

// declaration
/**
 * Similar to `BasicTexture` but it repeats in one or two directions.
 */
export class RepeatingTexture {
    image: ImageWrap
    repeat: 'repeat' | 'repeat-x' | 'repeat-y'

    // engine stuff
    parentEngine: EngineInstance

    constructor(parentEngine: EngineInstance, options: RepeatingTextureOptions) {
        if (!(parentEngine instanceof EngineInstance))
            throw new Error(`RepeatingTexture constructor recieved invalid parent engine!`)
        this.parentEngine = parentEngine
        if (!options)
            throw new Error(`RepeatingTexture requires one paramater: <options>.`)
        if (!options.path)
            throw new Error(`RepeatingTexture constructor called with an invalid image path! Must be of type \'string\', recieved \'${typeof options.path}\'.`)
        this.image = this.parentEngine.loadImageToCache(options.path)
        if (options.repeat !== 'repeat' && options.repeat !== 'repeat-x' && options.repeat !== 'repeat-y') {
            console.warn(`Invalid repeat mode \'%s\'! This RepeatingTexture will use \'repeat\' by default.`, options.repeat)
            this.repeat = 'repeat'
        } else {
            this.repeat = options.repeat
        }
    }
}