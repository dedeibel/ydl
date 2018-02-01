function download(tabs) {
  browser.runtime.sendMessage({
    action: "download",
    title: tabs[0].title,
    url: tabs[0].url
  });
}

function clear_finished() {
  browser.runtime.sendMessage({
    action: "clear_finished",
  });
}

function stop_all() {
  browser.runtime.sendMessage({
    action: "stop_all",
  });
}

function display_status(dl_status) {
  if (dl_status) {
    var elem = document.querySelector('#status');
    var html = '';
    for (var i = 0; i < dl_status.length; i++) {
      var s = dl_status[i];
      html += '<div class="download">';
      html += '  <div class="title">'+ s.title +'</div>';
      html += '  <div class="state">'+ s.state +': '+ s.status_text +'</div>';
      html += '</div>';
    }
    elem.innerHTML = html;
  }
}

function update_status() {
  browser.runtime.sendMessage({
    action: "get_status",
  }).then((a, b, c) => {
    display_status(a);
  }, console.error);  
}


document.querySelector("#download").addEventListener("click", (e) => {
  browser.tabs.query({active: true, currentWindow: true, windowType: 'normal'})
    .then(download)
    .catch(console.log);
});

document.querySelector("#clear_finished").addEventListener("click", clear_finished);
document.querySelector("#stop_all").addEventListener("click", stop_all);

update_status();
setInterval(update_status, 1100);

