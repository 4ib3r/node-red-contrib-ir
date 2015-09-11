module.exports = function(RED) {
    var IR = require('bpi-ir');
    function BpiIrOutNode(config) {
        var ir = new IR();
        RED.nodes.createNode(this,config);
        this.debug = config.debug || false;
        this.keyMap = config.keymap || {};
        var node = this;
        this.on('close', function() {
            if (ir !== undefined && ir.stop !== undefined) {
                ir.stop();
            }
        });
        ir.start();
	var lastKey = null;
        var mappKey = function(key) {
            var mappedKey = node.keyMap[key];
            if (mappedKey == undefined) {
                mappedKey = key;
            }
            return mappedKey;
        }
	ir.on('down', function(key) {
            var mappedKey = mappKey(key);
            var msg = { payload: mappedKey };
            if (node.debug) {   
                node.status({fill:"green",shape:"ring",text:"Key: " + mappedKey});
            }
            node.send([msg, null]);
	});
        ir.on('up', function(key) {
            var mappedKey = mappKey(key);
            var msg = { payload: mappedKey };
            node.send([null, msg]);
            if (node.debug) {
                node.status({fill:"red",shape:"ring",text:"Key: " + mappedKey});
            }
        });
    }
    RED.nodes.registerType("banana-ir in", BpiIrOutNode);
}
