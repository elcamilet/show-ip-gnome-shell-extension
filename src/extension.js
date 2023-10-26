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
        let message = Soup.Message.new('GET', 'http://ip.lacodificadora.com');
        
        try {
            let [response, data] = await this._session.send_async(message);
            
            if (response.status_code === 200) {
                let response_body = data.get_data();
                button.set_label(response_body);
            } else {
                logError(`Failed to fetch IP: ${response.status_code}`);
            }
        } catch (error) {
            logError(`Error: ${error.message}`);
        }
    }


    enable() {
        this._session = new Soup.Session();
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
        this._session = null;
    }
}

function init() {
    return new Extension();
}
