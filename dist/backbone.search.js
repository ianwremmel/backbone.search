/*! backbone.search - v0.1.0-pre - 2013-06-03
* https://github.com/boazsender/backbone.search
* Copyright (c) 2013 Boaz Sender; Licensed MIT */

/*! backbone.search - v0.1.0-pre - 2012-10-10
* https://github.com/boazsender/backbone.search
* Copyright (c) 2012 Boaz Sender; Licensed MIT */

/*! backbone.search - v0.1.0-pre - 2012-10-10
* https://github.com/boazsender/backbone.search
* Copyright (c) 2012 Boaz Sender; Licensed MIT */
/*global Backbone:false, _: false, console: false*/

(function(Backbone, _, $, undefined) {

  Backbone.Model.prototype.clearSearchScore = function(event) {
    this.off(null, Backbone.Model.prototype.clearSearchScore, this);
    this.unset('searchScore');
    this.unset('searchTerm');
  };

  Backbone.Model.prototype.getSearchScore = function(term) {
    if (this.has('searchScore') && (!term || (this.has('searchTerm') && this.get('searchTerm') === term))) {
      return this.get('searchScore');
    }

    var searchObject = this.searchFields ? this.pick(this.searchFields) : this.toJSON();
    var searchString = JSON.stringify(_.values(searchObject)).toLowerCase();
    var searchScore = searchString.score(term);

    this.set({
      searchScore: searchScore,
      searchTerm: term
    });

    // Setup listeners for any changes that could invalidate the score
    if (this.searchFields) {
      for (var i = 0; i < this.searchFields.length; i++) {
        this.on('change:' + this.searchFields[i], Backbone.Model.prototype.clearSearchScore, this);
      }
    }
    else {
      this.on('change', Backbone.Model.prototype.clearSearchScore, this);
    }

    return searchScore;
  };

  // Based on John Resig's jQuery LiveSearch: http://ejohn.org/blog/jquery-livesearch
  Backbone.Collection.prototype.search = function( term ) {

    term = $.trim( term.toLowerCase() );

    var scores = new Backbone.Collection();

    scores.comparator = function( model ) {
      return -1*model.getSearchScore( term );
    };

    if( term ) {
      this.each( function( model ){
        if ( model.getSearchScore(term) > 0 ) {
          scores.add(model, {sort: false});
        }
      });
    }

    scores.sort();

    return scores;
  };


  String.prototype.score = function( abbreviation ) {

    if( abbreviation.length === 0 ) {
      return 0.9;
    }

    if( abbreviation.length > this.length ) {
      return 0.0;
    }

    if (this.indexOf(abbreviation) !== -1) {
      return abbreviation.length/this.length;
    }

    return 0.0;

  };

}(Backbone, _, jQuery));
