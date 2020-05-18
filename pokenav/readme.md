# Quick Add PokeNav POI by Webhook Script

This is a [Tampermonkey](https://www.tampermonkey.net/) script that was originally developed by [Forte](https://github.com/pkmngots/iitc-plugins) and subsequently modified by [Sunkast](https://gist.github.com/sunkast/f38961398f91b7a31e4d29e46dd1264a) for use with an IITC map. (If you are not familiar with using IITC map for mapping out PokeStops and Gyms, I highly recommend you check out [Alfonso's PoGo Tools script](https://gitlab.com/AlfonsoML/pogo-s2/-/wikis/How-to-add-new-PoI-to-your-city). You will need to install this script first.) The original script added two links into the portal info screen to quickly copy to the clipboard the command to add the selected portal to your PokeNav POI database.

This script took this concept one step further, but sending the PokeNav POI command directly to your #PokeNav channel, using a Discord webhook.

Like the script by Sunkast, if the gym is marked as an EX eligible gym, it will also add the modifier to tag it as ex_eligible in PokeNav. A huge shout out for [tehstone](https://github.com/tehstone) for cleaning up the original code and making configuration a lot easier!

## Adding your webhook URL

You will need to add the full URL for your Discord webhook. Click on **POI Webhook Settings** to bring up the configuration dialog box.

![POI Webhook Settings link](https://i.imgur.com/CymRSyL.png)


In the settings, paste in the webhook URL for your #pokenav channel.

![Webhook Coniguration](https://i.imgur.com/xQ8fsKS.png)

Check out this [page](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks?page=1) if you need help making a webhook URL for your #pokenav channel.

## Customize Bot Username and Avatar

If you wish, you can also customize the webhook's name and avatar by changing the parameters in the POI Webhook Settings.

## Friendly Reminder—I am not a programmer!
Use this script at your own risk. I am not a Javascript programmer so I simply took some information from the helpful [webpage](https://dev.to/oskarcodes/send-automated-discord-messages-through-webhooks-using-javascript-1p01) by [Oskar Codes](https://github.com/oskar-codes) and plugged it into the existing script to get started. However, I am grateful to [tehstone](https://github.com/tehstone) who forked the script, cleaned up the code and added a settings dialog box. Great to have collaborators who know what they are doing!
