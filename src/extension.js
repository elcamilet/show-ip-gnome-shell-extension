const St = imports.gi.St;
const GObject = imports.gi.GObject;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const { GLib, Shell, Meta } = imports.gi;
const Mainloop = imports.mainloop;

class Extension {
    constructor() {
        this._indicator = null;
    }

    enable() {
        const indicatorName = _('%s Indicator').format(Me.metadata.name);
        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);

        let label = new St.Label({ text: 'init', style_class: 'label' });
        let [result, stdout, stderr] = GLib.spawn_command_line_sync('curl ip.lacodificadora.com');
        
        if (result) {
            label = new St.Label({ text: String.fromCharCode.apply(null, stdout), style_class: 'label' });
        } else {
            logError(stderr);
        }
        
        this._indicator.add_child(label);
        Main.panel.addToStatusArea(indicatorName, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init() {
    return new Extension();
}
