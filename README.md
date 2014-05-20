knockout-data
=============

JSON data <> knockout observable bridge

[Live test suite!](https://gaye.github.io/knockout-data/test/)

### Motivation

Suppose you defined your models in the following way...

```js
function User() {
  this.yellName = function() {
    return this.name().toUpperCase() + '!';
  };
}
User.properties = {
  name: { multiple: false, model: String }
};

function Comment() {
  this.commentLength = ko.computed(function() {
    return this.body().length;
  }.bind(this));
}
Comment.prototype.body = ko.observable();
Comment.properties = {
  author: { multiple: false, model: User },
  body: { multiple: false, model: String }
};

function Post() {
}
Post.properties = {
  author: { multiple: false, model: User },
  body: { multiple: false, model: String },
  comments: { multiple: true, model: Comment },
  likes: { multiple: false, model: Number },
  public: { multiple: false, model: Boolean }
};
```

Then suppose further that you load your model data from a JSON source/API. If you're using [knockoutjs](http://knockoutjs.com/) and you'd like to

+ make all of your json objects' properties "ko.observable()"
+ interact with `User`, `Post`, and `Comment` like objects with niceties like instance methods

then `kodata` is just what you need!

### Usage

#### kodata.fromJSONValue(model, data)

Recursively hydrates json data into an instance of model, makes all `Boolean`, `String`, and `Number` properties observable. Resolves one-to-many relationship with observable arrays.

#### kodata.toJSONValue(model, instance)

Dehydrates an instance of model into json data.

See the [test suite](https://github.com/gaye/knockout-data/tree/master/test) for fuller examples of how to use `kodata`.
