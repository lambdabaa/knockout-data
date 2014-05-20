var assert = require('chai').assert,
    kodata = require('kodata');

suite('kodata', function() {
  var User, Post, Comment, data;

  setup(function() {
    User = function User() {
    };
    User.properties = {
      name: { multiple: false, model: String }
    };

    Comment = function Comment() {
    };
    Comment.properties = {
      author: { multiple: false, model: User },
      body: { multiple: false, model: String }
    };

    Post = function Post() {
    };
    Post.properties = {
      author: { multiple: false, model: User },
      body: { multiple: false, model: String },
      comments: { multiple: true, model: Comment },
      likes: { multiple: false, model: Number },
      public: { multiple: false, model: Boolean }
    };

    data = {
      author: { name: 'Gareth' },
      body: 'Hello, world!',
      comments: [
        {
          author: {
            name: 'Alison'
          },
          body: 'Hooray!'
        },
        {
          author: {
            name: 'Norma Dan'
          },
          body: 'Welcome to Dollywood!'
        }
      ],
      likes: 11,
      public: false
    }
  });

  suite('#fromJSONValue', function() {
    test('should apply transform correctly', function() {
      var post = kodata.fromJSONValue(Post, data);
      assert.instanceOf(post, Post);
      assert.instanceOf(post.author, User);
      assert.strictEqual(post.author.name(), 'Gareth');
      assert.strictEqual(post.body(), 'Hello, world!');
      assert.isArray(post.comments);
      assert.lengthOf(post.comments, 2);
      assert.instanceOf(post.comments[0], Comment);
      assert.instanceOf(post.comments[0].author, User);
      assert.strictEqual(post.comments[0].author.name(), 'Alison');
      assert.strictEqual(post.comments[0].body(), 'Hooray!');
      assert.instanceOf(post.comments[1], Comment);
      assert.strictEqual(post.comments[1].author.name(), 'Norma Dan');
      assert.strictEqual(post.comments[1].body(), 'Welcome to Dollywood!');
    });

    test('should not modify input data', function() {
      var postData = Object.freeze(data);
      kodata.fromJSONValue(Post, postData);
    });
  });

  suite('#toJSONValue', function() {
    test('should apply transform correctly', function() {
      assert.deepEqual(
        data,
        kodata.toJSONValue(Post, kodata.fromJSONValue(Post, data))
      );
    });

    test('should not modify input data', function() {
      var post = Object.freeze(kodata.fromJSONValue(Post, data));
      var model = Object.freeze(Post);
      kodata.toJSONValue(model, post);
    });
  });
});
