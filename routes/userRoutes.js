const express = require("express");
const router = require("express").Router();
const user = require("../models/userModels");
const validate = require("../validation/validate");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(404).send({ message: "please fill the required fields" });
  }
  try {
    let ifExitingUser = await user.findOne({ email });
    if (ifExitingUser) {
      return res.status(400).send({ message: "user exists please login" });
    }
    const hashpassword = await argon2.hash(password);
    let newUser = await user.create({
      name,
      email,
      password: hashpassword,
    });
    let token = jwt.sign({ _id: newUser._id }, "123", { expiresIn: "1hr" });
    return res.status(200).send({ message: "user created", token });
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "internal server error" });
  }
});

router.get("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).send({ message: "please fill all the details" });
  }
  try {
    let findUser = await user.findOne({ email });
    if (!findUser) {
      return res.status(404).send({ message: "no user found please signup" });
    }
    verifyPassword = await argon2.verify(findUser.password, password);
    if (verifyPassword) {
      let token = jwt.sign({ _id: findUser._id }, "123", { expiresIn: "1hr" });
      return res.status(200).send({
        message: "user login sucessfully",
        data: findUser.email,
        token: token,
      });
    } else {
      return res.status(404).send({ message: "password verification failed" });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).send({ message: "internal server error" });
  }
});

router.get("/getAllStudents", validate, async (req, res) => {
  try {
    allUsers = await user.find().select("-password");
    if (!allUsers) {
      res.status(404).send({ message: "no user to display" });
    }
    return res.status(200).send({ message: "list of user ", data: allUsers });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

router.get("/getSingleUser/:_id", validate, async (req, res) => {
  try {
    const userToGet = await user.findById(req.params._id).select("-password");
    if (!userToGet) {
      res.status(404).send({ message: "no user with the mentioned id" });
    }
    res.status(200).send({ message: "user found", data: userToGet });
  } catch (error) {
    console.log(error);

    res.status(500).send({ message: "server error" });
  }
});

router.put("/updateSingleStudent/:id", async (req, res) => {
  try {
    console.log(req.body,"88888888888888");
    
    const { email } = req.body;
    if (!email) {
     return res.status(400).send({ message: "email is required" });
    }
    const findUser = await user.findById(req.params.id);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

 findUser.email = req.body.email;
    await findUser.save();

    res.json({ message: "Email updated successfully", findUser });


  } catch (error) {
    console.log(error);
    
    res.status(500).send({ message: "internal server error" });
  }
});

router.delete("/delete/:id",validate, async (req, res) => {
  try {
    toDelete = await user.findByIdAndDelete(req.params.id);
    if (!toDelete) {
      return res.status(404).send({ message: "no user found" });
    }
    return res
      .status(200)
      .send({ message: "user deleted", data: toDelete.email });
  } catch (error) {
    console.log(error);

    res.status(500).send({ messsage: "internal server error" });
  }
});

module.exports = router;
