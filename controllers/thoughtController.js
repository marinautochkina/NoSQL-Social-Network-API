
const { Users, Thoughts } = require('../models')

module.exports = {

    async getThoughts (req,res) {
        try {
            const thought = await Thoughts.find()
            .select('-__v');

            res.json(thought);
            
        } catch (err) {
            console.log(`GET MULTIPLE THOUGHTS ERROR: ${err}`);
            return res.status(500).json(err);
        }
    },

    async getSingleThought (req,res) {
        try {
            const thought = await Thoughts.findOne({
                _id: req.params.thoughtId
            }).select('-__v');

            if (!thought) {
                return res.status(404).json({ message: "No thought matching that ID"})
            }

            res.json(thought)

        } catch (err) {
            console.log(`GET SINGLE THOUGHTS ERROR: ${err}`);
            return res.status(500).json(err);
        }
    },

    async createThought (req,res) {
        try {
            const thought = await Thoughts.create(req.body);

            const user = await Users.findOneAndUpdate(
                { _id: req.body.userId},
                { $push: { thoughts: thought._id}},
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: "No User matching that ID."})
            }

            res.status(201).json({ message: "Thought created and associated with user!", thought });

        } catch (err) {
            console.log(`CREATE THOUGHTS ERROR: ${err}`);
            return res.status(500).json(err);
        }
    },
    
    async updateThought (req,res) {
        try {
            const thought = await Thoughts.findOneAndUpdate(
                { _id: req.params.thoughtId},
                { $set: req.body },
                { runValidators: true, new: true}
            )
            if (!thought) {
                return res.status(404).json({ message: "Thought couldn't be updated: invalid thought ID"})
            }

            res.json(thought)

        } catch (err) {
            console.log(`UPDATE THOUGHTS ERROR: ${err}`);
            return res.status(500).json(err);
        }
    },

    async deleteThought (req,res) {
        try {
            const thought = await Thoughts.findOneAndDelete(
                { _id: req.params.thoughtId}
            )

            if (!thought) {
                return res.status(404).json({ message: "Unable to delete thought: invalid thought id"})
            }

            const user = await Users.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId }},
                { new: true }
            )

            if (!user) {
                return res.status(404).json ({ message: "Thought deleted but doesnt belong to any user."})
            }
            
            res.json({ message: "Thought and user data updated"})

        } catch (err) {
            console.log(`DELETE THOUGHTS ERROR: ${err}`);
            return res.status(500).json(err);
        }
    },

    async createReaction (req,res) {
        try {
            const thought = await Thoughts.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: {reactions: req.body} },
                { new: true, runValidators: true }
            )
            if (!thought) {
                return res.status(404).json({ message: "No thought found with that ID"})
            }
            res.json(thought);

        } catch (err) {
            console.log(`ADD REACTION ERROR: ${err}`);
            return res.status(500).json(err);
        }
    }, 

    async deleteReaction (req,res) {
        try {

            console.log(`Attempting to delete reaction with ID: ${req.params.reactionId} from thought with ID: ${req.params.thoughtId}`);
            
            const thought = await Thoughts.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: {reactions: { _id: req.params.reactionId } } },
                { new: true, runValidators: true }
            )
            if (!thought) {
                return res.status(404).json({ message: "No thought found with that ID"})
            }
            res.json(thought);

        } catch (err) {
            console.log(`DELETE REACTION ERROR: ${err}`);
            return res.status(500).json(err);
        }
    }
}