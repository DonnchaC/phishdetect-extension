// Copyright (c) 2018-2020 Claudio Guarnieri.
//
// This file is part of PhishDetect.
//
// PhishDetect is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// PhishDetect is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with PhishDetect.  If not, see <https://www.gnu.org/licenses/>.

class Config {

    //=========================================================================
    // Local Storage
    //=========================================================================
    initLocalStorage() {
        console.log("Initializing storage...");

        if (localStorage.cfg_node === undefined) {
            localStorage.cfg_node = NODE_DEFAULT_URL;
        }
        if (localStorage.cfg_api_key === undefined) {
            localStorage.cfg_api_key = "";
        }
        if (localStorage.cfg_node_enforce_user_auth === undefined) {
            localStorage.cfg_node_enforce_user_auth = true;
        }
        if (localStorage.cfg_node_enable_analysis === undefined) {
            localStorage.cfg_node_enable_analysis = false;
        }
        if (localStorage.cfg_node_contacts === undefined) {
            localStorage.cfg_node_contacts = "";
        }
        if (localStorage.cfg_update_frequency === undefined) {
            localStorage.cfg_update_frequency = 30;
        }
        if (localStorage.cfg_indicators === undefined) {
            localStorage.cfg_indicators = JSON.stringify({});
        }
        if (localStorage.cfg_last_update === undefined) {
            localStorage.cfg_last_update = "";
        }
        if (localStorage.cfg_send_alerts === undefined) {
            localStorage.cfg_send_alerts = true;
        }
        if (localStorage.cfg_webmails === undefined) {
            localStorage.cfg_webmails = true;
        }
        if (localStorage.cfg_contact === undefined) {
            localStorage.cfg_contact = "";
        }
        if (localStorage.cfg_detected_emails === undefined) {
            localStorage.cfg_detected_emails = JSON.stringify([]);
        }
        if (localStorage.cfg_reported_emails === undefined) {
            localStorage.cfg_reported_emails = JSON.stringify([]);
        }
        if (localStorage.cfg_last_error === undefined) {
            localStorage.cfg_last_error = "";
        }

        console.log("Storage initialization completed.");
    }

    //=========================================================================
    // Node
    //=========================================================================
    getNode() {
        const address = localStorage.getItem("cfg_node");
        if (!address.startsWith("http")) {
            return "https://" + address;
        }
        return address;
    }
    setNode(value) {
        const currentAddress = this.getNode()
        if (value == currentAddress) {
            return;
        }

        console.log("Attention! Reconfiguring PhishDetect Node...");

        // If we are changing the server, we also reset all the localStorage.
        localStorage.clear();
        // Then we set the new node.
        localStorage.setItem("cfg_node", value);
        // We reinitialize the storage.
        this.initLocalStorage();
        // And we pull the new config.
        this.fetchNodeConfig(function() {
            chrome.runtime.sendMessage({method: "nodeChanged"});
        });
    }
    restoreDefaultNode() {
        this.setNode(NODE_DEFAULT_URL);
    }

    //=========================================================================
    // API Keys
    //=========================================================================
    getApiKey() {
        return localStorage.getItem("cfg_api_key");
    }
    setApiKey(value) {
        localStorage.setItem("cfg_api_key", value);
        // We restore the good icon.
        chrome.browserAction.setIcon({path: chrome.extension.getURL("icons/icon@34.png")});
    }

    //=========================================================================
    // Node configuration
    //=========================================================================
    fetchNodeConfig(success, failure) {
        console.log("Fetching configuration from Node...");

        let url = this.getConfigURL()

        fetch(url)
        .then((response) => response.json())
        .then(data => {
            this.setNodeEnableAnalysis(data.enable_analysis);
            this.setNodeEnforceUserAuth(data.enforce_user_auth);

            console.log("Configuration fetched successfully.");
            // Calling success callback if all worked.
            success();
        })
        .catch(error => {
            console.log("ERROR: Connection failed: " + error);
            // Calling failure callback if errored.
            failure();
        });
    }
    getNodeEnableAnalysis() {
        return localStorage.getItem("cfg_node_enable_analysis") == "true" ? true : false;
    }
    setNodeEnableAnalysis(value) {
        localStorage.setItem("cfg_node_enable_analysis", value);
    }
    getNodeEnforceUserAuth() {
        return localStorage.getItem("cfg_node_enforce_user_auth") == "true" ? true : false;
    }
    setNodeEnforceUserAuth(value) {
        localStorage.setItem("cfg_node_enforce_user_auth", value);
    }

    //=========================================================================
    // Node URLs
    //=========================================================================
    getConfigURL() {
        return this.getNode() + NODE_API_CONFIG_PATH;
    }
    getAuthURL() {
        let url = this.getNode() + NODE_API_AUTH;
        if (this.getNodeEnforceUserAuth() == true) {
            url += "?key=" + this.getApiKey()
        }
        return url;
    }
    getRegisterURL() {
        return this.getNode() + NODE_GUI_REGISTER;
    }
    getLinkCheckURL(link) {
        return this.getNode() + NODE_GUI_LINK_CHECK + link + "/";
    }
    getReviewURL(ioc) {
        let url = this.getNode() + NODE_GUI_REVIEW;
        url += ioc + "/";
        if (this.getNodeEnforceUserAuth() == true) {
            url += "?key=" + this.getApiKey()
        }
        return url;
    }
    getSendAlertsURL(link) {
        let url = this.getNode() + NODE_GUI_REPORT;
        url += link + "/";
        if (this.getNodeEnforceUserAuth() == true) {
            url += "?key=" + this.getApiKey()
        }
        return url;
    }
    getIndicatorsURL() {
        let url = this.getNode() + NODE_API_INDICATORS_FETCH_PATH;
        if (this.getNodeEnforceUserAuth() == true) {
            url += "?key=" + this.getApiKey()
        }
        return url;
    }
    getRecentIndicatorsURL() {
        let url = this.getNode() + NODE_API_RECENT_INDICATORS_FETCH_PATH;
        if (this.getNodeEnforceUserAuth() == true) {
            url += "?key=" + this.getApiKey()
        }
        return url;
    }
    getEventsURL() {
        let url = this.getNode() + NODE_API_ALERTS_ADD_PATH;
        if (this.getNodeEnforceUserAuth() == true) {
            url += "?key=" + this.getApiKey()
        }
        return url;
    }
    getSendAlertssURL() {
        let url = this.getNode() + NODE_API_REPORTS_ADD_PATH;
        if (this.getNodeEnforceUserAuth() == true) {
            url += "?key=" + this.getApiKey()
        }
        return url;
    }

    //=========================================================================
    // Send alerts.
    //=========================================================================
    getSendAlerts() {
        return localStorage.getItem("cfg_send_alerts") == "true" ? true : false;
    }
    setSentAlerts(value) {
        localStorage.setItem("cfg_send_alerts", value);
    }

    //=========================================================================
    // Webmails integration.
    // TODO: rename this to something more descriptive.
    //=========================================================================
    getWebmails() {
        return localStorage.getItem("cfg_webmails") == "true" ? true : false;
    }
    setWebmails(value) {
        localStorage.setItem("cfg_webmails", value);
    }

    //=========================================================================
    // Indicators
    //=========================================================================
    getIndicators() {
        return JSON.parse(localStorage.getItem("cfg_indicators"));
    }
    setIndicators(value) {
        // If the domains and emails are undefined, something went wrong.
        if (value.domains === undefined || value.emails === undefined) {
            return;
        }

        localStorage.setItem("cfg_indicators", JSON.stringify(value));
    }

    //=========================================================================
    // Update time
    //=========================================================================
    getLastFullUpdateTime() {
        const lastUpdate = localStorage.getItem("cfg_last_update")
        if (lastUpdate == "") {
            return null;
        }

        return Date(lastUpdate);
    }
    setLastFullUpdateTime() {
        localStorage.setItem("cfg_last_update", getCurrentISODate())
    }

    //=========================================================================
    // User contact details
    //=========================================================================
    getContact() {
        return localStorage.getItem("cfg_contact");
    }
    setContact(value) {
        localStorage.setItem("cfg_contact", value);
    }

    //=========================================================================
    // Emails that were detected in webmail
    //=========================================================================
    getDetectedEmails() {
        return JSON.parse(localStorage.getItem("cfg_detected_emails"));
    }
    addDetectedEmail(value) {
        let emails = this.getDetectedEmails();
        emails.push(value);
        localStorage.setItem("cfg_detected_emails", JSON.stringify(emails));
    }

    //=========================================================================
    // Emails that were reported by the user to the Node
    //=========================================================================
    getReportedEmails() {
        return JSON.parse(localStorage.getItem("cfg_reported_emails"));
    }
    addReportedEmail(value) {
        let emails = this.getReportedEmails();
        emails.push(value);
        localStorage.setItem("cfg_reported_emails", JSON.stringify(emails));
    }
}

const cfg = new Config();
