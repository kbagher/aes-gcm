const saltInput = document.getElementById("iv-input");
const saltCounter = document.getElementById("salt-counter");

saltInput.addEventListener("input", () => {
    const saltValue = saltInput.value;
    const saltLength = saltValue.length;
    saltCounter.textContent = `(${saltLength}/12)`;
});

function getSelectedFormat() {
    return document.querySelector('input[name="format"]:checked').value;
}

async function deriveKey(keyStr, saltStr, iterations) {
    const baseKey = await window.crypto.subtle.importKey(
        "raw", new TextEncoder().encode(keyStr), "PBKDF2", false, ["deriveKey"]
    );
    const derivedKey = await window.crypto.subtle.deriveKey(
        {name: "PBKDF2", salt: new TextEncoder().encode(saltStr), iterations: iterations, hash: "SHA-256"},
        baseKey, {name: "AES-GCM", length: 256}, false, ["encrypt", "decrypt"]
    );
    return derivedKey;
}

function validateIterations(iterations) {
    const parsedIterations = parseInt(iterations);
    if (isNaN(parsedIterations) || parsedIterations < 1000) {
        console.error("Error: Invalid number of iterations.");
        document.getElementById("output").value = "Error: Invalid number of iterations.";
        return false;
    }
    return true;
}

function validateSalt(saltStr) {
    if (saltStr.length !== 12) {
        console.error("Error: Salt must be exactly 12 characters long.");
        document.getElementById("output").value = "Error: Salt must be exactly 12 characters long.";
        return false;
    }
    return true;
}

function validateText(text) {
    if (text.trim() === "") {
        console.error("Error: Input text cannot be empty.");
        document.getElementById("output").value = "Error: Input text cannot be empty.";
        return false;
    }
    return true;
}

function validateKey(key) {
    if (!key) {
        console.error("Error: Key cannot be empty.");
        document.getElementById("output").value = "Error: Key cannot be empty.";
        return false;
    }
    return true;
}

async function encrypt() {
    const keyStr = document.getElementById("key-input").value;
    const text = document.getElementById("text-input").value;
    const saltStr = document.getElementById("iv-input").value;
    const iterations = document.getElementById("iterations-input").value;


    if (!validateKey(keyStr)) {
        // If the key is not valid, display an error message and return
        return;
    }

    if (!validateSalt(saltStr)) {
        // If the Salt is not valid, display an error message and return
        return;
    }

    if (!validateIterations(iterations)) {
        // If the iterations value is not valid, display an error message and return
        return;
    }

    if (!validateText(text)) {
        // If the text input is empty, display an error message and return
        return;
    }


    // Convert the Salt string to a Uint8Array
    const salt = new Uint8Array(new TextEncoder().encode(saltStr));

    // Derive the encryption key
    const key = await deriveKey(keyStr, salt, iterations);

    // Generate a random IV for encryption
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the text using the specified IV
    const encrypted = await window.crypto.subtle.encrypt(
        {name: "AES-GCM", iv: iv}, key, new TextEncoder().encode(text)
    );

    // Combine the IV and encrypted data into a single array
    const encryptedArray = new Uint8Array(encrypted);
    const resultArray = new Uint8Array(12 + encryptedArray.length);
    resultArray.set(iv);
    resultArray.set(encryptedArray, 12);

    // Convert the result to the selected output format
    const selectedFormat = getSelectedFormat();
    let result;
    if (selectedFormat === 'hex') {
        result = Array.from(resultArray, b => b.toString(16).padStart(2, '0')).join('');
    } else {
        result = btoa(String.fromCharCode.apply(null, resultArray));
    }

    // Display the result in the output field
    document.getElementById("output").value = result;
}


async function decrypt() {
    const keyStr = document.getElementById("key-input").value;
    const input = document.getElementById("text-input").value;
    const saltStr = document.getElementById("iv-input").value;
    const iterations = document.getElementById("iterations-input").value;

    if (!validateKey(keyStr)) {
        // If the key is not valid, display an error message and return
        return;
    }

    if (!validateSalt(saltStr)) {
        // If the Salt is not valid, display an error message and return
        return;
    }

    if (!validateIterations(iterations)) {
        // If the iterations value is not valid, display an error message and return
        return;
    }

    if (!validateText(input)) {
        // If the text input is empty, display an error message and return
        return;
    }

    const selectedFormat = getSelectedFormat();

    let encryptedArray;
    if (selectedFormat === 'hex') {
        // Check that the input data is a valid hexadecimal string
        if (!/^[0-9a-fA-F]+$/.test(input)) {
            console.error("Error: Invalid input data format.");
            document.getElementById("output").value = "Error: Invalid input data format.";
            return;
        }
        encryptedArray = new Uint8Array(input.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    } else {
        encryptedArray = new Uint8Array(atob(input).split('').map(c => c.charCodeAt(0)));
    }

    // Check that the input data contains the IV and encrypted data
    if (encryptedArray.length < 28) {
        console.error("Error: Invalid input data length.");
        document.getElementById("output").value = "Error: Invalid input data length.";
        return;
    }

    const iv = encryptedArray.slice(0, 12);
    const encrypted = encryptedArray.slice(12);
    const salt = new Uint8Array(new TextEncoder().encode(saltStr));
    const key = await deriveKey(keyStr, salt, iterations);

    try {
        const decrypted = await window.crypto.subtle.decrypt(
            {name: "AES-GCM", iv: iv, tagLength: 128}, key, encrypted
        );
        const decryptedText = new TextDecoder().decode(decrypted);
        document.getElementById("output").value = decryptedText;
    } catch (err) {
        console.error(err);
        document.getElementById("output").value = "Error: Invalid decryption key or tampered data.";
    }
}


function copyResult() {
    const outputField = document.getElementById("output");
    outputField.select();
    document.execCommand("copy");
    const messageField = document.createElement("div");
    messageField.textContent = "Result copied to clipboard!";
    messageField.classList.add("alert", "alert-success", "mt-3");
    const container = document.querySelector(".container");
    container.appendChild(messageField);
    setTimeout(() => container.removeChild(messageField), 3000);
}
