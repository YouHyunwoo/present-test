class Subject {
    constructor() {
        this.eventListeners = {};
    }

    addEventListener(event, listener) {
        if (!event in this.eventListeners) {
            this.eventListeners[event] = [];
        }

        this.eventListeners[event].push(listener);
    }

    removeEventListener(event, listener) {
        if (event in this.eventListeners) {
            const index = this.eventListeners[event].indexOf(listener);

            if (index >= 0) {
                this.eventListeners[event].splice(index, 1);
            }

            if (this.eventListeners[event].length == 0) {
                delete this.eventListeners[event];
            }
        }
    }

    notify(event, ...args) {
        this.eventListeners[event]?.forEach(listener => {
            listener.update(event);
        });
    }
}

class EventListener {
    update(...args) {}
}