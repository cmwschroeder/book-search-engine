const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return foundUser = await User.findOne({
                    $or: [{ _id: context.user._id }, { username: context.user.username }],
                }).populate('savedBooks');
            }
            throw new AuthenticationError('No user logged in');
        }
    },
    Mutation: {
        createUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password }).populate('savedBooks');
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email }).populate('savedBooks');
            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }
            const correctPw = await user.isCorrectPassword(body.password);
            if(!correctPw) {
                throw new AuthenticationError('Wrong password!');
            }
            const token = signToken(user);
            return {token, user};
        },
        saveBook: async (parent, {authors, description, bookId, image, link, title}, context) => {
            if(context.user) {
                return await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {savedBooks: {authors, description, bookId, image, link, title}}},
                    { new: true, runValidators: true}
                ).populate('savedBooks');
            }
            throw new AuthenticationError('No user logged in.');
        },
        deleteBook: async (parent, { bookId }, context) => {
            if(context.user) {
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