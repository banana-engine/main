// import: local classes
import { BasicTexture } from 'engine/classes/BasicTexture.js'
import { Emitter } from 'engine/classes/Emitter.js'
import { GameObject } from 'engine/classes/GameObject.js'
import { PatternTexture } from 'engine/classes/PatternTexture.js'
import { EngineInstance } from 'engine/EngineInstance.js'

// import: local interfaces
import { AnimationModel } from 'engine/interfaces/AnimationModel.js'
import { BasicTextureOptions } from 'engine/interfaces/BasicTextureOptions.js'
import { Camera } from 'engine/interfaces/Camera.js'
import { EngineOptions } from 'engine/interfaces/EngineOptions.js'
import { ImageWrap } from 'engine/interfaces/ImageWrap.js'
import { PatternTextureOptions } from 'engine/interfaces/PatternTextureOptions.js'
import { PatternWrap } from 'engine/interfaces/PatternWrap.js'
import { RenderModel } from 'engine/interfaces/RenderModel.js'
import { Transformation } from 'engine/interfaces/Transformation.js'

// import: local types
import { PatternRepeatMode } from 'engine/types/PatternRepeatMode.js'
import { Texture } from 'engine/types/Texture.js'
import { Vector2 } from 'engine/types/Vector2.js'

// import: local constants
import { blend } from 'engine/modules/util.js'

// jquery check
if (typeof jQuery === 'undefined')
    throw new Error('Banana requires jQuery. Cannot find jQuery.')

// export bridge
export {
    // classes
    BasicTexture,
    GameObject,
    Emitter,
    PatternTexture,
    EngineInstance,

    // interfaces
    AnimationModel,
    BasicTextureOptions,
    Camera,
    EngineOptions,
    ImageWrap,
    RenderModel,
    PatternTextureOptions,
    PatternWrap,
    Transformation,

    // types
    Texture,
    Vector2,

    // constants
    blend
}