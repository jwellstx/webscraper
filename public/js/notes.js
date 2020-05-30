$(() => {
    $(document).on("click", ".noteIt", function (e) {  // arrow notation doesnt work here?
        e.preventDefault();
        let title = $(this).parent().find("a").text().trim();
        let id = $(this).attr("data-id");
        $(".modal-title").text(title);
        $(".saveNote").attr("data-id", id);
        let data = {};
        data.id = $(this).attr("data-id");
        console.log(data);

        $.ajax({
            url: "/getNotes",
            method: "POST",
            data: data
        }).then(response => {
            console.log(response);
        })

        // do a get here to see if we already have any notes
    });

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
                // append to card here
            });
        }

    });
});