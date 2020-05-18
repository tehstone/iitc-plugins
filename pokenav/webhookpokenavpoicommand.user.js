// ==UserScript==
// @id quickCopyPortalnameplus
// @name IITC Plugin: Webhook PokeNav POI Command
// @category Tweaks
// @version 0.0.1
// @namespace
// @description Sends command to add a Gym to PokeNav with one click
// @author forked from Forte and Sunkast
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
              `<p><label for="textWebhookUrl">Webhook URL</label><input type="text" id="textWebhookUrl" size="30" /></p>
               <p><label for="textBotName">Bot name</label><input type="text" id="textBotName" size="15" /></p>
               <p><label for="textAvatarUrl">Avatar URL</label><input type="text" id="textAvatarUrl" size="30" /></p>
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
    $('.linkdetails').append('<aside><a href="#" onclick="window.plugin.SendToWebhook.copyPortalAssistBot()">PokeNav Gym Webhook Command</a></aside>');
    $('.linkdetails').append('<aside><a href="#" onclick="window.plugin.SendToWebhook.copyAllData()">PokeNav PokeStop Webhook Command</a></aside>');
    };
    window.plugin.SendToWebhook.copyPortalAssistBot = function() {
      var portalData = window.portals[window.selectedPortal].options.data;
      var p_name = portalData.title;
      var p_latE6 = portalData.latE6;
      var p_lngE6 = portalData.lngE6;
      var p_lat =portalData.latE6 / 1E6;
      var p_lng = portalData.lngE6 / 1E6;
      var is_ex = document.getElementById('PogoGymEx');
      var convenientGoogleMapsURL = 'http://maps.google.com/?ll=' + p_latE6 / 1E6 + ',' + p_lngE6 / 1E6 + '&q=' + p_latE6 / 1E6 + ',' + p_lngE6 / 1E6;
      var convenientIntelURL= 'https://www.ingress.com/intel?ll=' + p_latE6 / 1E6 + ',' + p_lngE6 / 1E6 + '&q=' + p_latE6 / 1E6 + ',' + p_lngE6 / 1E6;
       if(is_ex && is_ex.checked){
	  var PortalAssistBottext ='$create poi gym "' + p_name + '" ' + p_lat + ' ' + p_lng + ' "ex_eligible: 1"';
  }
	else
      {var PortalAssistBottext ='$create poi gym "' + p_name + '" ' + p_lat + ' ' + p_lng + '';}
      //$('body').append('<textarea class="portal-name-textarea">' + p_name + '&#10;' + convenientGoogleMapsURL + '&#10;' + convenientIntelURL + '&#10;' + PortalAssistBot + '</textarea>');
      //$('body').append('<textarea class="portal-name-textarea">' + PortalAssistBot + '&#10;' + p_name + '&#10;' + convenientGoogleMapsURL + '&#10;' + convenientIntelURL + '</textarea>');
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

    window.plugin.SendToWebhook.copyAllData = function() {
      var portalData = window.portals[window.selectedPortal].options.data;
      var p_name = portalData.title;
      var p_latE6 = portalData.latE6;
      var p_lngE6 = portalData.lngE6;
      var p_lat = portalData.latE6 / 1E6;
      var p_lng = portalData.lngE6 / 1E6;

      var convenientGoogleMapsURL = 'GMAPS: http://maps.google.com/?ll=' + p_latE6 / 1E6 + ',' + p_lngE6 / 1E6 + '&q=' + p_latE6 / 1E6 + ',' + p_lngE6 / 1E6;
      var convenientIntelURL= 'INTEL: https://www.ingress.com/intel?ll=' + p_latE6 / 1E6 + ',' + p_lngE6 / 1E6 + '&q=' + p_latE6 / 1E6 + ',' + p_lngE6 / 1E6;
      var applemapsurl = 'APPLE: https://maps.apple.com/?ll=' + p_latE6 / 1E6 + ',' + p_lngE6 / 1E6 + '&q=' + p_latE6 / 1E6 + ',' + p_lngE6 / 1E6;
      var PortalAssistBottext ='$create poi pokestop "' + p_name + '" ' + p_lat + ' ' + p_lng + '';
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
