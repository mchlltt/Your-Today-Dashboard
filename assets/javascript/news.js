$(document).ready(function () {
    var qurl = "https://newsapi.org/v1/sources?apiKey=3e7d2dc0d0f743f2977afde6e24105ea&language=en";
    var qurl2 = "https://newsapi.org/v1/articles?source=associated-press&sortBy=top&apiKey=3e7d2dc0d0f743f2977afde6e24105ea";
    $.ajax({
        url: qurl2,
        method: 'GET'
    }).done(function (data) {
        console.log(data);
        for (var i = 0; i < 3; i++) {
            var d = $('<div class="well col-md-4 col-sm-4 col-xs-4">');
            var a = $('<h3>').html(data.articles[i].title);
            var b = $('<p>').html(data.articles[i].description);
            var e = $('<a href="' + data.articles[i].url + '">').html('Read more');
            var c = $('<img src="' + data.articles[i].urlToImage + '"/>');
            c.addClass('img-responsive img-rounded mx-auto');
            d.append(a, b, e, c);
            $('.article').append(d);
        }
    });

});