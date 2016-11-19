$(document).ready(function () {
    var qurl = "";
    newsSource = [{
        source: "arsTechnica",
        url: "https://newsapi.org/v1/articles?source=ars-technica&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "associatedPress",
        url: "https://newsapi.org/v1/articles?source=associated-press&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "cnn",
        url: "https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "entertainmentWeekly",
        url: "https://newsapi.org/v1/articles?source=entertainment-weekly&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "hackerNews",
        url: "https://newsapi.org/v1/articles?source=hacker-news&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "reddit",
        url: "https://newsapi.org/v1/articles?source=reddit-r-all&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "wired",
        url: "https://newsapi.org/v1/articles?source=wired-de&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }];

    makeButtons();
    buttonClick();

    function makeButtons() {
        for (var i = 0; i < newsSource.length; i++) {
            var a = $('<button>').attr({
                'class': 'btnSource btn btn-primary',
                'data-index': i
            });
            a.html(newsSource[i].source);
            $('.buttons').append(a);
        }
    }
    var sourceIndex;

    function buttonClick() {
        $(document).on('click', '.btnSource', function () {
            sourceIndex = $(this).data('index');
            getNews();
        });
    }

    function getNews() {
        qurl = newsSource[sourceIndex].url;
        $.ajax({
            url: qurl,
            method: 'GET'
        }).done(function (data) {
            $('.article').empty();
            for (var i = 0; i < 3; i++) {
                var d = $('<div class="well col-md-4 col-sm-4 col-xs-4">');
                var a = $('<h3>').html(data.articles[i].title);
                var b = $('<p>').html(data.articles[i].description);
                var c = $('<img src="' + data.articles[i].urlToImage + '"/>');
                c.addClass('img-responsive img-rounded mx-auto');
                d.append(a, b, c);
                $('.article').append(d);
            }
        });

    }
});