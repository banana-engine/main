// code
export let blend = {
    linear : (a: number, b: number, t: number) => a + (b - a) * t,
    easeIn : (a: number, b: number, t: number) => a + (b - a) * t * t,
    easeOut: (a: number, b: number, t: number) => a + (b - a) * t * (2 - t),
    cubic  : (a: number, b: number, t: number) => a + (b - a) * t * t * (3 - 2 * t)
}