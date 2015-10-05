var page = tabris.create("Page", {
  topLevel: true,
  title: "Tada"
});
tabris.create("Button", {
  layoutData: {centerX: 0, centerY: 0},
  text: "Hey!"
}).appendTo(page);