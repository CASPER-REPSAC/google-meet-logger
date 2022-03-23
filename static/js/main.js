function tbodyHTML() {
    return `<tr class="logger-body">
                <td class="logger-name">{{name}}</td>
                <td class="logger-report">{{report}}</td>
                <td class="logger-status">{{status}}</td>
            </tr>`;
}
function onlineBadgeHTML(){
    return `<center><span class="badge badge-pill badge-success">On-line</span></center>`;
}
function offlineBadgeHTML(){
    return `<center><span class="badge badge-pill badge-danger">Off-line</span></center>`;
}
function reportHTML(){
    return `<div class="report-body d-inline-block">
                <div class="connect {{css}}">
                    {{status}}
                </div>
                <div class="time">
                    {{time}}
                </div>
            </div>`
}


function createData(members){
    const tbody = document.getElementsByClassName("logger-body")[0];
    tbody.innerHTML = '';

    for(let name in members){
        let report = createReport(members[name]);

        let html = tbodyHTML().replace("{{name}}", name)
                              .replace("{{report}}", report)
                              .replace("{{status}}", (members[name]["status"] ? onlineBadgeHTML() : offlineBadgeHTML()));

        tbody.innerHTML += html;
    }
}

function createReport(data){
    let report = '';

    for(let i=0; i<data["join_in"].length; i++){
        const j_timestamp = data["join_in"][i]["timestamp"].split(" ")[4];
        report += reportHTML().replace("{{css}}", "online")
                                .replace("{{status}}", "Con")
                                .replace("{{time}}", j_timestamp);
        
        if(data["get_out"].length >= i+1){
            const g_timestamp = data["get_out"][i]["timestamp"].split(" ")[4];
            report += reportHTML().replace("{{css}}", "offline")
                                    .replace("{{status}}", "Dis")
                                    .replace("{{time}}", g_timestamp);
        }
    }

    return report;
}



setInterval(() => {
    chrome.storage.sync.get("members", (data) => {
        console.log(data.members);
        createData(data.members);
    })
}, 2000);