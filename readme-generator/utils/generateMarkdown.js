// function to generate markdown for README
function generateMarkdown(userAnswers) {

  const noSpace = userAnswers.licenses.replace(" ", "%20")

  return `
  # ${userAnswers.title}
  ![](https://img.shields.io/badge/license-${noSpace}-${userAnswers.badgecolor})

  ## Description
  ${userAnswers.description}

  ## Table of Contents
  * [Installation](#Installation)
  * [Usage](#Usage)
  * [License](#License)
  * [Contributing](#Contributing)
  * [Tests](#Tests)
  * [Questions](#Questions)

  ***
  ## Installation
  To install necessary dependencies, run the following command:
  ${"```"} 
  ${userAnswers.dependencies} 
  ${"```"} 

  ***
  ## Usage
  ${userAnswers.usage}

  ***
  ## License
  This code is under ${userAnswers.licenses} license.

  ***
  ## Contributing
  ${userAnswers.contributing}

  ***
  ## Tests
  ${userAnswers.test}

  ***
  ## Questions
  If you have any questions about the repo, please open an issue or contact me at the following:
  - GitHub: https://github.com/${userAnswers.username}
  - Email:  ${userAnswers.email}
`;
}

module.exports = generateMarkdown;
