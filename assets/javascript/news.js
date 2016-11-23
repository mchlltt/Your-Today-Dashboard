$(document).ready(function () {
    // Initialize qurl and sourceIndex variables.
    var qurl;
    var sourceIndex;

    // News sources and their News API URLs.
    var news = [{
        source: "Ars Technica",
        url: "https://newsapi.org/v1/articles?source=ars-technica&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Associated Press",
        url: "https://newsapi.org/v1/articles?source=associated-press&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Bloomberg",
        url: "https://newsapi.org/v1/articles?source=bloomberg&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Business Insider",
        url: "https://newsapi.org/v1/articles?source=business-insider&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Buzzfeed",
        url: "https://newsapi.org/v1/articles?source=buzzfeed&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "CNN",
        url: "https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "CNBC",
        url: "https://newsapi.org/v1/articles?source=cnbc&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "The Economist",
        url: "https://newsapi.org/v1/articles?source=the-economist&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Engadget",
        url: "https://newsapi.org/v1/articles?source=engadget&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Entertainment Weekly",
        url: "https://newsapi.org/v1/articles?source=entertainment-weekly&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "ESPN",
        url: "https://newsapi.org/v1/articles?source=espn&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Fortune",
        url: "https://newsapi.org/v1/articles?source=fortune&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Google News",
        url: "https://newsapi.org/v1/articles?source=google-news&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Hacker News",
        url: "https://newsapi.org/v1/articles?source=hacker-news&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "The Huffington Post",
        url: "https://newsapi.org/v1/articles?source=the-huffington-post&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "IGN",
        url: "https://newsapi.org/v1/articles?source=ign&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Reddit",
        url: "https://newsapi.org/v1/articles?source=reddit-r-all&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Mashable",
        url: "https://newsapi.org/v1/articles?source=mashable&sortBy=latest&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "National Geographic",
        url: "https://newsapi.org/v1/articles?source=national-geographic&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "The New York Times",
        url: "https://newsapi.org/v1/articles?source=the-new-york-times&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "The Verge",
        url: "https://newsapi.org/v1/articles?source=the-verge&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "The Wall Street Journal",
        url: "https://newsapi.org/v1/articles?source=the-wall-street-journal&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Time",
        url: "https://newsapi.org/v1/articles?source=time&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }];

    // Make buttons on pageload.
    makeNewsSourceButtons();

    // Generate news sources on the left column
    function makeNewsSourceButtons() {
        for (var i = 0; i < news.length; i++) {
            var b = $('<div>').addClass('linkSource');
            var a = $('<a>').attr({
                'class': 'btnSource',
                'data-index': i
            });
            a.html(news[i].source);
            b.append(a);
            $('.buttons').append(b);
        }
    }


    // Event listner for when buttons are clicked.
    $(document).on('click', '.btnSource', linkClick);

    // Response to buttons being clicked.
    function linkClick() {
        sourceIndex = $(this).data('index');
        $('.article').empty();
        $('.article').append('<img src="assets/images/loading.svg" alt="loading spinner" class="center-block">');
        $('#source-name').text('Your News: ' + news[sourceIndex].source);
        getNews();
    }

    // API call and article div population.
    function getNews() {
        qurl = news[sourceIndex].url;
        $.ajax({
            url: qurl,
            method: 'GET'
        }).done(function (data) {
            $('.article').empty();
            for (var i = 0; i < 3; i++) {
                var row = $('<div class="row your-news">');
                var column = $('<div class="col-xs-12">');
                var heading = $('<h3>').html(data.articles[i].title);
                var description = $('<p>').html(data.articles[i].description);
                var link = $('<a href="' + data.articles[i].url + '" target="blank"></a>').html('Read more');
                row.append(column);
                column.append(heading, description, link);
                if (data.articles[i].urlToImage !== null) {
                    image = $('<img src="' + data.articles[i].urlToImage + '" onerror="this.style.display=\'none\'"/><hr/>');
                    image.addClass('img-responsive img-rounded mx-auto');
                    column.append(image);
                }
                $('.article').append(row);
            }
        });
    }
});