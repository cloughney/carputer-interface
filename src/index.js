var mopidy = new Mopidy({
    webSocketUrl: "ws://192.168.1.153:6680/mopidy/ws/"
});

mopidy.on(console.log.bind(console));
