
const { Users, Thoughts } = require('../models')

module.exports = {

    async getUsers (req, res) {
        try {
          const users = await Users.find()
          .select('-__v');

          res.json(users);

        } catch (err) {
            console.log(`GET MULTIPLE USERS ERROR: ${err}`);
            return res.status(500).json(err);
        }
      },

      async getSingleUser (req,res) {
        try {
            const user = await Users.findOne({ _id: req.params.userId})
            .select('-__v')
            .populate('thoughts')
            .populate('friends');

            if (!user) {
                return res.status(404).json({ message: "No user matching that ID"})
            }
            res.json(user);

        } catch (err) {
            console.log(`GET SINGLE ERROR: ${err}`);
            return res.status(500).json(err);
        }
      },

      async updateUser (req,res) {
        try {
            const user = await Users.findOneAndUpdate(
                { _id: req.params.userId},
                { $set: req.body},
                { new: true, runValidators: true}
            )
            .select('-__v')
            .populate('thoughts')
            .populate('friends');

            if (!user) {
                return res.status(404).json({ message: "Provided ID doesn't match any user to update."})
            }
            res.json(user);
        } catch (err) {
            console.log(`UPDATING USER ERROR: ${err}`);
            return res.status(500).json(err)
        }
      },

      async createUser (req,res) {
        try {
            const user = await Users.create(req.body)
            res.json(user)
        } catch (err) {
            console.log(`CREATE USER ERROR: ${err}`);
            res.status(500).json(err)
        }
      },

      async addFriend (req,res) {
        try {
            const user = await Users.findOneAndUpdate(
                { _id: req.params.userId},
                { $addToSet: { friends: req.params.friendId} },
                { new: true }
            )
            .select('-__v')
            .populate('thoughts')
            .populate('friends');

            if (!user) {
                return res.status(404).json({ message: "Cannot add to friends: no user matching provided ID"})
            }
            res.json(user);

        } catch (err) {
            console.log(`ADD TO FRIEND ERROR: ${err}`);
            return res.status(500).json(err)
        }
      },

      async deleteFriend (req,res) {
        try {
            const user = await Users.findOneAndUpdate(
                { _id: req.params.userId},
                { $pull: { friends: req.params.friendId } },
                { new: true }
            )
            .select('-__v')
            .populate('thoughts')
            .populate('friends')

            if (!user) {
                return res.status(404).json({ message: "couldn't find a friend with that ID."})
            }
            res.json(user);

        } catch (err) {
            console.log(`REMOVE FRIEND ERROR: ${err}`);
            return res.status(500).json(err)
        }
      }
}
