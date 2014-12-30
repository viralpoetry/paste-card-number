
var JsonFormatter = {
        stringify: function (cipherParams) {
            // create json object with ciphertext
            var jsonObj = {
                ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
            };

            // optionally add iv and salt
            if (cipherParams.iv) {
                jsonObj.iv = cipherParams.iv.toString();
            }
            if (cipherParams.salt) {
                jsonObj.s = cipherParams.salt.toString();
            }

            // stringify json object
            return JSON.stringify(jsonObj);
        },

        parse: function (jsonStr) {
            // parse json string
            var jsonObj = JSON.parse(jsonStr);

            // extract ciphertext from json object, and create cipher params object
            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
            });

            // optionally extract iv and salt
            if (jsonObj.iv) {
                cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
            }
            if (jsonObj.s) {
                cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)
            }

            return cipherParams;
        }
};

function encrypt(password, data) {
    iv  = CryptoJS.lib.WordArray.random(32);
    salt = iv;
    //salt  = CryptoJS.lib.WordArray.random(32);
    key = CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 1000 });
    var encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, format: JsonFormatter });
    return encrypted.toString();
}

function decrypt(password, encrypted_data) {
    //JsonFormatter.parse(encrypted_data);
    encrypted_data = JsonFormatter.parse(encrypted_data);
    salt = encrypted_data.iv;
    key = CryptoJS.PBKDF2(password, salt, { keySize: 256/32, iterations: 1000 });
    var decrypted = CryptoJS.AES.decrypt(encrypted_data, key, {iv: encrypted_data.iv});
    //var decrypted = CryptoJS.AES.decrypt(encrypted_data, key, { iv: iv, format: JsonFormatter });
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
    return decrypted;
}

