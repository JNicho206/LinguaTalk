"use strict";
// Write JavaScript here
var vid_list = document.getElementById("video-list-body");
var yt_embed_path = "https://www.youtube.com/embed/";
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
function createVidEntry(id, title, channel) {
    var entry = document.createElement("div");
    entry.classList.add("video-entry");
    var img = document.createElement("img");
    img.src = thumbnail_path(id);
    img.classList.add("video-entry-thumbnail");
    entry.appendChild(img);
    var info = document.createElement("div");
    info.classList.add("video-entry-info");
    var vidTitle = document.createElement("p");
    vidTitle.classList.add("video-entry-title");
    vidTitle.textContent = title;
    info.appendChild(vidTitle);
    var vidChannel = document.createElement("p");
    vidChannel.textContent = channel;
    vidChannel.classList.add("video-entry-channel");
    info.appendChild(vidChannel);
    entry.appendChild(info);
    return entry;
}
