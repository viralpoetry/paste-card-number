
// for backward compatibility
if (!chrome.runtime) {
    // Chrome 20-21
    chrome.runtime = chrome.extension;
} else if(!chrome.runtime.onMessage) {
    // Chrome 22-25
    chrome.runtime.onMessage = chrome.extension.onMessage;
    chrome.runtime.sendMessage = chrome.extension.sendMessage;
    chrome.runtime.onConnect = chrome.extension.onConnect;
    chrome.runtime.connect = chrome.extension.connect;
}

// after install
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.tabs.create({ url: chrome.extension.getURL("options.html") });
});

function enter_password() {
    var pass = prompt("Please enter password", "");
    if (pass != null) {
        return pass;
    }
}

chrome.contextMenus.onClicked.addListener( function( info, tab) {
    // get PAN number from local storage
    chrome.storage.local.get('encrypted_pan', function (result) {
        if(!result.encrypted_pan) {
            // redirect to Options
            chrome.tabs.create({ url: chrome.extension.getURL("options.html") });
        } else {
            // ask for password
            password = enter_password();
            pan = decrypt(password, result.encrypted_pan);
            delete password;
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: "paste_cc", data: pan}, function(response) {
                    delete pan;
                });
            });
        }
    });
});

// create context menu item
chrome.contextMenus.create({ type: "normal", id: "paste_cc_ctx", title: "Paste credit card", contexts: ["editable"] });



