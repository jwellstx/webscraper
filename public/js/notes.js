$(() => {
    // if someone clicks "view notes" update modal with article information
    // then do an ajax call to see if any notes already exist and populate the modal.
    $(document).on("click", ".noteIt", function (e) {  // arrow notation doesnt work here?
        e.preventDefault();
        let title = $(this).closest(".summary").find(".articleTitle").text().trim();
        let id = $(this).attr("data-id");
        $(".modal-title").text(title);
        $(".saveNote").attr("data-id", id);
        let data = {};
        data.id = $(this).attr("data-id");

        $.ajax({
            url: "/getNotes",
            method: "POST",
            data: data
        }).then(response => {
            $("#currentNotes").empty();
            // populate modal with existing notes
            response.note.forEach(element => {
                let div = $("<div>");
                div.addClass("aNote");
                let commentStruct = `
                    <div class="row noteCSS">
                        <div class="col-lg-9">
                            <p>${element.note}</p>
                        </div>
                        <div class="col-lg-3">
                            <button type="button" data-noteId=${element._id} class="removeNote btn btn-danger">Delete</button>
                        </div>
                    </div>
                `;
                div.append(commentStruct);
                $("#currentNotes").append(div);
            });
        });
    });

    // if the user clicks "save note" for a new note, update the note db, link it to the article _id
    // then populate the modal with the new note
    $(document).on("click", ".saveNote", function (e) {
        e.preventDefault();
        let comment = {};

        comment.note = $("#note").val().trim();
        comment.id = $(this).attr("data-id");

        if (comment) {
            $.ajax({
                url: "/saveNote",
                method: "POST",
                data: comment
            }).then(response => {
                // populate modal with new note
                let div = $("<div>");
                div.addClass("aNote");
                let commentStruct = `
                    <div class="row noteCSS">
                        <div class="col-lg-9">
                            <p>${comment.note}</p>
                        </div>
                        <div class="col-lg-3">
                            <button type="button" data-noteId=${response.note[response.note.length - 1]} class="removeNote btn btn-danger">Delete</button>
                        </div>
                    </div>
                `;
                div.append(commentStruct);
                $("#currentNotes").append(div);

                // empty textbox
                $("#note").val("");
            });
        }
    });

    // if someone click to 'delete' note, delete note from db and then remove note from modal
    $(document).on("click", ".removeNote", function (e) {
        e.preventDefault()
        let data = {};
        data.id = $(this).attr("data-noteid");

        $.ajax({
            url: "/deleteNote",
            method: "POST",
            data: data
        }).then(response => {
            // remote note from modal
            $(this).closest(".aNote").remove();
        });
    });

    // if a user clicks on 'delete' article, delete the article from the db and remote it from the page
    $(document).on("click", ".deleteArticle", function (e) {
        e.preventDefault();
        let data = {}
        data.id = $(this).attr("data-id");
        console.log(data);

        $.ajax({
            url: "/deleteArticle",
            method: "POST",
            data: data
        }).then(response => {
            // remove saved article from current page
            $(this).closest(".card").remove();

            // lets check to see if there are any saved articles on the page, if not let the user know
            // and suggest to go scrape more articles to save
            let articles = $(".article");
            if (articles.length === 0) {
                let div = $("<div>");
                let noArticles = `
                <div class="row">
                    <div class="col-lg-12">
                        <p style="text-align: center; font-size: 3vh;">No articles saved, go back to the <a href="/">home
                            page</a> to scrape and save new articles!</p>
                    </div>
                </div>
                `;
                div.append(noArticles);
                $(".appendArticles").append(div);
            }
        });
    });
});