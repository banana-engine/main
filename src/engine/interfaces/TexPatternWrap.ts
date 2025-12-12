// import: local types
import { RepeatingTexture } from 'engine/classes/RepeatingTexture.js';

// declaration
/**
 * Wrapper for textures.
 * - This is used to cache texture canvas patterns.
 */
export interface TexPatternWrap {
    texture: RepeatingTexture
    pattern: CanvasPattern
}