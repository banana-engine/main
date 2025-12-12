// import: local classes
import { PatternTexture } from 'engine/classes/PatternTexture.js';

// declaration
/**
 * Wrapper for textures.
 * - This is used to cache texture canvas patterns.
 */
export interface PatternWrap {
    texture: PatternTexture
    pattern: CanvasPattern
}