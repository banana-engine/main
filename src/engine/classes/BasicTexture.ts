// import: local classes
import { EngineInstance } from 'engine/EngineInstance.js'

// import: local interfaces
import { BasicTextureOptions } from 'engine/interfaces/BasicTextureOptions.js'
import { ImageWrap } from 'engine/interfaces/ImageWrap.js'

// declaration
/**
 * A normal texture, used for drawing colors and images.
 * - It is recommended to create these using `EngineInstance.createTexture(...)`, rather than `new BasicTexture(...)`.
 */
export class BasicTexture {
    // texture data
    image: ImageWrap

    // engine stuff
    parentEngine: EngineInstance
    
    // constructor & methods
    constructor(parentEngine: EngineInstance, options: BasicTextureOptions) {
        if (!(parentEngine instanceof EngineInstance))
            throw new Error(`BasicTexture constructor recieved invalid parent engine!`)
        this.parentEngine = parentEngine
        if (!options.path || typeof options.path !== 'string')
            throw new Error(`BasicTexture constructor called with an invalid image path! Must be of type \'string\', recieved \'${typeof options.path}\'.`)
        this.image = this.parentEngine.loadImageToCache(options.path)
    }
}