class request {
 

    constructor(code, userEmail, appointmentCode) {
        const pending = 0;
        this._code = code
        this._userEmail = userEmail;
        this._appointmentCode = appointmentCode;
        this._status = pending;
    }

    

    getCode = () => {
        return this._code; 
    }

    getUserEmail = () => {
        return this._userEmail;
    }

    getAppointmentCode = () => {
        return this._appointmentCode;
    }

    getStatus = () => {
        return this._status;
    }

    setCode = (code) => {
        this._code = code;
    }

    setUserEmail = (userEmail) => {
        this._userEmail = userEmail; 
    }

    setAppointmentCode = (appointmentCode) => {
        this._appointmentCode = appointmentCode;
    }

    acceptStatus = () => {
        const accepted = 1;
        this._status = accepted;
    }

    declineStatus = () => { 
        const declined = 2;
        this._status = declined;
    }

    toJSON() {
        const { ...json } = this;
        return json;
      } 





}

module.exports = request;