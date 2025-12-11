// code
/**
 * A constructor used to create systems similar to Node's `EventEmitter`.
 */
export class Emitter {
    #events: Record<string, ((...args: any[]) => any)[]> = {}
    /**
     * Add a listener for an event.
     * @param eventName The event name to listener,
     * @param listener The listener to add.
     * @returns Whether the listener was succesfully added or not.
     */
    on(eventName: string, listener: () => any): boolean {
        if (!(eventName in this.#events)) this.#events[eventName] = []
        this.#events[eventName].push(listener)
        return true
    }
    /**
     * Remove a listener for an event.
     * @param eventName The event name to remove a listener for.
     * @param listener The listener to remove.
     * @returns Whether the listener was succesfully removed or not.
     */
    off(eventName: string, listener: () => any): boolean {
        if (!(eventName in this.#events)) return
        let fns = this.#events[eventName]
        if (fns.length < 1) return false
        fns.splice(this.#events[eventName].indexOf(listener), 1)
        if (fns.length < 1)
            delete this.#events[eventName]
        return true
    }
    /**
     * Emit an event.
     * @param eventName The event name to emit.
     * @param args The arguments that come with this event.
     * @returns Whether the event was succesfully emitted or not.
     */
    emit(eventName: string, ...args: any[]): boolean {
        if (!(eventName in this.#events)) return false
        let fns = this.#events[eventName]
        if (fns.length < 1) return false
        for (let i = 0; i < fns.length; i++) 
            fns[i]?.(...args)
        return true
    }
}