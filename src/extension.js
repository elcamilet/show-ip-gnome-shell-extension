const Soup = imports.gi.Soup;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const { GLib } = imports.gi;

class Extension {
    constructor() {
        this._indicator = null;
        this._session = new Soup.Session();
    }

    update_info(button) {
        let message = Soup.Message.new('GET', 'http://ip.lacodificadora.com');
        this._session.send_message(message);

        let result = this._session.send_message_sync(message);
        if (result.status_code === 200) {
            let response_body = result.response_body.data;
            button.set_label(response_body);
        } 
        else {
            logError(`Failed to fetch IP: ${result.status_code}`);
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
        GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
            this.update_info(button)
            return true; 
        });
    }

    disable() {
        if (sourceId) {
            GLib.Source.remove(sourceId);
            sourceId = null;
        }
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init() {
    return new Extension();
}
