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
  text: 'URL'
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

page.on('appear', function() {
  urlDisplay.set('text', localStorage.getItem('url'));
});

var sounds = [
  'Hey',
  'Listen',
  'Look',
  'Secret',
  'Fanfare'
];

var prev = urlDisplay;
for (var i = 0; i < sounds.length; i++) {
  var sound = sounds[i];
  var top = [prev, 10];
  prev = tabris.create("Button", {
    layoutData: {top: top, left: 10, right: 10, height: 80},
    text: sound
  }).appendTo(page);
  prev.on('select', function(btn) {
    urlDisplay.set('text', btn.get('text'));
  });
};

tabris.create('Drawer').append(tabris.create('PageSelector'));

page.open();