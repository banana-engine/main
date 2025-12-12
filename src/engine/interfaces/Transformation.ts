// import: local interfaces
import { Vector2 } from 'engine/types/Vector2.js'

// declaration
export interface Transformation {
    position: Vector2
    rotation: number
    scale   : Vector2 | number
}