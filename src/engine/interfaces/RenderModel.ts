// import: local classes
import { Vector2 } from 'engine/types/Vector2.js'

// declaration
/**
 * The set of parts & images that is used to render game objects.
 */
export interface RenderModel {
    name: string
    parts: Record<string, {
        /**
         * The position of this image, relative to the position of the current object.
         */
        position: Vector2
        /**
         * The rotation of this image, relative to the rotation of the current object.
         */
        rotation: number
        /**
         * The scale of this image, relative to the scale of the current object.
         */
        scale   : Vector2 | number
        /**
         * The image to use for this part.
         */
        image   : {
            path   : string
            repeat?: 'repeat' | 'repeat-x' | 'repeat-y'
        }
    }>
}