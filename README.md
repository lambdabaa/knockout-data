knockout-data
=============

JSON data <> knockout observable bridge

### Motivation

Suppose you defined your models in the following way...

```js
function User() {
}
User.properties = {
  name: { multiple: false, model: String }
};

function Comment() {
}
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

Then suppose further that you were loading your model data from a JSON source/API. If you're using [knockoutjs](http://knockoutjs.com/) and you'd like to

+ make all of your json objects' properties "ko.observable()"
+ interact with `User`, `Post`, and `Comment` like objects with niceties like instance methods

then `kodata` is just what you need!

### Usage

#### kodata.fromJSONValue(model, data)

Hydrates json data into an instance of model.

#### kodata.toJSONValue(model, instance)

Dehydrates an instance of model into json data.

See the [test suite](https://github.com/gaye/knockout-data/tree/master/test) for fuller examples of how to use `kodata`.
