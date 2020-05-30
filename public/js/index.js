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

            let articles = $(".article");
            if (articles.length === 0) {
                let div = $("<div>");
                let noArticles = `
                <div class="row">
                    <div class="col-lg-12">
                        <p style="text-align: center; font-size: 3vh;">No articles scraped, click <a href="/scrape">here</a> to scrape new articles!</p>
                    </div>
                </div>
                `;
                div.append(noArticles);
                $(".appendArticles").append(div);
            }
        });
    });
});