(function(window, $, Backbone, _, undefined) {

  module("tbd", {
    setup: function() {
      this.coll = new Backbone.Collection([
        { id: 0, title: "Welcome Isaac Durazo" },
        { id: 1, title: "Ringmark Tests Open Source" },
        { id: 2, title: "Bocoup Gamelab" },
        { id: 3, title: "Strange wElCOMe" }
      ]);
    }
  });

  test("Defines a 'search' method on Backbone collections", 1, function() {
    equal(typeof this.coll.search, "function");
  });

  test("Returns correct matches", 5, function() {

    var results = this.coll.search("co");

    equal(results.length, 3, 'There are 3 matches');

    ok(results.get(this.coll.at(0)), '"Welcome Isaac Durazo" matches');
    ok(!results.get(this.coll.at(1)), '"Ringmark Tests Open Source" does not match');
    ok(results.get(this.coll.at(2)), '"Bocoup Gamelab" matches');
    ok(results.get(this.coll.at(3)), '"Strange wELCOMe" matches');

  });

  test("Search is case-insensitive by default", 1, function() {

    var results = this.coll.search("welcome");

    equal(results.length, 2);

  });

  test("Search does not consider attributes by default", function() {

    var results = this.coll.search("title");

    equal(results.length, 0);

  });

}(this, this.jQuery, this.Backbone, this._));
