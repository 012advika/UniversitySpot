
import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */  
export const addRemoveFriend = async (req, res) => {   //adding or removing a friend
  try {
    const { id, friendId } = req.params;// grabbing the id from the string sent from frontend
    const user = await User.findById(id);  //grabbing the current user
    const friend = await User.findById(friendId); //grabbing the friend

    if (user.friends.includes(friendId)) {
  /*removing friend from user's friend list*/    user.friends = user.friends.filter((id) => id !== friendId); //filter function will create a new array containing friend's id not equal to the given friend's id
    /*removing user from the friend's friend list*/  friend.friends = friend.friends.filter((id) => id !== id);
    } else {   // if that friend is not included in the user's friend list, add that friend
      user.friends.push(friendId);  //adding friend using friend's id to the user's freind list
      friend.friends.push(id);  //adding user to the friend's friend list.
    }
    await user.save();  //saving in the database
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(    //formatting and sending to the frontend
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
