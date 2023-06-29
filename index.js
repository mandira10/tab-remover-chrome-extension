let myLeads = []
let oldLeads = []
const inputEl = document.getElementById("input-el")
const deleteBtn = document.getElementById("delete-btn")

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
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        myLeads.push(tabs[0].url)
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads)
    })
})

sctabBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        myLeads.push(tabs[0].url)
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        chrome.tabs.remove(tabs[0].id)
        render(myLeads)
    })
})


function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}


stabsBtn.addEventListener("click", function () {
    chrome.tabs.query({currentWindow: true }, function (tabs) {
        for (let i = 0; i < tabs.length; i++) {
            myLeads.push(tabs[i].url)
        }
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads)
    })

})

sctabsBtn.addEventListener("click", function () {
    chrome.tabs.query({currentWindow: true }, function (tabs) {
        for (let i = 0; i < tabs.length; i++) {
            myLeads.push(tabs[i].url)
            chrome.tabs.remove(tabs[i].id)
        }
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads)
    })

})

deleteBtn.addEventListener("dblclick", function () {
    localStorage.clear()
    myLeads = []
    render(myLeads)
})


