// Write JavaScript here
const vid_list = document.getElementById("video-list-body");
const yt_embed_path = "https://www.youtube.com/embed/";

function thumbnail_path(id: string)
{
    return 'https://img.youtube.com/vi/' + id + '/0.jpg';
}
const vid_ids = ["v52D_O70Yfs",
                "swIlbBBt2G8",
                "DAp_v7EH9AA",
                "eRxdhQ5zNHs",
                "QsaFDzja-oE"]


function clearList(list: HTMLDivElement)
{   
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

function createVidEntry(id: string, title: string, channel: string)
{
    const entry = document.createElement("div");
    entry.classList.add("video-entry");
    const img = document.createElement("img");
    img.src = thumbnail_path(id);
    img.classList.add("video-entry-thumbnail");
    entry.appendChild(img);

    const info = document.createElement("div");
    info.classList.add("video-entry-info");
    const vidTitle = document.createElement("p");
    vidTitle.classList.add("video-entry-title");
    vidTitle.textContent = title;

    info.appendChild(vidTitle);
    const vidChannel = document.createElement("p");
    vidChannel.textContent = channel;
    vidChannel.classList.add("video-entry-channel");
    info.appendChild(vidChannel);

    entry.appendChild(info);
    return entry;
    
}