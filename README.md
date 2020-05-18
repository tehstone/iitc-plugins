# IITC-plugins for adding POIs to various Discord bots

This repository has three scripts, which are to be used with [Ingress Intel Total Conversion (IITC)](https://iitc.me/) to help add POIs to two popular Discord bots—[PokeNav](https://pokenavbot.com/) and [Meowth](https://github.com/FoglyOgly/Meowth) and [Kyogre](https://github.com/tehstone/Kyogre). If you are looking to use these scripts in your Discord server and do not know anything about IITC, check out the prerequisites below for some information on how to get started.


## The Plugins

Plugins are forks of [Forte's PokeNav Quick Copy POI plugin](https://github.com/pkmngots/iitc-plugins) for the IITC Map. Additional code was taken from [Sunkast's version](https://gist.github.com/sunkast/f38961398f91b7a31e4d29e46dd1264a) of the same script. The original script was adapted to add two different use cases:

1. For Kyogre bot, the script adds links to convert a stop to a gym, add a new gym, and add a new pokestop. These links send the relevent command directly to the channel your webhook is configured for.
![Portal Info with Kyogre Script running](https://i.imgur.com/ZzDC8Bn.png)

2. For Meowth bot, the script adds a links to the portal information, allowing you add either the `!addstop` or`!addgym` commands to the clipboard. If you have marked a gym as EX-eligible, it will use the `!addexraidgym` command. You can then paste the command in your bot command channel, to add the POI to Meowth.
![Portal Info with Meowth Script running](https://i.imgur.com/IInhyh0.png)

3. For PokeNav, clicking on the link will send either the `$create poi pokestop` or `$create poi gym` command directly to your #pokenav moderation channel via a webhook. If you have marked a gym as EX-eligible, it will add `"ex_eligible: 1"` to the command.
![Portal Info with PokeNav Script running](https://i.imgur.com/w3t6ffF.png)

Currently, the Meowth functionality is available in the master branch. The PokeNav webhook functionality is in the webhook branch. It will be moved to the master branch in the near future.

## Installation
### Prerequisites
1. Ingress account so you can access the Ingress Intel maps
2. Tampermonkey extension
3. Ingress Intel Total Conversion (IITC)
4. PoGo Tools script

You can find instructions for all of these steps [here](https://gitlab.com/AlfonsoML/pogo-s2).

### Installing the Meowth or PokeNav plugin_info
To install these scripts, follow the README.md for the respective script.
- Kyogre [README.md](https://github.com/tehstone/iitc-plugins/tree/master/kyogre)
- Meowth [README.md](https://github.com/typographynerd/iitc-plugins/tree/master/meowth)
- PokeNav [README.md](https://github.com/typographynerd/iitc-plugins/tree/master/pokenav)
