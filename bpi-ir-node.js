var ir = require('node-ir');
module.exports = function(RED) {
    
    function BpiIrOutNode(config) {
        RED.nodes.createNode(this,config);
        this.debug = config.debug || false;
        this.keyMap = config.keyMap || {};
        var node = this;
        ir.displayEvents();
        ir.on('key', function(key) {
            var mappedKey = node.keyMap[key];
            if (mappedKey == undefined) {
                mappedKey = key;
            }
            var msg = { payload: mappedKey };
            node.send(msg);
            if (node.debug) {
                node.status({fill:"green",shape:"ring",text:"Key: " + mappedKey});
            }
        });
        this.on('close', ir.hideEvents);
    }
    RED.nodes.registerType("banana-ir out", BpiIrOutNode);
}