$(document).ready(function () {
    var qurl = "";
    newsSource = [{
        source: "Ars Technica",
        url: "https://newsapi.org/v1/articles?source=ars-technica&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Associated Press",
        url: "https://newsapi.org/v1/articles?source=associated-press&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Bloomberg",
        url: "https://newsapi.org/v1/articles?source=bloomberg&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "CNN",
        url: "https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Entertainment Weekly",
        url: "https://newsapi.org/v1/articles?source=entertainment-weekly&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "ESPN",
        url: "https://newsapi.org/v1/articles?source=espn&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Hacker News",
        url: "https://newsapi.org/v1/articles?source=hacker-news&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Reddit",
        url: "https://newsapi.org/v1/articles?source=reddit-r-all&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea"
    }, {
        source: "Wired",
    }];

    makeLinks();
    linkClick();

    function makeLinks() {
        for (var i = 0; i < newsSource.length; i++) {
            var b = $('<li>').addClass('linkSource');
            var a = $('<a>').attr({
                'class': 'linkSource',
                'data-index': i
            });
            a.html(newsSource[i].source);
            b.append(a);
            $('.buttons').append(b);
        }
    }
    var sourceIndex;

    function linkClick() {
        $(document).on('click', '.linkSource', function () {
            sourceIndex = $(this).data('index');
            $('.article').empty();
            $('.article').html('Loading...').addClass('your-news');
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
                var f = $('<div class="well col-md-12 col-sm-12 col-xs-12">');
                var a = $('<h3>').html(data.articles[i].title);
                var b = $('<p>').html(data.articles[i].description);
                var c = $('<img src="' + data.articles[i].urlToImage + '"/>');
                var e = $('<a href="' + data.articles[i].url + '" target="blank"></a>').html('Read more');
                c.addClass('img-responsive img-rounded mx-auto');
                f.append(a, b, e, c);
                $('.article').append(f);
            }
        });
    }
});