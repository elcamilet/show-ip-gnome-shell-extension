const St = imports.gi.St;
const Soup = imports.gi.Soup;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const { GLib } = imports.gi;

class Extension {
    constructor() {
        this._indicator = null;
    }

    async update_info(button) {
        try {
            let message = Soup.Message.new('GET', 'http://ip.lacodificadora.com');
            this._session.send_and_read_async( message, GLib.PRIORITY_DEFAULT, null, (session, result) => {
                if (message.get_status() === Soup.Status.OK) {
                    let bytes = session.send_and_read_finish(result);
                    let decoder = new TextDecoder('utf-8');
                    let response = decoder.decode(bytes.get_data());
                    button.set_label(response);
                }
            });
        } catch (error) {
            log(`Error: ${error.message}`);
        }
    }

    enable() {
        this._session = new Soup.Session();
        const indicatorName = _('%s Indicator').format(Me.metadata.name);
        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);
        let button = new St.Button({ label: 'loading...', style_class: 'label'});
        this.update_info(button);
    	button.connect('clicked', () => {  
            this.update_info(button); 
        });
        this._indicator.add_child(button);
        Main.panel.addToStatusArea(indicatorName, this._indicator);
        GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
            this.update_info(button);
            return true; 
        });
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
        this._session = null;
    }
}

function init() {
    return new Extension();
}
