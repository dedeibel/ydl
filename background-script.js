console.log('starting plugin');

var fatal = function(msg) {
  console.error(msg);
  browser.tabs.executeScript(null, { 
    code: "alert(\""+ msg +"\");"
  });
}

var running = true;
var dl_status = [];
var _port;

var onMessageFromAdapter = function(message) {
  if (message.action && message.action === 'status') {
    dl_status = message.data;
  }
};


var port = function() {
  if (_port)
    return _port;

  try {
    console.log('starting youtube dl adapter');
    var newport = browser.runtime.connectNative("youtubedladapter");

    newport.onDisconnect.addListener((port) => {
      console.log('port disconnected', port);
      _port = null;
      if (port.error) {
        fatal(`Disconnected due to an error: ${port.error.message}`);
      }
    });

    newport.onMessage.addListener(onMessageFromAdapter);

    _port = newport;
    return newport;
  }
  catch (e) {
    fatal('Could not start youtube-dl: ' + e);
    return null;
  }
}

var sendAction = function(action) {
  port().postMessage(action);
}

var sendStatus = function(message, sender, sendResponse) {
  sendResponse(dl_status);
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "get_status") {
    sendStatus(message, sender, sendResponse);
  }
  else {
    sendAction(message);
  }
});

