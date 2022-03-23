// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {console.log(response.farewell);
// });

class Member {
    constructor(){
        // this.name_list = ["Niverse U", "김종민_7202"];
        this.name_list = ["이예나","박수린","이준서","황원민","황대겸","황태웅","모진성","송민아","김준표","홍록경","정소연","위주언","박성용","김수빈","김지언","정성호","차원제","윤진혁","김지균","박강현","원대로","황준식","서재민","문승찬","최정윤","서예은","변지성","이진우"];
        this.google_meet_user_list = [];
        this.member_state = this.createMemberList();
    }

    createMemberList(){
        const return_data = {};

        for(const name of this.name_list){
            return_data[name] = {}
            return_data[name]["join_in"] = [];
            return_data[name]["get_out"] = [];
            return_data[name]["status"] = 0;
        }

        return return_data;
    }

    getMemberList(){
        this.google_meet_user_list = [];
        const google_meet_user_list = document.getElementsByClassName("zSX24d");

        for(const user of google_meet_user_list){
            this.google_meet_user_list.push(user.textContent);
        }
    }

    updateMemberState(){

        // 현재 접속한 사람들 로깅
        for(let name of this.google_meet_user_list){

            // 사전에 정의된 이름과 참석자의 이름이 다를 경우
            // 혹은 사전에 정의된 이름에 참석자의 이름이 없을 경우
            if(this.member_state[name] === undefined){
                continue;
            }


            // 처음으로 입장 했을 때, 시간 로깅
            if(this.member_state[name]["join_in"].length == 0){
                const tmp_join_attr = {"timestamp" : new Date().toLocaleString()};

                this.member_state[name]["join_in"].push(tmp_join_attr);
                this.member_state[name]["status"] = 1;
            }

            // 나간 후, 다시 들어 왔을 경우
            else if(this.member_state[name]["join_in"].length == this.member_state[name]["get_out"].length){
                const tmp_join_attr = {"timestamp" : new Date().toLocaleString()};

                this.member_state[name]["join_in"].push(tmp_join_attr);
                this.member_state[name]["status"] = 1;
            }
        }

        // 나간 사람 목록
        // 혹은 아직 안 들어 온 사람 목록
        const get_out_google_meet_list = this.name_list.filter(value => this.google_meet_user_list.indexOf(value) == -1);

        for(let name of get_out_google_meet_list){

            // 수업 시작 후, 들어오지 않았을 경우
            if(this.member_state[name]["join_in"].length == 0){
                continue;
            }

            // 수업 시작 후, 중간에 나갔을 경우
            if(this.member_state[name]["join_in"].length > this.member_state[name]["get_out"].length){
                const tmp_getout_attr = {"timestamp" : new Date().toLocaleString()};

                this.member_state[name]["get_out"].push(tmp_getout_attr);
                this.member_state[name]["status"] = 0;
            }
        }
    }


    saveMemeberState(){
        chrome.storage.sync.set({"members": this.member_state}, function() {
            console.log('Value is set to ');
        });
    }
}

const member = new Member();
let check_in_meet = 1;

const in_meet = setInterval(() => {
    const google_meet_member_icon = document.getElementsByClassName("r6xAKc"); 

    if(google_meet_member_icon.length && check_in_meet){
        check_in_meet = 0;
        google_meet_member_icon[1].querySelector("button").click();
    }

    if(!check_in_meet){
        member.getMemberList();
        member.updateMemberState();
        member.saveMemeberState();
        console.log(member.member_state);
    }
}, 1500);