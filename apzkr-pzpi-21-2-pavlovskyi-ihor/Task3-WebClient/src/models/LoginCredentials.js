// src/models/LoginCredentials.js
class LoginCredentials {
    constructor(email, password, rememberMe) {
        this.email = email;
        this.password = password;
        this.rememberMe = rememberMe;
    }
}

export default LoginCredentials;