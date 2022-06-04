const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // getter for getting all books in the logged in user's saved list
        me: async (parent, args, context) => {
            //gets the current logged in user, if there is none then tell requester
            if (context.user) {
                //find user based on passed in id or username
                return foundUser = await User.findOne({
                    $or: [{ _id: context.user._id }, { username: context.user.username }],
                }).populate('savedBooks');
            }
            throw new AuthenticationError('No user logged in');
        }
    },
    Mutation: {
        //creates a user in the database
        createUser: async (parent, { username, email, password }) => {
            //take args and create a user in db with them
            const user = await User.create({ username, email, password });
            //create token for the user
            const token = signToken(user);
            //send back token and user info so that the client side can add token to local storage for requests
            return { token, user };
        },
        //login function that will check email and password
        login: async (parent, { email, password }) => {
            //check if there is a user with this email
            const user = await User.findOne({ email }).populate('savedBooks');
            //if there isn't then send back info saying no user with this email
            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }
            //check if the password matches the users password
            const correctPw = await user.isCorrectPassword(password);
            //if not tell the user
            if(!correctPw) {
                throw new AuthenticationError('Wrong password!');
            }
            //create a token to send back so that the client side can use it for requests in the future
            const token = signToken(user);
            return {token, user};
        },
        //mutation that will save the passed in book to the users saved book list
        saveBook: async (parent, {authors, description, bookId, image, link, title}, context) => {
            //check if there is a user logged in
            if(context.user) {
                //if there was then add the book with the given information to the logged in users saved book list
                return await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {savedBooks: {authors, description, bookId, image, link, title}}},
                    { new: true, runValidators: true}
                ).populate('savedBooks');
            }
            throw new AuthenticationError('No user logged in.');
        },
        //will remove a book from the logged in users saved book list
        deleteBook: async (parent, { bookId }, context) => {
            //check if there is a user logged in
            if(context.user) {
                //if there is then use the bookId to remove the book matching the id from the saved book list
                return await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId: bookId}}},
                    { new: true }
                ).populate('savedBooks');
            }
            throw new AuthenticationError('No user logged in.');
        }
    }
}

module.exports = resolvers;