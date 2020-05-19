// ==UserScript==
// @id quickCopyPortalnameplus
// @name IITC Plugin: Webhook Kyogre POI Command
// @category Tweaks
// @version 0.5.0
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
  if (typeof window.plugin !== "function") window.plugin = function () {};

  const thisPlugin = window.plugin;
  const KEY_SETTINGS = "plugin-pokenav-webhook-settings";

  // Use own namespace for plugin
  window.plugin.SendToWebhook = function () {};

  // Name of the IITC build for first-party plugins
  plugin_info.buildName = "SendToWebhook";

  // Datetime-derived version of the plugin
  plugin_info.dateTimeVersion = "20190101000000";

  // ID/name of the plugin
  plugin_info.pluginId = "pokenavpoimanagement";

  const TIMERS = {};
  function createThrottledTimer(name, callback, ms) {
    if (TIMERS[name]) clearTimeout(TIMERS[name]);

    // throttle if there are several calls to the functions
    TIMERS[name] = setTimeout(function () {
      delete TIMERS[name];
      if (typeof window.requestIdleCallback == "undefined") callback();
      // and even now, wait for iddle
      else
        requestIdleCallback(
          function () {
            callback();
          },
          { timeout: 2000 }
        );
    }, ms || 100);
  }

  // The entry point for this plugin.
  function setup() {
    const QCPNotifcation =
      ".QCPNotification{width:200px;height:20px;height:auto;position:absolute;left:50%;margin-left:-100px;top:20px;z-index:10000;background-color: #383838;color: #F0F0F0;font-family: Calibri;font-size: 20px;padding:10px;text-align:center;border-radius: 2px;-webkit-box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1);-moz-box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1);box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1);}";
    $("head").append("<style>" + QCPNotifcation + "</style>");

    const titleCSS = ".title{cursor:pointer;}";
    $("head").append("<style>" + titleCSS + "</style>");

    $("body").append(
      "<div class='QCPNotification' style='display:none'>Webhook Sent</div>"
    );

    window.addHook(
      "portalDetailsUpdated",
      window.plugin.SendToWebhook.addButton
    );

    const toolbox = document.getElementById("toolbox");

    const buttonWebhook = document.createElement("a");
    buttonWebhook.textContent = "POI Webhook Settings";
    buttonWebhook.title = "Configuration for POI Webhook";
    buttonWebhook.addEventListener("click", thisPlugin.showSettingsDialog);
    toolbox.appendChild(buttonWebhook);

    loadSettings();
  }

  thisPlugin.showSettingsDialog = function () {
    const html =
              `<p><label for="textBotPrefix">Bot Command Prefix</label><br><input type="text" id="textBotPrefix" size="10" /></p>
               <p><label for="textBotName">Bot Display Name</label><br><input type="text" id="textBotName" size="20" /></p>
               <p><label for="textWebhookUrl">Webhook URL</label><br><input type="text" id="textWebhookUrl" size="40" /></p>
               <p><label for="textAvatarUrl">Avatar URL</label><br><input type="text" id="textAvatarUrl" size="40" /></p>
               <p><label for="selectBotType">Raid Bot</label>
                <select id="selectBotType">
                  <option value="kyogre">Kyogre</option>
                  <option value="meowth">Meowth</option>
                  <option value="pokenav">Pokenav</option>
                </select>
               <p>
              `;

    const width = Math.min(screen.availWidth, 420);
    const container = dialog({
      id: "settings",
      width: width + "px",
      html: html,
      title: "POI Webhook Settings",
    });

    const div = container[0];

    const textBotPrefixStr = div.querySelector("#textBotPrefix");
    textBotPrefixStr.value = settings.botPrefix;
    textBotPrefixStr.addEventListener("change", (e) => {
      settings.botPrefix = textBotPrefixStr.value;
      saveSettings();
    });

    const textWebhookUrlStr = div.querySelector("#textWebhookUrl");
    textWebhookUrlStr.value = settings.webhookUrl;

    textWebhookUrlStr.addEventListener("change", (e) => {
      settings.webhookUrl = textWebhookUrlStr.value;
      saveSettings();
    });

    const textBotNameStr = div.querySelector("#textBotName");
    textBotNameStr.value = settings.botName;

    textBotNameStr.addEventListener("change", (e) => {
      settings.botName = textBotNameStr.value;
      saveSettings();
    });

    const textAvatarUrlStr = div.querySelector("#textAvatarUrl");
    textAvatarUrlStr.value = settings.avatarUrl;

    textAvatarUrlStr.addEventListener("change", (e) => {
      settings.avatarUrl = textAvatarUrlStr.value;
      saveSettings();
    });

    const selectBotTypeSel = div.querySelector("#selectBotType");
    selectBotTypeSel.value = settings.botType;

    selectBotTypeSel.addEventListener("change", (e) => {
      settings.botType = selectBotTypeSel.value;
      saveSettings();
    });    
  };

  window.plugin.SendToWebhook.addButton = function () {
    $(".linkdetails").append(
      '<aside><a href="#" onclick="window.plugin.SendToWebhook.createPOICommand()">Create POI Command</a></aside><br>'
    );
    $(".linkdetails").append(
      '<aside><a href="#" onclick="window.plugin.SendToWebhook.convertToGymCommand()">Convert to Gym Command</a></aside><br>'
    );
    $(".linkdetails").append(
      '<aside><a href="#" onclick="window.plugin.SendToWebhook.markEXCommand()">Set Gym as EX Command</a></aside><br>'
    );
  };

  window.plugin.SendToWebhook.createPOICommand = function () {
    const poiType = getPoiType();
    if (poiType == "none") {
        alert("Please mark this POI as either a stop or gym and try again");
        return;
    }
    const portalData = window.portals[window.selectedPortal].options.data;
    let prompt = false;
    if (settings.botType == "kyogre") {
      prompt = true;
    }
    const commands = getCommands(portalData, prompt);
    
    let commandMessageText = "";
    if (poiType == "gym") {
        const is_ex = document.getElementById("PogoGymEx");
        commandMessageText = commands.gym_create;
        if (is_ex && is_ex.checked) {
            commandMessageText = commands.gym_create_ex;
        }
    } else {
        commandMessageText = commands.stop_create;
    }

    sendCommandToWebhook(settings.botPrefix + commandMessageText);
  };

  window.plugin.SendToWebhook.convertToGymCommand = function () {
    const portalData = window.portals[window.selectedPortal].options.data;
    let prompt = false;
    if (settings.botType == "pokenav") {
      prompt = true;
    }

    const commands = getCommands(portalData, prompt);

    const commandMessageText = settings.botPrefix + commands.convert_to_gym;

    sendCommandToWebhook(commandMessageText);
  };

  window.plugin.SendToWebhook.markEXCommand = function() {
    const portalData = window.portals[window.selectedPortal].options.data;
    let prompt = false;
    if (settings.botType == "pokenav") {
      prompt = true;
    }

    const commands = getCommands(portalData, prompt);

    const commandMessageText = settings.botPrefix + commands.mark_ex;

    sendCommandToWebhook(commandMessageText);
  }

  const getCommands = function(portalData, prompt) {
    const { p_name, p_lat, p_lng } = getPortalData(portalData);
    let label = "";
    if (prompt) {
      label = promptInfo();
    }

    const botCommandTemplates = { 
      "kyogre": 
        { "stop_create": `loc add stop, ${p_name}, ${p_lat} , ${p_lng}, ${label}`,
          "gym_create": `loc add gym, ${p_name}, ${p_lat} , ${p_lng}, ${label}`,
          "gym_create_ex": `loc add gym, ${p_name}, ${p_lat} , ${p_lng}, ${label}, true`,
          "mark_ex": `loc extoggle ${p_name}`,
          "convert_to_gym": `loc convert ${p_name}`
        },
      "meowth":
        {
          "stop_create": `addstop "${p_name}" ${p_lat} ${p_lng}`,
          "gym_create": `addgym "${p_name}" ${p_lat} ${p_lng}`,
          "gym_create_ex": `addexraidgym "${p_name}" ${p_lat} ${p_lng}`,
          "mark_ex": ``,
          "convert_to_gym": ``
        },
      "pokenav":
        {
          "stop_create": `create poi pokestop "${p_name}" ${p_lat} ${p_lng}`,
          "gym_create": `create poi gym "${p_name}" ${p_lat} ${p_lng}`,
          "gym_create_ex": `create poi gym "${p_name}" ${p_lat} ${p_lng} "ex_eligible: 1"`,
          "mark_ex": `update poi ${label} "ex_eligible: 1"`,
          "convert_to_gym": `update poi ${label} "type: gym"`
        }
    }
    return botCommandTemplates[settings.botType];
  };

  const getPoiType = function() {
      const gymEl = document.getElementsByClassName("pogoGym");
      const stopEl = document.getElementsByClassName("pogoStop");
      if (gymEl[0].className.includes("favorite")) {
          return "gym";
      }
      else if (stopEl[0].className.includes("favorite")) {
          return "stop";
      }
      return "none";
    };

  const promptInfo = function() {
    let promptAction = null;
    if (settings.botType == "pokenav") {
      promptAction = prompt("Please enter the ID number for this POI");
    }
    else if (settings.botType == "kyogre") {
      promptAction = prompt("Select the region this POI is in");
    }

    if (promptAction !== null && promptAction !== "") {
      return promptAction;
    } else {
      window.plugin.dialog.message("Failed. Choose a Region.");
      return false;
    }
  };

  const getPortalData = function (portalData) {
    return {
      p_name: portalData.title,
      p_lat: portalData.latE6 / 1e6,
      p_lng: portalData.lngE6 / 1e6,
    };
  };

  const sendCommandToWebhook = function (messageText) {
    let request = new XMLHttpRequest();
    request.open("POST", settings.webhookUrl);
    request.setRequestHeader("Content-type", "application/json");
    const params = {
      username: settings.botName,
      avatar_url: settings.avatarUrl,
      content: messageText,
    };
    request.send(JSON.stringify(params));
    $(".QCPNotification").fadeIn(400).delay(3000).fadeOut(400);
  };

  // Add an info property for IITC's plugin system
  setup.info = plugin_info;

  // Make sure window.bootPlugins exists and is an array
  if (!window.bootPlugins) window.bootPlugins = [];
  // Add our startup hook
  window.bootPlugins.push(setup);
  // If IITC has already booted, immediately run the 'setup' function
  if (window.iitcLoaded && typeof setup === "function") setup();

  const defaultSettings = {
    botPrefix: "!",
    webhookUrl: "",
    botName: "IngressMapper",
    avatarUrl:
      "https://cdn.discordapp.com/attachments/533291273914941460/711554807906959411/IngressMapper.jpg",
    botType: "pokenav"
  };

  let settings = defaultSettings;

  function saveSettings() {
    createThrottledTimer("saveSettings", function () {
      localStorage[KEY_SETTINGS] = JSON.stringify(settings);
    });
  }

  function loadSettings() {
    const tmp = localStorage[KEY_SETTINGS];
    try {
      settings = JSON.parse(tmp);
    } catch (e) {
      // eslint-disable-line no-empty
    }
    if (!settings.botPrefix) {
      settings.botPrefix = "!";
    }
    if (!settings.botType) {
      settings.botType = "pokenav";
    }
  }
}

// Create a script element to hold our content script
let script = document.createElement("script");
let info = {};

// GM_info is defined by the assorted monkey-themed browser extensions
// and holds information parsed from the script header.
if (typeof GM_info !== "undefined" && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description,
  };
}

// Create a text node and our IIFE inside of it
let textContent = document.createTextNode(
  "(" + wrapper + ")(" + JSON.stringify(info) + ")"
);
// Add some content to the script element
script.appendChild(textContent);
// Finally, inject it... wherever.
(document.body || document.head || document.documentElement).appendChild(
  script
);
