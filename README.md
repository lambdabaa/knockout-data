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

Then suppose further that you were loading your model data from a JSON source/API. If you're using knockoutjs and you'd like to interact with `User`, `Post`, and `Comment` like objects with nice things like instance methods, then `kodata` is just what you need!
