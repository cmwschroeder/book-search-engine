const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                return foundUser = await User.findOne({
                    $or: [{ _id: context.user._id }, { username: context.user.username }],
                }).populate('savedBooks');
            }
            throw new AuthenticationError('No user logged in');
        }
    },
}

module.exports = resolvers;