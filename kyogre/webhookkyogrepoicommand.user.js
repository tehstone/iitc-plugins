// ==UserScript==
// @id quickCopyPortalnameplus
// @name IITC Plugin: Webhook Kyogre POI Command
// @category Tweaks
// @version 0.1.0
// @namespace
// @description Sends command to add a Gym to PokeNav with one click
// @author tehstone. based on work by typographynerd, forked from Forte and Sunkast
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

/* globals dialog */

// Wrapper function that will be stringified and injected
// into the document. Because of this, normal closure rules
// do not apply here.
function wrapper(plugin_info) {
    // Make sure that window.plugin exists. IITC defines it as a no-op function,
    // and other plugins assume the same.
    if (typeof window.plugin !== 'function') window.plugin = function() {};

    const thisPlugin = window.plugin;
    const KEY_SETTINGS = 'plugin-pokenav-webhook-settings';

    // Use own namespace for plugin
    window.plugin.SendToWebhook = function() {};

    // Name of the IITC build for first-party plugins
    plugin_info.buildName = 'SendToWebhook';

    // Datetime-derived version of the plugin
    plugin_info.dateTimeVersion = '20190101000000';

    // ID/name of the plugin
    plugin_info.pluginId = 'pokenavpoimanagement';

    const TIMERS = {};
    function createThrottledTimer(name, callback, ms) {
        if (TIMERS[name])
            clearTimeout(TIMERS[name]);

        // throttle if there are several calls to the functions
        TIMERS[name] = setTimeout(function () {
            delete TIMERS[name];
            if (typeof window.requestIdleCallback == 'undefined')
                callback();
            else
                // and even now, wait for iddle
                requestIdleCallback(function () {
                    callback();
                }, {timeout: 2000});

        }, ms || 100);
    }

    // The entry point for this plugin.
    function setup() {
      var QCPNotifcation = '.QCPNotification{width:200px;height:20px;height:auto;position:absolute;left:50%;margin-left:-100px;top:20px;z-index:10000;background-color: #383838;color: #F0F0F0;font-family: Calibri;font-size: 20px;padding:10px;text-align:center;border-radius: 2px;-webkit-box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1);-moz-box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1);box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1);}';
      $('head').append("<style>" + QCPNotifcation + "</style>");

      var titleCSS = '.title{cursor:pointer;}';
      $('head').append("<style>" + titleCSS + "</style>");

      $('body').append("<div class='QCPNotification' style='display:none'>Webhook Sent</div>");

      window.addHook('portalDetailsUpdated', window.plugin.SendToWebhook.addButton);

      const toolbox = document.getElementById('toolbox');

      const buttonWebhook = document.createElement('a');
      buttonWebhook.textContent = 'POI Webhook Settings';
      buttonWebhook.title = 'Configuration for POI Webhook';
      buttonWebhook.addEventListener('click', thisPlugin.showSettingsDialog);
      toolbox.appendChild(buttonWebhook);

      loadSettings();
    };

    thisPlugin.showSettingsDialog = function() {
        const html =
              `<p><label for="textBotName">Bot Display Name</label><br><input type="text" id="textBotName" size="20" /></p>
               <p><label for="textWebhookUrl">Webhook URL</label><br><input type="text" id="textWebhookUrl" size="40" /></p>
               <p><label for="textAvatarUrl">Avatar URL</label><br><input type="text" id="textAvatarUrl" size="40" /></p>
              `;

        const width = Math.min(screen.availWidth, 420);
        const container = dialog({
            id: 'settings',
            width: width + 'px',
            html: html,
            title: 'POI Webhook Settings'
        });

        const div = container[0];

        const textWebhookUrlStr = div.querySelector('#textWebhookUrl');
        textWebhookUrlStr.value = settings.webhookUrl;

        textWebhookUrlStr.addEventListener('change', e => {
            settings.webhookUrl = textWebhookUrlStr.value;
            saveSettings();
        });

        const textBotNameStr = div.querySelector('#textBotName');
        textBotNameStr.value = settings.botName;

        textBotNameStr.addEventListener('change', e => {
            settings.botName = textBotNameStr.value;
            saveSettings();
        });

        const textAvatarUrlStr = div.querySelector('#textAvatarUrl');
        textAvatarUrlStr.value = settings.avatarUrl;

        textAvatarUrlStr.addEventListener('change', e => {
            settings.avatarUrl = textAvatarUrlStr.value;
            saveSettings();
        });
    }


    window.plugin.SendToWebhook.addButton = function() {
    $('.linkdetails').append('<aside><a href="#" onclick="window.plugin.SendToWebhook.convertToGymCommand()">Convert to Gym Command</a></aside>');
    $('.linkdetails').append('<aside><a href="#" onclick="window.plugin.SendToWebhook.createGymCommand()">Create Gym Command</a></aside>');
    $('.linkdetails').append('<aside><a href="#" onclick="window.plugin.SendToWebhook.createStopCommand()">Create PokeStop Command</a></aside>');
    };

    window.plugin.SendToWebhook.convertToGymCommand = function() {
      var portalData = window.portals[window.selectedPortal].options.data;
      const { p_name, p_lat, p_lng } = getPortalData(portalData);

      var PortalAssistBottext ='!loc convert ' + p_name;

      var request = new XMLHttpRequest();
      request.open("POST", settings.webhookUrl);

      request.setRequestHeader('Content-type', 'application/json');

      var params = {
        username: "IngressMapper",
        avatar_url: "https://cdn.discordapp.com/attachments/533291273914941460/711554807906959411/IngressMapper.jpg",
        content: PortalAssistBottext
      }

      request.send(JSON.stringify(params));

      $('.QCPNotification').fadeIn(400).delay(3000).fadeOut(400);
    }

    window.plugin.SendToWebhook.createGymCommand = function() {
      var portalData = window.portals[window.selectedPortal].options.data;
      const { p_name, p_lat, p_lng } = getPortalData(portalData);
      var is_ex = document.getElementById('PogoGymEx');
      var label = window.plugin.SendToWebhook.chooseNewLabel();

      if(is_ex && is_ex.checked) {
          var PortalAssistBottext ='!loc add gym, ' + p_name + ', ' + p_lat + ', ' + p_lng + ', ' + label + ', true';
      }
      else {
          var PortalAssistBottext ='!loc add gym, ' + p_name + ', ' + p_lat + ', ' + p_lng + ', ' + label;
      }

      var request = new XMLHttpRequest();
      request.open("POST", settings.webhookUrl);

      request.setRequestHeader('Content-type', 'application/json');

      var params = {
        username: "IngressMapper",
        avatar_url: "https://cdn.discordapp.com/attachments/533291273914941460/711554807906959411/IngressMapper.jpg",
        content: PortalAssistBottext
      }

      request.send(JSON.stringify(params));

      $('.QCPNotification').fadeIn(400).delay(3000).fadeOut(400);
    };

    window.plugin.SendToWebhook.chooseNewLabel = function(){
        var promptAction = prompt('Select the region this POI is in');

        if(promptAction !== null && promptAction !== ''){
            return promptAction;
        }else{
            window.plugin.layersProfiles.dialog.message('Failed. Choose a Region.');
            return false;
        }
    }

    window.plugin.SendToWebhook.createStopCommand = function() {
      var portalData = window.portals[window.selectedPortal].options.data;
      const { p_name, p_lat, p_lng } = getPortalData(portalData);

      var label = window.plugin.SendToWebhook.chooseNewLabel();

      var PortalAssistBottext ='!loc add stop, ' + p_name + ', ' + p_lat + ', ' + p_lng + ', ' + label;

      var request = new XMLHttpRequest();
      request.open("POST", settings.webhookUrl);

      request.setRequestHeader('Content-type', 'application/json');

      var params = {
        username: settings.botName,
        avatar_url: settings.avatarUrl,
        content: PortalAssistBottext
      }

      request.send(JSON.stringify(params));

      $('.QCPNotification').fadeIn(400).delay(3000).fadeOut(400);
    };

    const getPortalData = function(portalData) {
      return {
        "p_name": portalData.title,
        "p_lat": portalData.latE6 / 1e6,
        "p_lng": portalData.lngE6 / 1e6,
      };
    };


    // Add an info property for IITC's plugin system
    setup.info = plugin_info;

    // Make sure window.bootPlugins exists and is an array
    if (!window.bootPlugins) window.bootPlugins = [];
    // Add our startup hook
    window.bootPlugins.push(setup);
    // If IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function') setup();

    const defaultSettings = {
        webhookUrl: "",
        botName: "IngressMapper",
        avatarUrl: "https://cdn.discordapp.com/attachments/533291273914941460/711554807906959411/IngressMapper.jpg"
    };

    let settings = defaultSettings;

    function saveSettings() {
        createThrottledTimer('saveSettings', function () {
            localStorage[KEY_SETTINGS] = JSON.stringify(settings);
        });
    }

    function loadSettings() {
        const tmp = localStorage[KEY_SETTINGS];
        try	{
            settings = JSON.parse(tmp);
        } catch (e) { // eslint-disable-line no-empty
        }
    }
  }


  // Create a script element to hold our content script
  var script = document.createElement('script');
  var info = {};

  // GM_info is defined by the assorted monkey-themed browser extensions
  // and holds information parsed from the script header.
  if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    info.script = {
      version: GM_info.script.version,
      name: GM_info.script.name,
      description: GM_info.script.description
    };
  }

  // Create a text node and our IIFE inside of it
  var textContent = document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ')');
  // Add some content to the script element
  script.appendChild(textContent);
  // Finally, inject it... wherever.
  (document.body || document.head || document.documentElement).appendChild(script);
