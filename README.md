<p align="center">
<a href="https://kbagher.github.io/aes-gcm"><b>>>> Click hete to try the app on GitHub Pages <<< </b></a>
</p>
<p align="center">
<img width="450" alt="Website screenshot" src="https://user-images.githubusercontent.com/772042/233535953-07413691-1907-4e6f-ad91-a6de06eac9cb.gif">
</p>
# AES-GCM-256 Encryption/Decryption Web App

This repository contains a simple web app that demonstrates the use of AES-GCM-256 encryption and decryption. The app is built using HTML, CSS (Bootstrap), and JavaScript. The cryptographic operations are performed using the Web Cryptography API available in modern web browsers. The app supports both hex and base64 formats for encrypted data.

## Overview

AES-GCM (Advanced Encryption Standard - Galois/Counter Mode) is a symmetric authenticated encryption algorithm that provides both confidentiality and integrity. This web app uses a 256-bit key size, which offers a high level of security.

The app allows users to encrypt and decrypt text using a user-provided key. The key derivation process uses the PBKDF2 function with a user-provided Salt, iterations, and SHA-256 hashing. The Salt must be exactly 12 characters long.

To use the app, enter a key with any length, a salt of exactly 12 characters, and the input text that you want to encrypt or decrypt. You can choose to output the encrypted or decrypted text in either hexadecimal or base64 format. The app runs entirely on the client side, and no data is stored on the server.

## Live Demo (Hosted on Github Pages)

You can use the web app without cloning the repository or downloading the source code on the following link:

[**AES-GCM-256 Encryption/Decryption**](https://kbagher.github.io/aes-gcm/)

## Project Structure and Offline Functionality

The project is organized into a clear and modular structure, with separate folders for CSS, JavaScript, and third-party libraries:

- project/
    - index.html
    - css/
        - bootstrap.min.css (v5.2.1)
    - js/
        - app.js
    - libs/
        - bootstrap.min.js (v5.2.1)
        - popper.min.js (v2.11.5)


This organization ensures that the project is easy to maintain and navigate. All necessary files have been downloaded and stored locally within the project folders, allowing the app to run offline without any issues.


## Security Considerations

- Choose strong and unique key and salt to ensure the security of your encrypted data. Avoid using simple or easily guessable keys.
- Using a fixed salt for PBKDF2 is not recommended for real-world applications. Ideally, a unique and randomly generated salt should be used for each key derivation process and stored alongside the encrypted data. You can modify the code to generate a random salt during the encryption process and include it in the encrypted output, similar to how the initialization vector (IV) is included.
- Be aware of potential risks when using this web app in an insecure environment (use only trusted devices). Ensure a secure connection (e.g., HTTPS) when deploying the app (not using as it's a client-side web app). The app runs entirely on the client side, and no data is stored on the server. However, GitHub Pages tracks visitors' IP addresses for security reasons. More information can be found [here](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection).
- For security reasons, if you prefer to download the required scripts directly from their original sources, you can replace the local files with links to the CDN versions of the libraries. Please note that doing so will require an internet connection to load the libraries when running the app.

## Use Case and Security Disclaimer

This web app can be used to encrypt and decrypt sensitive information, such as personal notes, passwords, or confidential data, before storing it on your phone, cloud service provider, or any other storage medium. For example, you can use this app on a trusted device like an iPhone, which is known for its security features, to encrypt your data before saving it.

However, it is important to note that using this web app on a compromised device may expose your encryption key and any data entered on the website. If your device is infected with a keylogger or any other type of malware that tracks your keystrokes, your encryption key and data could be leaked. This issue is not related to the code of the web app but rather the security of the environment in which it is used.

To minimize the risk of exposing your data, always ensure that your device is secure and up-to-date with the latest security patches. Use a trusted antivirus or anti-malware solution to regularly scan your device for threats.

Please note that this web app relies on the Web Cryptography API to perform encryption and decryption. While this API is assumed to be secure and not tampered with, it's important to note that the web app cannot detect if your system is compromised with malware or other security threats. So, make sure to keep your browser up-to-date with the latest security patches and updates.

Please refer to the "Security Considerations" section above for more information on best practices when using this web app to encrypt and decrypt your data

## Key Derivation

The app derives a 256-bit key from the user's input using the PBKDF2 (Password-Based Key Derivation Function 2) algorithm with the following parameters:

-   Salt: Salt input is converted into a 12-bytes and represented as a `Uint8Array`
-   Iterations: Minimum 1,000
-   Hashing algorithm: SHA-256

This key derivation process ensures that the derived key has a fixed length of 256 bits, regardless of the input length.

## Encryption

The encryption process uses AES-GCM with a 256-bit key and the following parameters:

-   Key: A derived 256 bits key using a master key, salt and iterations
-   Initialization Vector (IV): Randomly generated 12-bytes (96-bits)
-   Encoded text: The input text is encoded using the `TextEncoder` API, which encodes the text as UTF-8

The encrypted output is a concatenation of the IV and the encrypted data, which is then converted to a hexadecimal or base64 string, depending on the selected format, for presentation.

## Decryption

The decryption process uses AES-GCM with a 256-bit key and the following parameters:

-   Key: A derived 256 bits key using a master key, salt and iterations
-   Initialization Vector (IV): Extracted from the input data
-   Encrypted data: The remaining bytes of the input data, after the IV

The decrypted output is decoded using the `TextDecoder` API, which interprets the decrypted bytes as UTF-8 encoded text.

## Interoperability

To decrypt data encrypted by this web app in another programming language, follow these steps:

1.  Derive a 256-bit key from the master key using PBKDF2 with the same salt and iteration count that are used during key derivation, and hashing algorithm as specified above.
2.  Convert the encrypted input (hexadecimal or base64) back to bytes.
3.  Extract the IV (first 12 bytes) and encrypted data (remaining bytes) from the byte array.
4.  Use AES-GCM-256 with the derived key and extracted IV to decrypt the encrypted data.
5.  Decode the decrypted bytes as UTF-8 encoded text.

Make sure to use the appropriate cryptographic libraries in your chosen programming language that support AES-GCM and PBKDF2.

## Browser Compatibility

The Web Cryptography API is supported in the following browsers:

-   Google Chrome 37+
-   Mozilla Firefox 34
-   Internet Explorer 11+
-   Microsoft Edge 12+
-   Safari 10.1+

Please note that some older versions of these browsers may have partial support or may require vendor prefixes for certain API features.

## Usage Instructions

To use this web app:

1.  Clone the repository or download the source code.
2.  Open the `index.html` file in a web browser that supports the Web Cryptography API (see Browser Compatibility section above).
3.  Enter a key and text to be encrypted or decrypted.
4.  Click the "Encrypt" or "Decrypt" button to perform the desired operation.

## Customization

You can modify the code to change the encryption algorithm, key size, or other parameters by editing the JavaScript code in `js/app.js` file.

For example, you can change the key size from 256 bits to 128 bits by updating the following line:

```javascript
{ name: "AES-GCM", length: 256 }
```
to

```javascript
{ name: "AES-GCM", length: 128 }
```

Please note that changing the encryption algorithm or key size may affect the security and compatibility of the app.

## Related Projects and Resources

-   [Web Cryptography API - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
-   [AES-GCM - Wikipedia](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
-   [PBKDF2 - Wikipedia](https://en.wikipedia.org/wiki/PBKDF2)
-   [CryptoJS](https://cryptojs.gitbook.io/docs/): A popular JavaScript cryptography library
-   [Stanford JavaScript Crypto Library (SJCL)](https://github.com/bitwiseshiftleft/sjcl): A JavaScript cryptography library developed by Stanford University

These resources can help you learn more about cryptography, AES-GCM, PBKDF2, and the Web Cryptography API, or find similar projects and tutorials.
