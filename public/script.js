$.get("/filelist")
    .done((files) => {
        console.log(files);
        for (let i = 1; i < files.length; i++) {
            $("#files").append(
                `<div id="filesColumn">
                    <div class="filestyle">
                        <p>${files[i]}</p>
                    </div>
                    <button class="btn-download"><a href="/uploaded/${files[i]}">Download</a></button>
                    <button class="btn-delete"><a href="/delete/${files[i]}">Delete</a></button>
                </div>
                <br>`
            )
        }
    })
    .fail(() => {
        console.log("Error")
    })
