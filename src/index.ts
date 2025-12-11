// import: local classes
import { Emitter } from './engine/classes/Emitter.js'
import { GameObject } from './engine/classes/GameObject.js'
import { EngineInstance } from './engine/EngineInstance.js'

// import: local interfaces
import { AnimationModel } from './engine/interfaces/AnimationModel.js'
import { Camera } from './engine/interfaces/Camera.js'
import { ImageWrap } from './engine/interfaces/ImageWrap.js'
import { RenderModel } from './engine/interfaces/RenderModel.js'
import { Transformation } from './engine/interfaces/Transformation.js'

// import: local types
import { Vector2 } from './engine/types/Vector2.js'

// jquery check
if (typeof jQuery === 'undefined')
    throw new Error('Banana requires jQuery. Cannot find jQuery.')

// export bridge
export {
    // classes
    GameObject,
    Emitter,
    EngineInstance,

    // interfaces
    AnimationModel,
    Camera,
    ImageWrap,
    RenderModel,
    Transformation,

    // types
    Vector2
}