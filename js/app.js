// Initialize array of lab data
var initialLabs = [
    {title: 'Lawrence Livermore National Laboratory', location: {lat: 37.687201, lng: -121.705886}},
    {title: 'Las Alamos National Laboratory', location: {lat: 35.844328, lng: -106.287173}},
    {title: 'Idaho National Laboratory', location: {lat: 43.586116, lng: -112.962233}},
    {title: 'Argonne National Laboratory', location: {lat: 41.718080, lng: -87.978262}},
    {title: 'Oak Ridge National Laboratory', location: {lat: 35.931462, lng: -84.309982}}];

var Lab = function(data) {
    /* Create new Lab instance.

       Args:
        data: an element from initialLabs array
    */

    // Create observable to keep track of lab name
    this.title = ko.observable(data.title);

    // Create observable to keep track of latlng
    this.location = ko.observable(data.location);

};

var ViewModel = function() {
    /* Create the Knockout viewmodel.


    */
    
    // Define self as the viewmodel
    var self = this;

    // Initialize lablist observable array
    this.labList = ko.observableArray([]);

    // Initialize selectedLab observable
    this.selectedLab = ko.observable();

    // Initialize Google Maps error message observable
    this.googleErrorMessage = ko.observable();

    this.mapError = function() {
        /* Handles error when rendering Google Maps API


        */

        self.googleErrorMessage("<div id='googleErrorMessage'>Error loading Google Maps API.</div>");
    };

    // Add each lab to the viewmodel's lablist observable array
    initialLabs.forEach(function(labItem) {
        self.labList.push(new Lab(labItem));
    });

    this.displaySpecificNews = function(selectedLab) {
        /* Display New York Times API news links for selected lab.

           Args:
            selectedLab: lab observable chosen by user
        */

        // Set newsElem to news id element using jQuery
        var $newsElem = $('#news');

        // Clear out news links
        $newsElem.text("");

        // NYT AJAX request URL
        var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q='+selectedLab.title()+'&sort=newest&api-key=0695f3deb8554240b3491936ac72d674'

        // Perform NYT AJAX request
        $.getJSON(nytimesUrl, function(data){

            // Retrieve articles
            articles = data.response.docs;

            // Go through each article and append its link and snippet to the news element
            for (var i=0; i<articles.length; i++) {
                var article = articles[i];
                $newsElem.append('<li class="article">' + 
                    '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                    '<p>'+article.snippet+'</p>'+
                    '</li>');
            };

        // Add error handling if NYT request fails
        }).error(function(e){
            $newsElem.append('<p id="newsErrorMessage">Error loading news.</p>')
        });
    };

    this.selectLab = function(clickedLab) {
        /* Display marker of selected lab from list along with NYT articles.

           Args:
            clickedLab: lab observable chosen by user
        */

        displaySpecificMarker(clickedLab);
        self.displaySpecificNews(clickedLab);
    };

    this.selectLabDrop = function() {
        /* Display marker of selected lab from dropdown along with NYT articles.

        */

        // If user did not choose a laboratory, then display all of them.
        // Otherwise, display just the requested one and its NYT articles.
        if (self.selectedLab() === undefined) {
            var $newsElem = $('#news');
            $newsElem.text("");
            displayAllMarkers();
        } else {
            displaySpecificMarker(self.selectedLab());
            self.displaySpecificNews(self.selectedLab());
        }
    };

    this.showAllLabs = function() {
        /* Display all lab markers and clear out news links. 


        */

        var $newsElem = $('#news');
        $newsElem.text("");
        displayAllMarkers();
    };

};

// Apply Knockout bindings
ko.applyBindings(ViewModel());