// Copyright (c) 2018 Claudio Guarnieri.
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

"use strict";

const forge = require("node-forge");
const tldts = require("tldts");

window.sha256 = function sha256(target) {
    let md = forge.md.sha256.create();
    md.update(target);
    return md.digest().toHex();
}

window.getDomainFromURL = function getDomainFromURL(url) {
    let urlParsed = tldts.parse(url);
    return urlParsed.host;
}

window.getTopDomainFromURL = function getTopDomainFromURL(url) {
    let urlParsed = tldts.parse(url);
    return urlParsed.domain;
}
