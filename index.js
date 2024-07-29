const inquirer = require("inquirer");
const fs = require("fs");

// inquirer.prompt([
//   {
//       type: 'input',
//       name: 'sections',
//       message: 'Enter the sections for the Table of Contents (comma-separated):'
//   },
//   // Add more questions for content generation
// ]).then((answers) => {
//   // Generate Table of Contents based on user input
//   const sections = answers.sections.split(',');
//   let tocContent = '## Table of Contents\n\n';
//   sections.forEach((section, index) => {
//       tocContent += `${index + 1}. [${section}](#${section.toLowerCase().replace(/\s/g, '-')})\n`;
//   });

//   // Combine Table of Contents with user content
//   const readmeContent = `${tocContent}\n<!-- Add user content here -->`;

//   fs.writeFileSync('README.md', readmeContent);
//   console.log('README with Table of Contents generated successfully!');
// });





let trueFalseQuestions = [];


const trueFalsePrompt = [
    {
        type: 'input',
        name: 'question',
        message: 'Enter the True/False question:'
    },
    {
        type: 'list',
        name: 'answer',
        message: 'Select the correct answer:',
        choices: ['True', 'False']
    }
];

function generateTrueFalseQuiz() {
  let quizType = 'trueFalse';
    inquirer.prompt(trueFalsePrompt)
        .then((answers) => {
            trueFalseQuestions.push(answers);
            inquirer.prompt({
                type: 'confirm',
                name: 'addMore',
                message: 'Add another True/False question?',
                default: true
            }).then((response) => {
                if (response.addMore) {
                    generateTrueFalseQuiz();
                } else {
                  chooseQuizEndType();
                    saveQuiz('Quiz.html', trueFalseQuestions, quizType);
                    while (trueFalseQuestions.length) {
                      trueFalseQuestions.pop();
                  }
    // const commaSeparatedAnswers = trueFalseQuestions.map(q => q.answer === 'True' ? 0 : 1).join(',');
    // console.log(commaSeparatedAnswers);               
                }
            });
        });
}

const writeInQuestions = [];

const writeInPrompt = [
    {
        type: 'input',
        name: 'question',
        message: 'Enter the Write-In question:'
    },
    {
        type: 'input',
        name: 'answer',
        message: 'Enter the suggested answer:'
    }
];

function generateWriteInQuiz() {
  let quizType = 'writein';
    inquirer.prompt(writeInPrompt)
        .then((answers) => {
            writeInQuestions.push(answers);
            inquirer.prompt({
                type: 'confirm',
                name: 'addMore',
                message: 'Add another Write-In question?',
                default: true
            }).then((response) => {
                if (response.addMore) {
                    generateWriteInQuiz();
                } else {
                  chooseQuizEndType();
                    saveQuiz('Quiz.html', writeInQuestions, quizType);
                    while (writeInQuestions.length) {
                      writeInQuestions.pop();
                  }
                }
            });
        });
}


const multipleChoiceQuestions = [];

const multipleChoicePrompt = [
  {
      type: 'input',
      name: 'question',
      message: 'Enter the Multiple Choice question:'
  }
];

function addChoice(choices) {
  return {
      type: 'input',
      name: choices,
      message: `Enter the ${choices}:`
  };
}

for (let i = 1; i <= 4; i++) {
  multipleChoicePrompt.push(addChoice(`choice${i}`));
}

multipleChoicePrompt.push({
  type: 'checkbox',
  name: 'multipleAnswers',
  message: 'Select multiple correct answers:',
  choices: function (answers) {
      const choices = [];
      let index = 1;
      for (let i = 1; i <= 4; i++) {
          if (answers[`choice${i}`]) {
              // choices.push(answers[`choice${i}`]);
              choices.push({ name: answers[`choice${i}`], value: index - 1 });
                index++;
          }
      }
      return choices;
  }
});

function generateMultipleChoiceQuiz() {
  let quizType = 'multiplechoice';
    inquirer.prompt(multipleChoicePrompt)
        .then((answers) => {
          // console.log('Selected Answers:', answers.multipleAnswers);
          multipleChoiceQuestions.push(answers);
            inquirer.prompt({
                type: 'confirm',
                name: 'addMore',
                message: 'Add another Multiple Choice question?',
                default: true
            }).then((response) => {
                if (response.addMore) {
                  generateMultipleChoiceQuiz();
                } else {
                  chooseQuizEndType();
                    saveQuiz('Quiz.html', multipleChoiceQuestions, quizType);
                    while (multipleChoiceQuestions.length) {
                      multipleChoiceQuestions.pop();
                  }
                }
            });
        });
}


const matchingPairQuestions = [];


const matchingPairPrompt = [
  {
    type: 'input',
    name: 'word',
    message: 'Enter a word:'
},
{
    type: 'input',
    name: 'pair',
    message: 'Enter its matching pair:'
}
];


const words = [];

const generateMatchingPairQuiz = () => {
  let quizType = 'matchingpair';
  inquirer.prompt([
      {
          type: 'input',
          name: 'word',
          message: 'Enter a word:'
      },
      {
          type: 'input',
          name: 'pair',
          message: 'Enter its pair:'
      },
      {
          type: 'confirm',
          name: 'addMore',
          message: 'Do you want to add more words and pairs?',
          default: true
      }
  ]).then(answers => {
      words.push({ word: answers.word, pair: answers.pair });
      if (answers.addMore) {
        generateMatchingPairQuiz();
      } else {
        const shuffledPairs = words.map((item, index) => ({ word: item.word, index, pair: item.pair }))
        .sort(() => Math.random() - 0.5);
        console.log(shuffledPairs);
        chooseQuizEndType();
        saveQuiz('Quiz.html', words, quizType, shuffledPairs);
        while (words.length) {
          words.pop();
      }
      }
  });
};


let htmlContent = [];
htmlContent += `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <!DOCTYPE xhtml>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en-US" lang="en-US">
  
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Exercise</title>
    <link type="text/css" href="styles.css" rel="stylesheet" />
  </head>
  
  <body class="px-2 py-4 text-base text-gray-900">
    <div data-quiz="Chapter-01-quiz-01">
      <header>
        <h1 class="text-white font-semibold text-base text-center mb-16 py-4 bg-gray-700 uppercase">Interactive Exercises
        </h1>
      </header>`;

function saveQuiz(fileName, questions, type, pairs) {
  const commaSeparatedAnswers = questions.map(q => q.answer === 'True' ? 0 : 1).join(',');
  switch (type) {
    case 'trueFalse':
  
  if(type == 'trueFalse'){
  questions.forEach((q, index) => {
    let ans = (q.answer  === 'True' ? 0 : 1)
    htmlContent += `<h2 class="text-gray-900 py-1 text-xs font-bold border-b-4 border-gray-200 uppercase">True or False</h2>
    <p class="text-2xl mt-2">Choose answer</p>
    <section class="my-4" data-type="true-or-false" data-answer="${ans}" data-key="questionTF-${index + 1}">`
    htmlContent += `<p class="pt-8">${q.question}</p>

  <div class="my-3">
    <button
      class="flex items-center justify-between px-2 py-3 w-full border rounded-sm border-gray-300 text-left my-2"
      data-input="true">Yes</button>
    <button
      class="flex items-center justify-between px-2 py-3 w-full border rounded-sm border-gray-300 text-left my-2"
      data-input="true">No</button>
  </div>`
  htmlContent += '<div class="mt-8 mb-16"><button class="check-button rounded-md bg-gray-700 py-2.5 px-6 text-white text-sm w-24" data-validate="false">Check</button></div></section>'
});
  }
  break;
  case 'writein':
    questions.forEach((q, index) => {
     htmlContent += `<div class="my-4" data-type="write-in" data-answer="${q.answer}" data-key="questionWI-${index + 1}">

      <h2 class="text-gray-900 py-1 text-xs font-bold border-b-4 border-gray-200 uppercase">Write In</h2>

      <p class="text-2xl mt-2">Translate the sentence</p>

      <div class="flex flex-row items-center mt-8">
        <p>${q.question}</p>
      </div>

      <div class="my-2">
        <div class="h-24 w-full bg-gray-200 p-2" contenteditable="true" data-input="true">
        </div>
      </div>

      <div class="h-8" data-message="true"></div>

      <div class="mt-4 mb-12">
        <button class="check-button rounded-md bg-gray-700 py-2.5 px-6 text-white text-sm w-24"
          data-validate="false">Check</button>
      </div>
    </div>`
    });
  break;
  case 'multiplechoice':
    questions.forEach((q, index) => {
      htmlContent += `
      <section class="my-4" data-type="select-many" data-answer="${q.multipleAnswers}" data-key="questionMC-${index + 1}">
  
        <h2 class="text-gray-900 py-1 text-xs font-bold border-b-4 border-gray-200 uppercase">Multiple Choice</h2>
  
        <p class="text-2xl mt-2">Select one or more</p>
  
        <p class="pt-8">${q.question}</p>
  
        <div class="my-3">
          <button
            class="flex items-center justify-between px-2 py-3 w-full border rounded-sm border-gray-300 text-left my-2"
            data-input="true">${q.choice1}</button>
          <button
            class="flex items-center justify-between px-2 py-3 w-full border rounded-sm border-gray-300 text-left my-2"
            data-input="true">${q.choice2}</button>
          <button
            class="flex items-center justify-between px-2 py-3 w-full border rounded-sm border-gray-300 text-left my-2"
            data-input="true">${q.choice3}</button>
          <button
            class="flex items-center justify-between px-2 py-3 w-full border rounded-sm border-gray-300 text-left my-2"
            data-input="true">${q.choice4}</button>
        </div>
  
        <div class="mt-8 mb-16">
          <button class="check-button rounded-md bg-gray-700 py-2.5 px-6 text-white text-sm w-24"
            data-validate="false">Check</button>
        </div>
      </section>`
    });
  break;
  case 'matchingpair':
    let indices = pairs.map((q) => q.index).join(',');

    console.log(indices);
      htmlContent += `<section class="my-4" data-type="fill-in-the-blanks" data-answer="${indices}" data-key="questionMP-">
      <h2 class="text-gray-900 py-1 text-xs font-bold border-b-4 border-gray-200 uppercase">Matching</h2>
      <p class="text-2xl mt-3 mb-8">Select the matching pair</p>
      <p></p>
      <div class="py-2">`
      pairs.forEach((q, index) => {
      
       htmlContent += `<div class="flex flex-row items-center flex-wrap my-4">
          <div class="mr-2">${q.word}</div>
          <button class="flex-1 h-11 border border-dashed rounded-sm border-gray-400 px-2" data-slot="true"></button>
        </div>`
      })
      htmlContent += `</div>
      <div class="mt-8">`
      questions.forEach((q, index) => {
       htmlContent += `<button class="my-2 mx-1 rounded-sm bg-gray-200 py-2 px-4 h-11" data-input="true">${q.pair}</button>`
      });
      htmlContent += `</div>
      <div class="mt-8 mb-16">
        <button class="check-button rounded-md bg-gray-700 py-2.5 px-6 text-white text-sm w-24"
          data-validate="false">Check</button>
      </div>
    </section>`
   break;   
  default:
    console.log('Invalid activity type');
  }
  // fs.writeFileSync(fileName, htmlContent);
  //   console.log('Quiz saved successfully!');
    // chooseQuizEndType();
}


function chooseQuizType() {
  inquirer.prompt({
      type: 'list',
      name: 'quizType',
      message: 'Select the quiz type:',
      choices: ['True/False', 'Write-In', 'Multiple-Choice', 'Matching-Pair']
  }).then((response) => {
      if (response.quizType === 'True/False') {
        generateTrueFalseQuiz();
      } else if(response.quizType === 'Write-In') {
        generateWriteInQuiz();
      }
      else if(response.quizType === 'Multiple-Choice') {
        generateMultipleChoiceQuiz();
      }
      else if(response.quizType === 'Matching-Pair') {
        generateMatchingPairQuiz();
      }
  });
}

function chooseQuizFileName() {
  inquirer.prompt({
    type: 'input',
    name: 'fileName',
    message: 'Enter the file name to save the quiz(without file extension):'
  }).then((answer) => {
    const fileName = (answer.fileName.trim() || 'Quiz') + '.html'; // Default to 'Quiz.html' if no input
    saveQuizContent(fileName);
  });
}

function saveQuizContent(fileName) {
  htmlContent += '</div> <script src="interactive-exercises.js"></script></body></html>'
  fs.writeFile(fileName, htmlContent, (err) => {
    if (err) {
      console.error('Error saving quiz:', err);
    } else {
      console.log('Quiz saved successfully as ' + fileName);
    }
  });
}

function chooseQuizEndType() {
  inquirer.prompt({
      type: 'list',
      name: 'quizType',
      message: 'Select the quiz type:',
      choices: ['True/False', 'Write-In', 'Multiple-Choice', 'Matching-Pair', 'End Quiz']
  }).then((response) => {
      if (response.quizType === 'True/False') {
        generateTrueFalseQuiz();
      } else if(response.quizType === 'Write-In') {
        generateWriteInQuiz();
      } else if(response.quizType === 'Multiple-Choice') {
        generateMultipleChoiceQuiz();
      } else if(response.quizType === 'Matching-Pair') {
        generateMatchingPairQuiz();
      } else {
        console.log("Quiz Ended!!");

      //   fs.writeFileSync('Quiz.html', htmlContent, (err) => {
      //     if (err) throw err;
      //   console.log('Quiz saved successfully!');
      // });
      chooseQuizFileName();
    }
  });
}

chooseQuizType();
