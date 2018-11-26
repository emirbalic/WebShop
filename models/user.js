const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectID;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    //store a cart object that has items array in user
    this.cart = cart;
    // this id is used to update a user in the updateCart()
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    //find if the index is the same as the one I am trying to add again
    // const cartProduct = this.cart.item.findIndex(cp = {

    //return true if the cp matches the id of the product I am trying to insert. If try I have to find the quantity

    //   return cp._id === product._id;
    // });


    const updatedCart = {
      //this will create an array 
      items: [
        {
          //spread op to pull all properties from the product object and then overwrite the property with the coma 
          // but I actually only need productId not to duplicate the date in the db
          productId: new ObjectId(product._id),
          quantity: 1
        }
      ]
    };
    // ... and now update a user to store a cart in there
    const db = getDb();
    return db
    .collection('users').updateOne(
      //find a user
      { _id: new ObjectId(this._id) },
      // describe how to update -- just updating the cart -- it will not merge but overwrite with the new cart
      { $set: { cart: updatedCart } }
    );
  }

  static findById(userId) {
    const db = getDb();
    return (
      db
        .collection('users')
        // if I use findOne({}) then I do not need a cursor like in find().next()
        .findOne({ _id: new ObjectId(userId) })
        .then(user => {
          console.log(user);
          return user;
        })
        .catch(err => {
          console.log(err);
        })
    );
  }
}

module.exports = User;
