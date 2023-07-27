# show-ip-gnome-shell-extension
\
Simple GNOME Shell Extension that shows your current public IP address.  
It's my first GNOME Shell extension and it's free... There is no warranty, you know?  
You can install this extension from: [extensions.gnome.org](https://extensions.gnome.org/extension/6087/show-current-public-ip/)  
And you can access to source code here: [elCamilet's Github](https://github.com/elcamilet/show-ip-gnome-shell-extension)
## &nbsp;
## USAGE:
Automatically shows your public IP address.  
You can refresh it by clicking on IP address and IP address will be updated.

**UPDATE!** Now your public IP is auto refreshed every 5 minutes!

Yout IP address is fetched by this curl command:
```
curl ip.lacodificadora.com
```
&nbsp;
## DEBUG:
How to enable debugging mode:  
```
journalctl -f -o cat /usr/bin/gnome-shell
```
&nbsp;
## LICENSE
This extension is licensed by GNU General Public License v3.0  
&nbsp;
## AUTHOR
Developed by [La Codificadora de Ideas](https://lacodificadora.com)
