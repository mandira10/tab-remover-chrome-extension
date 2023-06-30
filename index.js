let myLeads = []
const myLeadsHistory = [];
const searchInput = document.getElementById("searchinput-el");
const deleteBtn = document.getElementById("delete-btn")
const revertBtn = document.getElementById("revert-btn");
const stabBtn = document.getElementById("stab-btn")
const sctabBtn = document.getElementById("sctab-btn")
const stabsBtn = document.getElementById("stabs-btn")
const sctabsBtn = document.getElementById("sctabs-btn")


const ulEl = document.getElementById("ul-el")
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}


stabBtn.addEventListener("click", function () {
    saveToHistory()
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let currentDate = new Date();
        let tabData = {
            url: tabs[0].url,
            favicon: tabs[0].favIconUrl,
            title: tabs[0].title,
            datetime: currentDate.toLocaleString()
        };

        if (!isDuplicate(tabData.url, tabData.datetime) && !tabs[i].url.startsWith("chrome")) {
            myLeads.push(tabData);
            localStorage.setItem("myLeads", JSON.stringify(myLeads))
            render(myLeads)
        }
    })
})

sctabBtn.addEventListener("click", function () {
    saveToHistory()
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let currentDate = new Date();
        let tabData = {
            url: tabs[0].url,
            favicon: tabs[0].favIconUrl,
            title: tabs[0].title,
            datetime: currentDate.toLocaleString()
        };

        if (!isDuplicate(tabData.url, tabData.datetime) && !tabs[i].url.startsWith("chrome")) {
            myLeads.push(tabData);
        }
        chrome.tabs.remove(tabs[0].id);
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads)
    })
})


function render(leads) {
    let listItems = "";
    let prevDate = "";

    for (let i = 0; i < leads.length; i++) {
        const itemDate = new Date(leads[i].datetime);
        const formattedDate = formatDate(itemDate);
        const displayDate = formattedDate !== prevDate ? formattedDate : "";
        prevDate = formattedDate;
        const favicon = leads[i].favicon && !leads[i].favicon.startsWith("chrome://") ? `<img src="${leads[i].favicon}" alt="Favicon" width="16" height="16" onerror="this.style.display='none'">` : "&nbsp;&nbsp;-&nbsp;&nbsp;";
        listItems += `
        <div class="datetime">${displayDate}</div>
            <li class="group">
                <div class="link-container">
                    <img class="favicon" src="${leads[i].favicon}" width="16" height="16">
                    <a class="link-text" href="${leads[i].url}" target="_blank">${leads[i].title}</a>
                </div>
                
            </li>
        `;
    }
    ulEl.innerHTML = listItems;
}


stabsBtn.addEventListener("click", function () {
    saveToHistory()
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
        for (let i = 0; i < tabs.length; i++) {
            let currentDate = new Date();
            let tabData = {
                url: tabs[i].url,
                favicon: tabs[i].favIconUrl,
                title: tabs[i].title,
                datetime: currentDate.toLocaleString()
            };

            if (!isDuplicate(tabData.url, tabData.datetime) && !tabs[i].url.startsWith("chrome")) {
                myLeads.push(tabData);
            }
        }
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads)
    })
})

sctabsBtn.addEventListener("click", function () {
    saveToHistory();
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
        // Open a new tab with your HTML page before closing other tabs
        for (let i = 0; i < tabs.length; i++) {

            let currentDate = new Date();
            let tabData = {
                url: tabs[i].url,
                favicon: tabs[i].favIconUrl,
                title: tabs[i].title,
                datetime: currentDate.toLocaleString()
            };

            if (!isDuplicate(tabData.url, tabData.datetime) && !tabs[i].url.startsWith("chrome")) {
                myLeads.push(tabData);
            }
            chrome.tabs.remove(tabs[i].id);
        }
        chrome.tabs.create({ url: 'index.html' });
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    });
});

deleteBtn.addEventListener("dblclick", function () {
    saveToHistory()
    localStorage.clear()
    myLeads = []
    render(myLeads)
})


function saveToHistory() {
    myLeadsHistory.push(JSON.parse(JSON.stringify(myLeads)));
}

revertBtn.addEventListener("click", function () {
    if (myLeadsHistory.length > 0) {
        myLeads = myLeadsHistory.pop();
        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        render(myLeads);
    } else {
        alert("No more changes to revert");
    }
});


function formatDate(dateObj) {
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth();
    const year = dateObj.getFullYear();

    const ordinalSuffix = (day % 10 === 1 && day !== 11)
        ? 'st'
        : (day % 10 === 2 && day !== 12)
            ? 'nd'
            : (day % 10 === 3 && day !== 13)
                ? 'rd'
                : 'th';

    return `${day}${ordinalSuffix} ${monthNames[monthIndex]}, ${year.toString().slice(-2)}`;
}


searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    filterList(searchTerm);
});

function filterList(searchTerm) {
    const filteredLeads = myLeads.filter((lead) => {
        const titleLowerCase = lead.title.toLowerCase();
        return titleLowerCase.includes(searchTerm);
    });

    render(filteredLeads);
}

function isDuplicate(url, datetime) {
    const itemDate = new Date(datetime).toLocaleDateString();

    return myLeads.some((lead) => {
        const leadDate = new Date(lead.datetime).toLocaleDateString();
        return lead.url === url && leadDate === itemDate;
    });
}