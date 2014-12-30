
// update div element with app status
function show_result(txt) {
    var status = document.getElementById('status');
    status.textContent = txt;
}

// Saves options to chrome.storage
function save_options() {
    // lname
    number = document.getElementById("frm1").elements.item(0).value;
    // pass1
    password = document.getElementById("frm1").elements.item(1).value;
    // encrypt before storing
    encrypted = encrypt(password, number);
    chrome.storage.local.set({'encrypted_pan': encrypted}, function() {
        // Notify that we saved.
        if (chrome.extension.lastError) {
            console.log('An error occurred: ' + chrome.extension.lastError.message);
        } else {
            show_result('Data has been successfully saved.');
        }
    });
}

function clear_storage() {
     //window.localStorage.clear();
     chrome.storage.local.clear();
     show_result('Data has been cleared.');
     // clear form
     document.getElementById("frm1").elements.item(0).value = '';
}

document.getElementById('save').addEventListener('click', save_options);
document.getElementById('clear').addEventListener('click', clear_storage);
show_result('Please be patient, key derivation may take several seconds.');

