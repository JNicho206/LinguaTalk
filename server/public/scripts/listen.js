"use strict";
;
var video_pool = [];
var HOST = "127.0.0.1:3000/";
var vid_list = document.getElementById("video-list-body");
var list_observer = new MutationObserver(handleVidListChange);
list_observer.observe(vid_list, { childList: true, subtree: true });
var current_vid = document.getElementById("video-frame");
var yt_embed_path = "https://www.youtube.com/embed/";
var save_term_btn = document.getElementById("vocab-term-save");
var save_term_input = document.getElementById("vocab-term-input");
var save_term_fam = document.getElementById("vocab-familiarity-select");
var refresh_btn = document.getElementById("video-refresh-button");
save_term_input.addEventListener("change", function () {
    if (save_term_input.value === "") {
        save_term_btn.disabled = true;
    }
    else if (save_term_fam.value === "") {
        save_term_btn.disabled = true;
    }
    else {
        save_term_btn.disabled = false;
    }
});
save_term_fam.addEventListener("change", function () {
    if (save_term_fam.value === "") {
        save_term_btn.disabled = true;
    }
    else if (save_term_input.value === "") {
        save_term_btn.disabled = true;
    }
    else {
        save_term_btn.disabled = false;
    }
});
save_term_btn.addEventListener("click", function (event) {
    var term = save_term_input.value.trim();
    var familiarity = save_term_fam.value;
    if (term === '' || familiarity === '') {
        event.preventDefault();
        save_term_input.classList.add("invalid");
        save_term_fam.classList.add("invalid");
        return;
    }
    var termInfo = { term: term, familiarity: familiarity };
    var response = fetch("".concat(HOST, "/api/save-vocab"), {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(termInfo)
    });
    response.then(function (data) {
        if (data.status === 200) {
            clearTermForm();
        }
        else if (data.status === 500) {
            console.log("Server error saving term.");
            alert("Server Error saving vocab term.");
        }
    })
        .catch(function (err) {
        console.error("Error on sending vocab term: ", err);
    });
});
function thumbnail_path(id) {
    return 'https://img.youtube.com/vi/' + id + '/0.jpg';
}
var vid_ids = ["v52D_O70Yfs",
    "swIlbBBt2G8",
    "DAp_v7EH9AA",
    "eRxdhQ5zNHs",
    "QsaFDzja-oE"];
function clearList(list) {
    list.innerHTML = '';
}
// document.getElementById("vocab-term-save").addEventListener("click", () =>
// {
//     vid_list.innerHTML = '';
//     vid_ids.forEach(id => 
//     {
//         const entry = createVidEntry(id, "Test Title", "How To Spanish");
//         vid_list.appendChild(entry);
//     });
// })
function loadVideo(id) {
    current_vid.src = yt_embed_path + id;
}
refresh_btn === null || refresh_btn === void 0 ? void 0 : refresh_btn.addEventListener("click", function () {
    clearList(vid_list);
    populateVidList();
});
function createVidEntry(id, title, channel) {
    var entry = document.createElement("div");
    entry.title = title;
    entry.classList.add("video-entry");
    var img_div = document.createElement("div");
    img_div.classList.add("thumbnail-div");
    entry.appendChild(img_div);
    var img = document.createElement("img");
    img.src = thumbnail_path(id);
    img.classList.add("thumbnail");
    img_div.appendChild(img);
    var info = document.createElement("div");
    info.classList.add("video-entry-info");
    var vidTitle = document.createElement("p");
    vidTitle.classList.add("entry-title");
    vidTitle.textContent = title;
    info.appendChild(vidTitle);
    var vidChannel = document.createElement("p");
    vidChannel.textContent = channel;
    vidChannel.classList.add("entry-channel");
    info.appendChild(vidChannel);
    entry.appendChild(info);
    entry.addEventListener("click", function () {
        loadVideo(id);
        vid_list === null || vid_list === void 0 ? void 0 : vid_list.removeChild(entry);
        var v = video_pool.pop();
        if (v) {
            var new_entry = createVidEntry(v.id, v.title, v.channel);
            vid_list.appendChild(new_entry);
        }
    });
    return entry;
}
function resetFormItem(element) {
    element.classList.remove("invalid");
    element.value = '';
}
function clearTermForm() {
    resetFormItem(save_term_fam);
    resetFormItem(save_term_input);
}
function handleVidListChange() {
}
function populateVidList(num_entries) {
    if (num_entries === void 0) { num_entries = 5; }
    // Ensure Pool is populated
    if (video_pool.length < num_entries) {
        populateVideoPool();
    }
    for (var i = 0; i < num_entries; i++) {
        var v = video_pool.pop();
        console.log(v);
        var entry = createVidEntry(v.id, v.title, v.channel);
        vid_list.appendChild(entry);
    }
}
function get_yt_videos(n, channel) {
    if (n === void 0) { n = 10; }
    if (channel === void 0) { channel = "How To Spanish"; }
    var config = {
        count: n,
        channel: channel
    };
    return fetch("/api/get-youtube-videos?n=".concat(n), {
        method: "GET",
    });
}
function populateVideoPool(init) {
    if (init === void 0) { init = false; }
    var result = get_yt_videos(100);
    result.then(function (content) {
        if (!content.ok) {
            throw new Error("Error populating video pool.");
        }
        return content.json();
    })
        .then(function (data) {
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var v = data_1[_i];
            video_pool.push(v);
        }
        if (init)
            populateVidList();
    })
        .catch(function (err) {
        console.error(err);
    });
    console.log(video_pool);
}
populateVideoPool(true);
