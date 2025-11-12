import St from 'gi://St';
import Soup from 'gi://Soup';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import GLib from 'gi://GLib';

export default class ShowPublicIp extends Extension {
    constructor(metadata) {
        super(metadata);
        this._indicator = null;
        this._sourceId = null;
        this._session = null;
    }

    async update_info(button) {
        try {
            let message = Soup.Message.new('GET', 'http://ip.elcamilet.com');
            this._session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, (session, result) => {
                if (message.get_status() === Soup.Status.OK) {
                    let bytes = session.send_and_read_finish(result);
                    let decoder = new TextDecoder('utf-8');
                    let response = decoder.decode(bytes.get_data());
                    button.set_label(response);
                }
            });
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }

    enable() {
        this._session = new Soup.Session();
        const indicatorName = `${this.metadata.name} Indicator`;
        this._indicator = new PanelMenu.Button(0.0, indicatorName, false);
        let button = new St.Button({ label: 'loading...', style_class: 'label' });

        this.update_info(button);

        button.connect('clicked', () => {
            this.update_info(button);
        });

        this._indicator.add_child(button);
        Main.panel.addToStatusArea(indicatorName, this._indicator);

        this._sourceId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
            this.update_info(button);
            return true;
        });
    }

    disable() {
        if (this._sourceId) {
            GLib.Source.remove(this._sourceId);
            this._sourceId = null;
        }

        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }

        this._session = null;
        this._session.abort();
    }
}
