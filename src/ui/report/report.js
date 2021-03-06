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

function loadContent() {
    const href = new URL(location.href);
    const reportType = href.searchParams.get("type");
    const reportContent = href.searchParams.get("content");

    if (reportType == "url") {
        const cleanURL = $("<span>").text(reportContent).html();
        $("#reportedURL").html(cleanURL);
        $("#urlReport").show();
    } else if (reportType == "email") {
        $("#emailReport").show();
    }
}

document.addEventListener("DOMContentLoaded", cfg.loadFromBackground(loadContent));
