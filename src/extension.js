const St = imports.gi.St;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const { GLib } = imports.gi;

class Extension {
    constructor() {
        this._indicator = null;
        this._sourceId = null;
    }

    update_info(button) {
        let [result, stdout, stderr] = GLib.spawn_command_line_sync('curl ip.lacodificadora.com');
        if (result) {
            button.set_label(String.fromCharCode.apply(null, stdout));
        } else {
            logError(stderr);
        }
    }

    enable() {
        const indicatorName = _('%s Indicator').format(Me.metadata.name);
        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);
        let button = new St.Button({ label: 'init', style_class: 'label'});
        this.update_info(button)
    	button.connect('clicked', () => {  this.update_info(button) });
        this._indicator.add_child(button);
        Main.panel.addToStatusArea(indicatorName, this._indicator);
        this._sourceId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
            this.update_info(button)
            return true; 
        });
    }

    disable() {
        if (this._sourceId) {
            GLib.Source.remove(this._sourceId);
            this._sourceId = null;
        }
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init() {
    return new Extension();
}
