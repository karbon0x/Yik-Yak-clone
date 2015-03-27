
Tasks = new Mongo.Collection("tasks");


if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.body.helpers({
      tasks: function () {
       return Tasks.find({},{sort:{createdAt:-1}});
   }
  });

  Template.body.events({

      "submit .new-task": function(event){
          var text = event.target.text.value;
          var count = 0;
      Meteor.call("addTask", text,count);

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
      }
  });

  Template.task.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.task.events({
    'click .positive': function () {
      // increment the counter when button is clicked
      //Tasks.update(this._id, {$set: {count: this.count+1}});
      Meteor.call("positive", this._id, this.count);
  },
    'click .negative': function () {
      // increment the counter when button is clicked
     // Tasks.update(this._id, {$set: {count: this.count-1}});
     Meteor.call("negative", this._id,this.count);
  },
  "click .toggle-checked": function () {
   // Set the checked property to the opposite of its current value
   Tasks.update(this._id, {$set: {checked: ! this.checked}});
 },
 "click .delete": function () {
     Meteor.call("deleteTask", this._id);
 }
});
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addTask: function (text,count) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
        text:text,
        createdAt : new Date(),
        count:count,
        owner: Meteor.userId(),           // _id of logged in user
        username: Meteor.user().username
    });
  },
  positive: function (taskId,count) {
    // increment the counter when button is clicked
    Tasks.update(taskId, {$set: {count: count+1}});
},
 negative: function (taskId,count) {
    // increment the counter when button is clicked
    Tasks.update(taskId, {$set: {count: count-1}});
},
  deleteTask: function (taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
  }
});





if (Meteor.isServer) {
  Meteor.startup(function () {

    // code to run on server at startup
  });
}
