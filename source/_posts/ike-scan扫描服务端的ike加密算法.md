---
title: ike-scan扫描ipsec vpn服务端ike加密算法
date: 2018-07-11 21:15:05
tags: 
- vpn
- ipsec
- ike-scan
---



原文：[IPsec IKEv1 algorithms](https://github.com/nm-l2tp/network-manager-l2tp/wiki/Known-Issues#querying-vpn-server-for-its-ikev1-algorithm-proposals)

## IPsec IKEv1 Algorithms

### Weak Legacy Algorithms

As mentioned in the [README.md](https://github.com/nm-l2tp/network-manager-l2tp#issue-with-vpn-servers-only-proposing-ipsec-ikev1-weak-legacy-algorithms) file, there is a general consensus that the following legacy algorithms are now considered weak or broken in regards to security and should be phased out and replaced with stronger algorithms:

##### Encryption Algorithms :

- 3DES
- Blowfish

##### Integrity Algorithms :

- MD5
- SHA1

##### Diffie Hellman Groups :

- MODP768
- MODP1024
- MODP1536

<!--more-->

Legacy algorithms that are considered weak or broken are regularly removed from the default set of allowed algorithms with newer releases of strongSwan and Libreswan. As of strongSwan 5.4.0 and Libreswan 3.20, the above algorithms (apart from SHA1 and MODP1536 for Libreswan which still includes them for backwards compatibility) have been or in some cases already been removed from the default set of allowed algorithms.

If you are not sure, or want to confirm which IPsec IKEv1 phase 1 algorithms your VPN server server proposes, see the section on how to [query the VPN server](https://github.com/nm-l2tp/network-manager-l2tp/wiki/Known-Issues#querying-vpn-server-for-its-ikev1-algorithm-proposals).

If the VPN server is only proposing weak or broken algorithms, it is recommended that it be reconfigured to propose stronger algorithms, e.g. AES, SHA2 and MODP2048.

### Compatibility with VPN servers using weak legacy IPsec IKEv1 algorithms

NetworkManager-l2tp as of version 1.2.6 uses the Libreswan or strongSwan default set of allowed algorithms for phase 1 and phase 2 proposal negotiations. This means VPN servers that are using only legacy ciphers that strongSwan or Libreswan now consider broken will result in a failed connection, unless user specified algorithms to supplement or override the default set of algorithms are used for phase 1 and 2.

Please see *Example workaround for 3DES, SHA1 and MODP1024 broken algorithms* section in the source code's [README.md](https://github.com/nm-l2tp/network-manager-l2tp#example-workaround-for-3des-sha1-and-modp1024-broken-algorithms) file for an example workaround for the 3DES, SHA1 and MODP1024 broken algorithms that many L2TP/IPsec VPN servers are still proposing.

### Querying VPN server for its IKEv1 algorithm proposals

Install the `ike-scan` package which most Linux distributions provide and then run the following script (with further details on how below the script) :

```
#!/bin/sh

# Encryption algorithms: 3des=5, aes128=7/128, aes192=7/192, aes256=7/256
ENCLIST="5 7/128 7/192 7/256"
# Hash algorithms: md5=1, sha1=2, sha256=5, sha384=6, sha512=7
HASHLIST="1 2 5 6 7"
# Diffie-Hellman groups: 1, 2, 5, 14, 15, 19, 20, 21
GROUPLIST="1 2 5 14 15 19 20 21"
# Authentication method: Preshared Key=1
AUTH=1

for ENC in $ENCLIST; do
   for HASH in $HASHLIST; do
       for GROUP in $GROUPLIST; do
          echo ike-scan --trans=$ENC,$HASH,$AUTH,$GROUP -M "$@"
          ike-scan --trans=$ENC,$HASH,$AUTH,$GROUP -M "$@"
      done
   done
done
```

Let's assume the above script has been copied and pasted to a file called `ike-scan.sh`, to run the script, issue something like the following on the command-line. Note: `ike-scan` needs UDP port 500 to be free, this can be achieved by stopping any running IPsec service (e.g. `sudo ipsec stop`). Replace `123.54.76.9` in the below with your VPN server and we'll grep for `SA` (i.e. IPSec Security Association) which is the main thing we are interested in.

```
sudo ipsec stop
chmod a+rx ./ike-scan.sh
sudo ./ike-scan.sh 123.54.76.9 | grep SA
```

It may take a few minutes for the script to run to completion and the output shall look something like:

```
  SA=(Enc=3DES Hash=SHA1 Auth=PSK Group=2:modp1024 LifeType=Seconds LifeDuration(4)=0x00007080)
  SA=(Enc=AES Hash=SHA1 Auth=PSK Group=14:modp2048 KeyLength=128 LifeType=Seconds LifeDuration(4)=0x00007080
```

From the above example script output, it would mean the following phase 1 & 2 algorithms options could be set in the IPsec dialog box advanced options:

- **Phase1 Algorithms:** aes128-sha1-modp2048,3des-sha1-modp1024
- **Phase2 Algorithms:** aes128-sha1,3des-md5

### Overriding and not just supplementing the default cipher

For strongSwan, but not Libreswan, in some cases you may need to put an exclamation mark (`!`) at the end of the phase 1 or 2 settings to override and not just supplement the default ciphers. For example, some Cisco Unity VPN servers may require:

- **Phase1 Algorithms:** aes128-sha1-modp1024,3des-sha1-modp1024!
- **Phase2 Algorithms:** aes128-sha1,3des-md5

### KDE Plasma < 5.11 and legacy IPsec IKEv1 ciphers

[KDE Plasma-nm](https://cgit.kde.org/plasma-nm.git/) (< version 5.11) front end for NetworkManager-l2tp doesn't have the text boxes for user defined IPsec phase 1 and 2 algorithms, [KDE bug# 380859](https://bugs.kde.org/show_bug.cgi?id=380859). With Plasma 5.11 support has been added with [commit# 1adb364](https://cgit.kde.org/plasma-nm.git/commit/?id=1adb364664753f342c7b221687ca68ce4a5ec79e).

Current KDE Plasma < 5.11 workarounds for IPsec phase 1 and 2 algorithms support include:

- backport the [Plasma-nm patch](https://cgit.kde.org/plasma-nm.git/patch/?id=1adb364664753f342c7b221687ca68ce4a5ec79e) for NetworkManager-l2tp 1.2.6 UI support.
- Use newer KDE backported packages for your linux distribution if available.

## *"Layer 2 Tunneling Protocol (L2TP)"* not showing up

After installing NetworkManager-l2tp from either the source code or a prebuilt binary package, if "Layer 2 Tunnelling Protocol (L2TP)" does not show up when trying to add a VPN connection, try one of the following:

- `sudo systemctl restart NetworkManager`
- `sudo service network-manager restart`
- logout/login
- reboot

## Unable to save password

Logout/login or reboot if the saved password isn't being rembered and you are seeing something like the following in the `journalctl` output, :

```
gnome-shell[2143]: JS LOG: Invalid VPN service type (cannot find authentication binary)
...  NetworkManager[1234]: <error> ... von-connection...: Failed to request VPN secrets #3: No agents were available for this request.
```

This bug has been fixed with newer gnome-shell versions see GNOME [bug# 773893](https://bugzilla.gnome.org/show_bug.cgi?id=773893) and Fedora gnome-shell [bug# 1389107](https://bugzilla.redhat.com/show_bug.cgi?id=1389107)

## Unable to create or edit a L2TP VPN connection

Unless you are using KDE (Plasma-nm) or the command-line (`/usr/bin/nmcli`), you will be using a GNOME based NetworkManager connection editor to create or edit VPN connections.

If you are using pre-build binary packages, please ensure you have installed the `NetworkManager-l2tp-gnome` or `network-manager-l2tp-gnome` package which provides the necessary files for use with a GNOME based NetworkManager connection editor, otherwise you may see a variation of the following error :

```
Could not load editor VPN plugin for 'org.freedesktop.NetworkManager.l2tp'
(missing plugin file "/usr/lib64/NetworkManager/libnm-vpn-plugin-l2tp-editor.so").
```

## Issue with not stopping system xl2tpd service

NetworkManager-l2tp starts its own instance of an xl2tpd process and if the system xl2tpd service is running, its own xl2tpd instance won't be able to use UDP port 1701, so will use an ephemeral port (i.e. random high port).

Although the use of an ephemeral port is described in *"Securing L2TP using IPsec"* [RFC3193](https://www.ietf.org/rfc/rfc3193.txt)written by Microsoft and Cisco, there are some L2TP/IPsec servers and/or firewalls that will have issues with the use of an ephemeral port.

Stopping the system xl2tpd service should free UDP port 1701 and on systemd based Linux distributions, the xl2tpd service can be stopped with the following:

```
sudo systemctl stop xl2tpd
```

If stopping the xl2tpd service fixes your VPN connection issue, you can disable the xl2tpd service from starting at boot time with :

```
sudo systemctl disable xl2tpd
```

## Orphaned pppd process

With xl2tpd ≤ 1.3.6 (and in particular Linux distributions' xl2tpd packages that don't have xl2tpd [commit# a193e02](https://github.com/xelerance/xl2tpd/commit/a193e02c741168a9b9072b523f2d6faf14a049da) backported which fixes a NULL-pointer deference bug), a pppd process will be left behind when tearing down a VPN connection because the parent xl2tpd process crashes before it has a chance at reaping the child pppd process.

Ubuntu 16.04 and 16.10 have updated xl2tpd 1.3.6 packages that contains the fix ([Ubuntu bug# 1677990](https://bugs.launchpad.net/ubuntu/+source/xl2tpd/+bug/1677990)).

## EAP: peer reports authentication failure

If you see `EAP: peer reports authentication failure` in the `journalctl` output (or elsewhere), then in the VPN connection's PPP Settings dialog box, untick *EAP* in the authentication methods list. In some situations, the *Use Point-to-Point encryption (MPPE)* checkbox may also need to be ticked.

## DNS resolution issues

### .local hostname resolution

There are unfortunately many Microsoft Windows networks that still use `.local` for internal hostnames that are resolved using *unicast* DNS even though Microsoft no longer recommends using `.local`. The use of *unicast* DNS for resolving `.local` has fallen into disfavor as mobile devices, printers and other devices supporting Zeroconf (aka Bonjour) have become increasingly common and they use *multicast* DNS (mDNS) for resolving hostnames ending in `.local`.

In `/etc/nsswitch.conf` most Linux distributions put `mdns4_minimal` ahead of `dns` in the `hosts:`line which often looks something like:

```
hosts:    files mdns4_minimal [NOTFOUND=return] dns
```

With the above `nsswitch.conf` hosts configuration, `.local` hostname resolution will return NOTFOUND if the hostname can not be found in mDNS.

If you must VPN to a network using `.local` with *unicast* DNS and not too concerned about potential Zeroconf performance issues, one workaround is to to move `dns` before `mdns4_minimal` in the `hosts:` line.

### NetworkManager ≤ 1.6.2 and Systemd-resolved ignoring VPN server's DNS

NetworkManager 1.6 introduced support for the systemd-resolved local DNS forwarder backend. Some Linux distributions have switched from DNSMasq to Systemd-resolved for DNS. Unfortunately with NetworkManager ≤ 1.6.2 because the *ppp* interfaces isn't *"managed"* by NetworkManager the VPN server's DNS configuration is being ignored as described in [GNOME bug# 779087](https://bugzilla.gnome.org/show_bug.cgi?id=779087).

A workaround is to rollback to using DNSMasq:

1. Edit `/etc/NetworkManager/NetworkManager.conf` and add the following line under the `[main]` section:

```
dns=dnsmasq
```

1. Backup the Systemd `resolv.conf` file (NetworkManager should create a new one):

```
sudo mv /etc/resolv.conf /etc/resolv.conf.systemd
```

1. Disable and stop the systemd-resolved service:

```
sudo systemctl disable systemd-resolved
sudo systemctl stop systemd-resolved
```

1. Restart network-manager

```
sudo systemctl restart NetworkManager
```

## Ubuntu AppArmor issue with strongSwan

For Ubuntu versions < 16.04, strongSwan's `charon` and `stroke` daemons are prevented from performing correctly as child processes under NetworkManager-l2tp due to an [AppArmor name space issue involving NetworkManager](https://bugs.launchpad.net/bugs/1587886) and the AppArmor profiles for `charon` and `stroke`. The simplest workaround is to disable the `charon` and `stroke` AppArmor profiles :

``` bash
sudo ln -s /etc/apparmor.d/usr.lib.ipsec.charon /etc/apparmor.d/disable/
sudo apparmor_parser -R /etc/apparmor.d/usr.lib.ipsec.charon
sudo ln -s /etc/apparmor.d/usr.lib.ipsec.stroke /etc/apparmor.d/disable/
sudo apparmor_parser -R /etc/apparmor.d/usr.lib.ipsec.stroke
```

With Ubuntu 16.04 (Xenial Xerus), the issue is fixed by upgrading to strongswan 5.3.5-1ubuntu3.1 (or later).

With Ubuntu 16.10 (Yakkety Yak), the issue is fixed by upgrading to strongswan 5.3.5-1ubuntu4.1 (or later).

With Ubuntu 17.04 and later, there is no strongSwan AppArmor issue.

## openSUSE and SUSE Linux Enterprise Server

For NetworkManager-l2tp to work, please ensure the Wicked service is disabled and NetworkManager service enable:

``` 
sudo systemctl stop wicked
sudo systemctl disable wicked
sudo systemctl enable NetworkManager
sudo systemctl start NetworkManager
```