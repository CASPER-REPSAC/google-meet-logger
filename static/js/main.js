setInterval(() => {
    chrome.storage.sync.get("members", (data) => {
        console.log(data.members);
    })
}, 2000);