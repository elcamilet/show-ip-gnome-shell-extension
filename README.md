# show-ip-gnome-shell-extension
\
Simple GNOME Shell Extension that shows your current public IP address  
It's my first GNOME Shell extension and it's for testing purposes only!  
You can download Zipped Extension here: [showip@lacodificadora.com.zip](https://github.com/elcamilet/show-ip-gnome-shell-extension/blob/master/showip%40lacodificadora.com.zip)
&nbsp;
## USAGE:
Automatically shows your public IP address.  
You can refresh it by clicking on IP address and IP address will be updated.   
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
