interface Video
{
    id: string,
    title: string,
    channel: string
};

var video_pool: Array<Video> = [];

const HOST = "127.0.0.1:3000/";
const vid_list = document.getElementById("video-list-body") as HTMLDivElement;
const list_observer = new MutationObserver(handleVidListChange);
list_observer.observe(vid_list, {childList: true, subtree: true});
const current_vid = document.getElementById("video-frame") as HTMLIFrameElement;
const yt_embed_path = "https://www.youtube.com/embed/";

const save_term_btn = document.getElementById("vocab-term-save") as HTMLButtonElement;
const save_term_input = document.getElementById("vocab-term-input") as HTMLInputElement;
const save_term_fam = document.getElementById("vocab-familiarity-select") as HTMLSelectElement;

const refresh_btn = document.getElementById("video-refresh-button");

save_term_input.addEventListener("change", () =>
{
    if (save_term_input.value === "")
    {
        save_term_btn.disabled = true;
    }
    else if (save_term_fam.value === "")
    {
        save_term_btn.disabled = true;
    }
    else
    {
        save_term_btn.disabled = false;
    }
});

save_term_fam.addEventListener("change", () =>
{
    if (save_term_fam.value === "")
    {
        save_term_btn.disabled = true;
    }
    else if (save_term_input.value === "")
    {
        save_term_btn.disabled = true;
    }
    else
    {
        save_term_btn.disabled = false;
    }
});

save_term_btn.addEventListener("click", (event: Event) =>
{
    const term = save_term_input.value.trim();
    const familiarity = save_term_fam.value;
    if (term === '' || familiarity === '')
    {
        event.preventDefault()
        save_term_input.classList.add("invalid");
        save_term_fam.classList.add("invalid");
        return;
    }
    const termInfo = {term: term, familiarity: familiarity};
    const response = fetch(
        `${HOST}/api/save-vocab`,
        {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(termInfo)
        }
    )
    response.then((data: Response) =>
    {
        if (data.status === 200)
        {
            clearTermForm();
        }
        else if (data.status === 500)
        {
            console.log("Server error saving term.");
            alert("Server Error saving vocab term.");
        }
    })
    .catch((err: Error) =>
    {
        console.error("Error on sending vocab term: ", err)
    });
});

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

function loadVideo(id: string)
{
    current_vid.src = yt_embed_path + id;
}

refresh_btn?.addEventListener("click", () =>
{
    clearList(vid_list);
    populateVidList();
});

function createVidEntry(id: string, title: string, channel: string)
{
    const entry = document.createElement("div");
    entry.title = title;
    entry.classList.add("video-entry");
    const img_div = document.createElement("div");
    img_div.classList.add("thumbnail-div");
    entry.appendChild(img_div);
    const img = document.createElement("img");
    img.src = thumbnail_path(id);
    img.classList.add("thumbnail");
    img_div.appendChild(img);

    const info = document.createElement("div");
    info.classList.add("video-entry-info");
    const vidTitle = document.createElement("p");
    vidTitle.classList.add("entry-title");
    vidTitle.textContent = title;

    info.appendChild(vidTitle);
    const vidChannel = document.createElement("p");
    vidChannel.textContent = channel;
    vidChannel.classList.add("entry-channel");
    info.appendChild(vidChannel);

    entry.appendChild(info);

    entry.addEventListener("click", () =>
    {
        loadVideo(id);
        vid_list?.removeChild(entry);
        const v = video_pool.pop();
        if (v)
        {
            const new_entry = createVidEntry(v.id, v.title, v.channel);
            vid_list.appendChild(new_entry);
        }
    });

    return entry;
    
}

function resetFormItem(element: HTMLInputElement | HTMLSelectElement)
{
    element.classList.remove("invalid");
    element.value = '';
}

function clearTermForm()
{
    resetFormItem(save_term_fam);
    resetFormItem(save_term_input);
}

function handleVidListChange()
{
    
}

function populateVidList(num_entries: number = 5)
{
    // Ensure Pool is populated
    if (video_pool.length < num_entries) 
    {
        populateVideoPool();
    }

    for (let i = 0; i < num_entries; i++)
    {
        const v = video_pool.pop() as Video;
        console.log(v);
        const entry = createVidEntry(v.id, v.title, v.channel);
        vid_list.appendChild(entry);
    }
}

function get_yt_videos(n: number = 10, channel: string = "How To Spanish")
{
    const config = {
        count: n,
        channel: channel
    };

    return fetch(
        `/api/get-youtube-videos?n=${n}`,
        {
            method: "GET",
        }
    )
}

function populateVideoPool(init: boolean = false)
{
    const result = get_yt_videos(100);
    result.then( content =>
    {
        if (!content.ok)
        {
            throw new Error("Error populating video pool.");
        }
        return content.json()
    })
    .then( data =>
    {
        for (const v of data)
        {
            video_pool.push(v);
        }
        if (init) populateVidList();
    })
    .catch( err =>
    {
        console.error(err);
    });
    console.log(video_pool);
}


populateVideoPool(true);