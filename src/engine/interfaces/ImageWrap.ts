// declaration
/**
 * Wrapper for the Image constructor.
 * - This is used to cache loaded images.
 */
export interface ImageWrap {
    url: string
    image: HTMLImageElement
    loaded: boolean
}