// import: local interfaces
import { Transformation } from './Transformation.js'

// declaration
/**
 * Animation data for a `GameObject`.
 */
export interface AnimationModel {
    name: string
    parts: 
        | Record<string, Transformation>
        | Record<string, Record<string | number, Transformation> >
}