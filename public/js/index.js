$(() => {
    // when a user click the "save article" button,  update the documents saved:true
    $(document).on("click", ".saveIt", function(e) {  // arrow notation doesnt work here?
        e.preventDefault();
        let data = {};
        
        data.id = $(this).attr("data-id");
        $.ajax({
            url: "/saveArticle",
            method: "POST",
            data: data
        }).then(response => {
            // remove the card from scrape page to be populated in the saved articles page
            $(this).closest(".card").remove();

            // lets check if there are any present articles on the scrape page - if not notify the user
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