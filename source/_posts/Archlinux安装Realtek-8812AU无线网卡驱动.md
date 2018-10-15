---
title: Archlinux安装Realtek-8812AU无线网卡驱动
date: 2018-10-12 12:10:25
tags: [linux,archlinux,驱动]
categories: 
- [Linux]
---



​	在公司台式机上装了Arch Linux，自己的笔记本用Windows，用Synergy共享键鼠，由于网口有限，台式机接有线，笔记本连wifi，不在一个网段内，公司网络不稳定，Synergy时不时会断开连接，于是就想把手里的Realtek-8812AU（后面简称无线网卡）用在台式机上，这样台式机和笔记本都连wifi，出问题的概率应该会小一点。

{%asset_img wifi.png%}

<!--more-->

​	于是开始找驱动，买无线网卡时附带了一个刻有驱动的光盘，我把驱动拷贝后光盘就丢掉了，里面有Linux驱动。

```shell
[kinboy@kinboyarchlinux Linux]$ l
total 104K
4.0K -rw-r--r-- 1 kinboy kinboy  183 Aug  1  2014 'Last Drivers Download.url'
   0 -rw-r--r-- 1 kinboy kinboy    0 Feb 19  2014  RTL8812AU_linux_v4.2.4_9390.20131023
 40K -rw-r--r-- 1 kinboy kinboy  37K Oct 23  2013  ReleaseNotes.pdf
4.0K drwxr-xr-x 2 kinboy kinboy 4.0K Sep 12  2016  WiFi_Direct_User_Interface
4.0K drwxr-xr-x 2 kinboy kinboy 4.0K Sep 12  2016  android_ref_codes_JB_4.1
4.0K drwxr-xr-x 2 kinboy kinboy 4.0K Sep 12  2016  android_ref_codes_JB_4.2
4.0K drwxr-xr-x 2 kinboy kinboy 4.0K Sep 12  2016  android_ref_codes_JB_4.3
4.0K drwxr-xr-x 2 kinboy kinboy 4.0K Sep 12  2016  android_reference_codes
4.0K drwxr-xr-x 2 kinboy kinboy 4.0K Sep 12  2016  android_reference_codes_ICS_nl80211
4.0K drwxr-xr-x 2 kinboy kinboy 4.0K Sep 12  2016  document
4.0K drwxr-xr-x 2 kinboy kinboy 4.0K Sep 12  2016  driver
4.0K drwxr-xr-x 2 kinboy kinboy 4.0K Sep 12  2016  hardware_wps_pbc
4.0K -rw-r--r-- 1 kinboy kinboy 3.1K Aug 21  2013  install.sh
 12K -rw-r--r-- 1 kinboy kinboy 8.1K Oct 23  2013  readme.txt
4.0K drwxr-xr-x 2 kinboy kinboy 4.0K Sep 12  2016  wireless_tools
4.0K drwxr-xr-x 2 kinboy kinboy 4.0K Sep 12  2016  wpa_supplicant_hostapd

```

执行 `install.sh` 编译时出错

```shell
make ARCH=x86_64 CROSS_COMPILE= -C /lib/modules/4.18.12-arch1-1-ARCH/build M=/home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023  modules
make[1]: Entering directory '/usr/lib/modules/4.18.12-arch1-1-ARCH/build'
  CC [M]  /home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/core/rtw_cmd.o
In file included from /home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/include/osdep_service.h:41,
                 from /home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/include/drv_types.h:32,
                 from /home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/core/rtw_cmd.c:22:
/home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/include/osdep_service_linux.h: In function '_init_timer':
/home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/include/osdep_service_linux.h:253:8: error: '_timer' {aka 'struct timer_list'} has no member named 'data'
  ptimer->data = (unsigned long)cntx;
        ^~
/home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/include/osdep_service_linux.h:254:2: error: implicit declaration of function 'init_timer'; did you mean '_init_timer'? [-Werror=implicit-function-declaration]
  init_timer(ptimer);
  ^~~~~~~~~~
  _init_timer
In file included from /home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/include/drv_types.h:32,
                 from /home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/core/rtw_cmd.c:22:
/home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/include/osdep_service.h: In function 'thread_enter':
/home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/include/osdep_service.h:342:2: error: implicit declaration of function 'allow_signal'; did you mean 'do_signal'? [-Werror=implicit-function-declaration]
  allow_signal(SIGTERM);
  ^~~~~~~~~~~~
  do_signal
/home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/include/osdep_service.h: In function 'flush_signals_thread':
/home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/include/osdep_service.h:352:6: error: implicit declaration of function 'signal_pending'; did you mean 'timer_pending'? [-Werror=implicit-function-declaration]
  if (signal_pending (current))
      ^~~~~~~~~~~~~~
      timer_pending
/home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/include/osdep_service.h:354:3: error: implicit declaration of function 'flush_signals'; did you mean 'do_signal'? [-Werror=implicit-function-declaration]
   flush_signals(current);
   ^~~~~~~~~~~~~
   do_signal
cc1: some warnings being treated as errors
make[2]: *** [scripts/Makefile.build:318: /home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023/core/rtw_cmd.o] Error 1
make[1]: *** [Makefile:1517: _module_/home/kinboy/Linux/driver/rtl8812AU_linux_v4.2.4_9390.20131023] Error 2
make[1]: Leaving directory '/usr/lib/modules/4.18.12-arch1-1-ARCH/build'
make: *** [Makefile:1161: modules] Error 2
##################################################
Compile make driver error: 2
Please check error Mesg
##################################################

```

google [implicit declaration of function 'allow_signal'](https://www.google.com/search?newwindow=1&ei=FTPAW4vwF8Pi8AOT2p7QBw&q=implicit+declaration+of+function+%27allow_signal%27&oq=implicit+declaration+of+function+%27allow_signal%27&gs_l=psy-ab.3.0.0i22i30.17484.17484..18449...0.0..0.287.287.2-1......0....1j2..gws-wiz.......0i71.6OTbatdtNrk) 找到了这篇文章，大概讲了错误的原因和解决办法

- [Wsky 1200Mbps Wireless USB Wifi Adapter](http://www.wolfteck.com/2018/02/22/wsky_1200mbps_wireless_usb_wifi_adapter/)

我在操作过程中没有得到同样的结果，后来又在GitHub中找到了匹配版本的驱动的源码，[地址](https://github.com/abperiasamy/rtl8812AU_8821AU_linux)

```shell
git clone https://github.com/abperiasamy/rtl8812AU_8821AU_linux.git
cd rtl8812AU_8821AU_linux
make
sudo make install
sudo modprobe -a rtl8812au
```

插上USB无线网卡，灯亮！