class bus {

    constructor(code, capacity, model) {
        this._code = code
        this._capacity = capacity; 
        this._model = model;
    }

    getCode = () => {
        return this._code; 
    }

    getCapacity = () => {
        return this._capacity;
    }

    getModel = () => {
        return this._model;
    } 

    setCode = (code) => {
        this._code = code;
    }

    setCapacity = (capacity) => {
        this._capacity = capacity; 
    }

    setModel = (model) => {
        this._model = model;
    }

    toJSON() {
        const { ...json } = this;
        return json;
      } 





}

module.exports = bus;