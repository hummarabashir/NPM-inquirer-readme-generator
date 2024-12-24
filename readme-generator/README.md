# README-Generator

This command-line application dynamically generates a README.md from a user's input using the [Inquirer package](https://www.npmjs.com/package/inquirer). Upon running the app, the user will be prompted for the following information: Project title, description, license, badge color, installation and usage instructions, guidance on contributing and running tests, GitHub username and email address.

The application will then take this information and create a quality, professional READ_ME.md file.

## Table of Contents

- [Installation](#Installation)
- [Running the Application](#Running%20the%20Application)
- [Tests](#Tests)
- [Contact](#Contact)

---

## Installation

To install necessary dependencies, run the following command:

```
npm i
```

npm install --save inquirer
npm install --save inquirer@^8.0.0

---

## Running the Application

- After the installation, run the following command:

```
node index.js
```

- Provide information for the ReadMe file as prompted.

- Note that when prompted with the question `"What command line should be run to install dependencies?"`, the default will be `npm i` if no other input is provided.

- After all prompts are answered, if the application ran successfully, the terminal will show the message `"Success! File was written to READ_ME.md"` and a new README2.md will have been generated.

- If for any reason the application did not run successfully, an error will be displayed on the terminal.

---

## Tests

To run a test of the application without having to go through the prompts each time, open up the <i>test folder</i> within command line and run the following command:

```
node test.js
```

A new Read_me.md file should be generated within the <i>test folder</i>.

---

