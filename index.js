const inquirer = require("inquirer");
const fs = require("fs");

inquirer
  .prompt([
    {
      message: "Enter project title:",
      name: "title",
      type: "input",
    },
  ])
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  })
  .then(function (userAnswers) {
    console.log(userAnswers);
  });
