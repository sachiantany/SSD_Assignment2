import forge from "node-forge";

let pki = forge.pki;
// assuming you have a private.key file that begins with '-----BEGIN RSA PRIVATE KEY-----...'

sessionStorage.setItem("publicKey", loadRsaPublicKeyPem());
sessionStorage.setItem("privateKey", loadRsaPrivateKeyPem());


export function encryptData(publicKey, plaintext) {
    // generate random key
    let encryptionKey = generateRandomAesKey();
    //console.log(forge.util.bytesToHex(encryptionKey));
    // encrypt plaintext
    let ciphertextBase64 = aesGcmEncryptToBase64(encryptionKey, plaintext);
    // encrypt the aes encryption key with the rsa public key
    let encryptionKeyBase64 = rsaEncryptionOaepSha1(publicKey, encryptionKey);
    return encryptionKeyBase64 + ':' + ciphertextBase64;
}

export function decryptData(privateKey, completeCiphertext) {
    let dataSplit = completeCiphertext.split(":");
    let encryptionKeyReceived = base64Decoding(dataSplit[0]);
    let nonce = base64Decoding(dataSplit[1]);
    let ciphertext = base64Decoding(dataSplit[2]);
    let gcmTag = base64Decoding(dataSplit[3]);
    // decrypt the encryption key with the rsa private key
    let decryptionKey = rsaDecryptionOaepSha1(privateKey, encryptionKeyReceived);
    return aesGcmDecrypt(decryptionKey, nonce, ciphertext, gcmTag);
}

function aesGcmEncryptToBase64(key, data) {
    let nonce = generateRandomNonce();
    let cipher = forge.cipher.createCipher('AES-GCM', key);
    cipher.start({
        iv: nonce,
        tagLength: 128 // optional, defaults to 128 bits});
    });
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(data)));
    cipher.finish();
    let encrypted = cipher.output;
    let nonceBase64 = base64Encoding(nonce);
    let gcmTagBase64 = base64Encoding(cipher.mode.tag.data);
    let encryptedBase64 = base64Encoding(encrypted.getBytes());
    return nonceBase64 + ':' + encryptedBase64 + ':' + gcmTagBase64;
}

function aesGcmDecrypt(key, nonce, ciphertext, gcmTag) {
    let decCipher = forge.cipher.createDecipher('AES-GCM', key);
    decCipher.start({
        iv: nonce,
        tagLength: 128, // optional, defaults to 128 bits});
        tag: gcmTag // authentication tag from encryption
    });
    decCipher.update(forge.util.createBuffer(ciphertext));
    decCipher.finish();
    let aesDec = decCipher.output;
    return forge.util.decodeUtf8(aesDec);
}

function generateRandomAesKey() {
    return forge.random.getBytesSync(32);
}

function generateRandomNonce() {
    return forge.random.getBytesSync(12);
}

function rsaEncryptionOaepSha1(publicKeyPem, plaintext) {
    let publicKey = pki.publicKeyFromPem(publicKeyPem);
    let encrypted = publicKey.encrypt(plaintext, 'RSA-OAEP', {
        md: forge.md.sha1.create(),
        mgf1: {
            md: forge.md.sha1.create()
        }
    });
    return base64Encoding(encrypted);
}

function rsaDecryptionOaepSha1(privateKeyPem, ciphertext) {
    let privateKey = pki.privateKeyFromPem(privateKeyPem);
    let decrypted = privateKey.decrypt(ciphertext, 'RSA-OAEP', {
        md: forge.md.sha1.create(),
        mgf1: {
            md: forge.md.sha1.create()
        }
    });
    return decrypted.toString('utf8')
}

function base64Encoding(input) {
    return forge.util.encode64(input);
}

function base64Decoding(input) {
    return forge.util.decode64(input);
}

function loadRsaPrivateKeyPem() {
    // important last crlf
    return '-----BEGIN RSA PRIVATE KEY-----\n' +
        'MIIEogIBAAKCAQEAlp1CPeULNSRX2cDQXZLPU2vaclFnBLgq73CzieJwZzGM6HsN\n' +
        'przf4/GBcf2RmnSchzfKiuQ6WrO4E4qZzAkv7sn42UWwF2RtarOi15CvUJrQ6oyd\n' +
        'Z1+zyq71Tr/jOhpJ8+U6ht3ZJo5aOZNfXZBOfe30WW1WLUgSDeUl8joX+0fZ7tD+\n' +
        '+6G9Jw6m7+umtlQQEDxDa+VV8d5hBjGBFfhaiGnUb2iR8PZdTUWEcQ7T3Il215P3\n' +
        'm+HzZlCrwbdJNVCvGxZSLBUDxbhIOJmdPwS6RseciwRcDIcLLQR3k3y4nn6ZcdYk\n' +
        'mqP0Vgw1RFNBDDntw7nkkp55IjSPFOKvhMzDYQIDAQABAoIBAADQRKVU8WSOF7Nj\n' +
        'aTy4KEqJEJsBeY7697BnaXDbOkQ0blBrKb2203bFvS9CcWDmNFo+oOdzKCWJRvtE\n' +
        'CmShwBKIIMH7sGHP9w9WfRCxBWFoFKzPqaH/UFdN7qFIRA/ySGf62wATfrLInhAl\n' +
        'jaRRvTrM6D77ajXAZ+iPTk8qpSqETK25u2X+NMDJHwrn3Y3oCNPd9zOli+q46B9Z\n' +
        'wbkQCs3DiVfMc4HMC5poNIAETggqdR/o8Ut4vQV+5F1t3DEq+pEUzwTMlZDq4Xk9\n' +
        'QNc0wAfX2MdUZBy1Lshr5rSg//dTQMzo2Ny8eQJ/2k1S9l/gFk/bNes9s6NlLOuw\n' +
        'WPz55WECgYEA7nUwZ1toV/EQ7wDoqOHUD5Q77KGxSGQ79SG5z1sp28e1i3fxD4D/\n' +
        'mOPn+IjFkv5zWIivVHNK9+F7I35XYLgAWPhk5QUGQqavzzR4X/byE90TyCVT6Esm\n' +
        'vWgTmjHNnxldRgXwEfEWC7LJIzSbB33gb05PFdYIOv3lXL2+WZ/8cWUCgYEAobG8\n' +
        'tMBUVgfMquWtU1QS/xv4VZ+3/AC+vLNhOReKnUQS8TizT6LovNpRUeTPugTIh5/W\n' +
        'v8kbsCP+IVd14IOy4PCF9tZZswStEj11EY89JUK9gRsUpwdPUPK6iRx5J7+MQ2Ts\n' +
        'BfJaBk7AUkuNDY92SPxFXZiz+tFHvJAT77GNiE0CgYBW4W+/WLiNwhFPY19hmNYw\n' +
        'zut+bfMv0wVdbOpMOITpxLvKkurLoU5/IBp2nS6PPhI8oaBv/onEAu1gozmmzaOi\n' +
        'xu3L26bKRf0sW4u4Ozs8LYJ1m9QUgL0eqXrq5VZrr0wipSsw/kvv+zX5k8MgWaaa\n' +
        'J0f9Rrw88iDNR3zBHt9VWQKBgDNXxr32XFE9BMY3TAQrrCSJcx9tKfTBH8+3feWt\n' +
        'DfzGAuXJxVZCOnjNMgk5CKTeo/Y80OnxJ/OUWjuoE+wIpaI7fa5VfgIUOAiUrzm2\n' +
        'LApK2PXH7ZTkA1GG4ahr/CSc9CLqRu/UdrWOCA+Zod5ucXbXdAc2V+AK2CaN8Wap\n' +
        'EHH5AoGAfvM2+c72XeILn6IJ3i9JKzuSIkySkJ4oAaf3G4SSbDvMBCMqc8b4zXST\n' +
        'vCmh9dliPGfSLCMew0BlKFaWL6qMN0figgXpkgdrSnoCC7ZWNmx9FRIwx/oIAoVb\n' +
        'Ep6M2EBe5LAtf81VUsK1JK0Yd4V6LAao4SoWbdhc7Ygqf02dSB4=\n' +
        '-----END RSA PRIVATE KEY-----';
}

function loadRsaPublicKeyPem() {
    // important last crlf
    return '-----BEGIN PUBLIC KEY-----\n' +
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlp1CPeULNSRX2cDQXZLP\n' +
        'U2vaclFnBLgq73CzieJwZzGM6HsNprzf4/GBcf2RmnSchzfKiuQ6WrO4E4qZzAkv\n' +
        '7sn42UWwF2RtarOi15CvUJrQ6oydZ1+zyq71Tr/jOhpJ8+U6ht3ZJo5aOZNfXZBO\n' +
        'fe30WW1WLUgSDeUl8joX+0fZ7tD++6G9Jw6m7+umtlQQEDxDa+VV8d5hBjGBFfha\n' +
        'iGnUb2iR8PZdTUWEcQ7T3Il215P3m+HzZlCrwbdJNVCvGxZSLBUDxbhIOJmdPwS6\n' +
        'RseciwRcDIcLLQR3k3y4nn6ZcdYkmqP0Vgw1RFNBDDntw7nkkp55IjSPFOKvhMzD\n' +
        'YQIDAQAB\n' +
        '-----END PUBLIC KEY-----';
}