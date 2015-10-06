var pingInterval;

var page = tabris.create('Page', {
  topLevel: true,
  title: 'Tada'
});

var settingsPage = tabris.create('Page', {
  topLevel: true,
  title: 'Settings'
});

var urlDisplay = tabris.create('TextView', {
  layoutData: {top: 10, left: 10, right: 10},
  alignment: 'center',
  markupEnabled: true,
  text: 'URL'
}).appendTo(page);

var soundsCollection = tabris.create('CollectionView', {
  layoutData: {left: 0, right: 0, top: [urlDisplay, 5], bottom: 0},
  itemHeight: 72,
  refreshEnabled: true,
  initializeCell: function(cell) {
    var titleTextView = tabris.create('TextView', {
      layoutData: {left: 10, right: 10, top: 10},
      alignment: 'center'
    }).appendTo(cell);
    cell.on("change:item", function(widget, sound) {
      titleTextView.set("text", sound);
    });
  }
}).on('refresh', function() {
  loadSounds();
}).on('select', function(target, value) {
  var xhr = new tabris.XMLHttpRequest();
  xhr.open('GET', 'http://' + localStorage.getItem('url') + '/play/' + value);
  xhr.send();
}).appendTo(page);

var urlPicker = tabris.create('Picker', {
  layoutData: {top: 10, left: 10, right: 10}
}).appendTo(settingsPage);

var urlInput = tabris.create('TextInput', {
  message: 'URL',
  layoutData: {top: [urlPicker, 10], left: 10, right: 10}
}).appendTo(settingsPage);

urlInput.on('accept', function() {
  var urls = [];
  if (localStorage.getItem('urls')) {
    urls = JSON.parse(localStorage.getItem('urls'));
  }
  urls.push(urlInput.get('text'));
  localStorage.setItem('urls', JSON.stringify(urls));
  localStorage.setItem('url', urlInput.get('text'));
  page.open();
});

urlPicker.on('select', function() {
  localStorage.setItem('url', urlPicker.get('selection'));
  page.open();
});

settingsPage.on('appear', function() {
  if (!localStorage.getItem('urls')) {
    localStorage.setItem('urls', '["bla"]');
  }
  urlPicker.set('items', JSON.parse(localStorage.getItem('urls')));
});

function ping() {
  var xhr = new tabris.XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        xhrOkHandler();
      } else {
        xhrErrorHandler();
      }
    }
  };
  xhr.ontimeout = xhrErrorHandler;
  xhr.open('GET', 'http://' + localStorage.getItem('url') + '/ping');
  xhr.send();
}

function loadSounds() {
  soundsCollection.set({
    refreshIndicator: true,
    refreshMessage: 'loading...'
  });
  var xhr = new tabris.XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE) {
      soundsCollection.set({
        refreshIndicator: false,
        refreshMessage: ''
      });
      if (xhr.status === 200) {
        xhrOkHandler();
        var sounds = JSON.parse(xhr.responseText).sounds;
        sounds.sort();
        soundsCollection.set('items', sounds);
      } else {
        xhrErrorHandler();
      }
    }
  };
  xhr.ontimeout = xhrErrorHandler;
  xhr.open('GET', 'http://' + localStorage.getItem('url') + '/list');
  xhr.send();
}

function xhrOkHandler() {
  urlDisplay.set('text', localStorage.getItem('url') + ' <b>OK</b>');
}

function xhrErrorHandler() {
  urlDisplay.set('text', localStorage.getItem('url') + ' <b>ERROR</b>');
}

page.on('appear', function() {
  urlDisplay.set('text', localStorage.getItem('url'));
  loadSounds();
  pingInterval = setInterval(ping, 5000);
});

page.on('disappear', function() {
  clearInterval(pingInterval);
});

tabris.create('Drawer').append(tabris.create('PageSelector'));

page.open();