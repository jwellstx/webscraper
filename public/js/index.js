$(() => {
    $(document).on("click", ".saveIt", function(e) {  // arrow notation doesnt work here?
        e.preventDefault();
        let data = {};
        
        data.id = $(this).attr("data-id");
        $.ajax({
            url: "/saveArticle",
            method: "POST",
            data: data
        }).then(response => {
            $(this).closest(".card").remove();
        });
    });
});