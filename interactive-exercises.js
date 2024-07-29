QuizUI = (function () {
  function Exercise(node, context) {
    this.node = node;
    this.context = context;
    this.answerKey = this.node.dataset.answer;
    this.state = {
      responses: [],
      slotTexts: [],
      validated: false,
      activeSlotIndex: 0,
    };
    this.init();
  }

  Exercise.prototype.init = function () {
    this.initCheckButton();
    this.initCheckBtn();
    this.initInputs();
    this.initSlots();
    // render for the first time
    this.render();
  };

  Exercise.prototype.initCheckButton = function () {
    this.checkButton = this.node.querySelector("[data-validate]");
    if (this.checkButton) {
      this.checkButton.addEventListener(
        "click",
        function () {
          if (this.state.validated) {
            this.reset();
          } else {
            this.validate();
          }
        }.bind(this)
      );
    }
  };

  Exercise.prototype.initCheckBtn = function () {
    this.checkBtn = this.node.querySelector("[data-vali]");
    if (this.checkBtn) {
      this.checkBtn.addEventListener(
        "click",
        function () {
          if (this.state.validated) {
            this.reset();
          } else {
            this.reset();
          }
        }.bind(this)
      );
    }
  };

  Exercise.prototype.initInputs = function () {
    this.inputs = this.node.querySelectorAll("[data-input]");

    this.inputs.forEach(function (input, i) {
      this.addListener(input, i);
    }, this);
  };

  Exercise.prototype.initSlots = function () {
    this.slots = this.node.querySelectorAll("[data-slot]");
    var originalSlotText = [];
    if (this.slots) {
      this.slots.forEach(function (slot, i) {
        originalSlotText.push(slot.textContent);
        // click to move the active slot
        slot.addEventListener(
          "click",
          function () {
            this.slots[this.state.activeSlotIndex].removeAttribute(
              "data-slot-active",
              true
            );
            this.setState({ activeSlotIndex: i });
            this.slots[this.state.activeSlotIndex].setAttribute(
              "data-slot-active",
              true
            );
          }.bind(this)
        );
      }, this);
      this.originalSlotText = originalSlotText;
    }
  };

  Exercise.prototype.addListener = function (el, i) {
    el.addEventListener(
      "click",
      function () {
        if (el.dataset.touched) {
          this.removeResponse(i);
        } else {
          this.addResponse(i);
        }
      }.bind(this)
    );
  };

  Exercise.prototype.removeResponse = function (el) {
    var responses = this.state.responses.slice(0);
    responses.splice(this.state.responses.indexOf(el), 1);
    this.setState({ responses: responses });
  };

  Exercise.prototype.addResponse = function (el) {
    var responses = this.state.responses.slice(0);
    responses.push(el);
    this.setState({ responses: responses });
  };

  Exercise.prototype.setState = function (update) {
    var prevState = Object.assign({}, this.state);
    var newState = Object.assign(prevState, update);
    this.state = newState;
    this.render();
  };

  Exercise.prototype.reset = function (el) {
    this.state = {
      responses: [],
      slotTexts: [],
      validated: false,
      activeSlotIndex: 0,
    };
    this.render();
  };

  Exercise.prototype.validate = function () {
    this.setState({ validated: true });
  };

  Exercise.prototype.render = function () {
    // render inputs
    if (this.answerKey) {
      var answerKey = this.answerKey.split(",").map(Number);
    }
    if (answerKey) {
      this.renderInputs(answerKey);
    } else {
      this.renderIn();
    }
    // render checkButton
    if (this.checkButton) {
      this.renderCheckButton();
    }
    if (this.checkBtn) {
      this.renderCheckBtn();
    }
    this.renderActiveSlot();
    // save to storage
    if (this.context.store) {
      this.context.setStorage();
    }
  };

  Exercise.prototype.renderInputs = function (answerKey) {
    this.inputs.forEach(function (input, i) {
      this.state.validated
        ? (input.disabled = "true")
        : input.removeAttribute("disabled");
      // repaint every time
      input.removeAttribute("data-touched", true);
      input.removeAttribute("data-correct", true);
      input.removeAttribute("data-correct", false);
      // initial state
      if (!this.state.validated) {
        if (this.state.responses.indexOf(i) > -1) {
          input.setAttribute("data-touched", true);
        }
      }
      // validated state
      if (this.state.validated) {
        // validate user's response
        if (this.state.responses.indexOf(i) > -1) {
          // if a response is correct and not
          if (answerKey.indexOf(i) > -1) {
            this.inputs[i].setAttribute("data-correct", true);
          } else {
            this.inputs[i].setAttribute("data-correct", false);
          }
        }
        // display correct answers even if there's no reponse
        else if (answerKey.indexOf(i) > -1) {
          this.inputs[i].setAttribute("data-correct", true);
        }
      }
    }, this);
  };

  Exercise.prototype.renderCheckButton = function () {
    if (this.state.responses.length > 0) {
      this.checkButton.removeAttribute("disabled");
    } else {
      this.checkButton.disabled = true;
    }
    if (this.state.validated) {
      this.checkButton.setAttribute("data-validated", true);
      this.checkButton.textContent = "Reset All";
    } else {
      this.checkButton.setAttribute("data-validated", false);
      this.checkButton.textContent = "Check Answers";
    }
  };

  Exercise.prototype.renderActiveSlot = function () {
    if (this.slots.length > 0) {
      this.slots.forEach(function (slot, i) {
        slot.removeAttribute("data-slot-active", true);
        if (this.state.validated) {
          this.slots[this.state.activeSlotIndex].removeAttribute(
            "data-slot-active",
            true
          );
        } else {
          this.slots[this.state.activeSlotIndex].setAttribute(
            "data-slot-active",
            true
          );
        }
      }, this);
    }
  };

  /**
   *
   * SelectMany subclass
   *
   */

  function SelectMany(node, context) {
    Exercise.call(this, node, context);
  }

  SelectMany.prototype = Object.create(Exercise.prototype);
  SelectMany.prototype.constructor = SelectOne;

  /**
   *
   * SelectOne subclass
   *
   */

  function SelectOne(node, context) {
    Exercise.call(this, node, context);
  }

  SelectOne.prototype = Object.create(Exercise.prototype);
  SelectOne.prototype.constructor = SelectOne;

  SelectOne.prototype.addResponse = function (el) {
    var responses = this.state.responses.slice(0, 0);
    responses.push(el);
    this.setState({ responses: responses });
  };

  /**
   *
   * FillInTheBlanks subclass
   *
   */

  function FillInTheBlanks(node, context) {
    Exercise.call(this, node, context);
  }

  FillInTheBlanks.prototype = Object.create(Exercise.prototype);
  FillInTheBlanks.prototype.constructor = FillInTheBlanks;

  FillInTheBlanks.prototype.removeResponse = function (el) {
    if (this.state.slotTexts.length > 0) {
      var slotTexts = this.state.slotTexts.slice(0);
      var responses = this.state.responses.slice(0);
      slotTexts.splice(
        this.state.slotTexts.indexOf(el),
        1,
        this.originalSlotText[i]
      );
      responses.splice(this.state.responses.indexOf(el), 1);
      this.setState({ slotTexts: slotTexts, responses: responses });
    }
    this.incrementActiveSlot();
  };

  FillInTheBlanks.prototype.addResponse = function (newResponse) {
    // setup slotTexts here
    var slotTexts = this.state.slotTexts.slice(0);
    this.slots.forEach(function (slot) {
      if (slotTexts.length < this.slots.length) {
        slotTexts.push(slot.textContent);
      }
    }, this);
    // responses go to active slot
    var responses = this.state.responses.slice(0);
    slotTexts.splice(this.state.activeSlotIndex, 1, newResponse);
    // if active slot is already taken, replace it with the new response
    if (
      this.slots[this.state.activeSlotIndex].textContent !==
      this.originalSlotText[0]
    ) {
      responses.push(newResponse);
      responses.forEach(function (response, i) {
        if (slotTexts.indexOf(response) === -1) {
          responses.splice(responses.indexOf(response), 1);
        }
      }, this);
    } else {
      responses.push(newResponse);
    }
    this.setState({ slotTexts: slotTexts, responses: responses });
    this.incrementActiveSlot();
  };

  FillInTheBlanks.prototype.incrementActiveSlot = function () {
    this.slots[this.state.activeSlotIndex].removeAttribute(
      "data-slot-active",
      true
    );
    var activeSlotIndex = this.state.activeSlotIndex;
    // use for loop to use the break
    for (let i = 0; i < this.slots.length; i++) {
      if (activeSlotIndex <= i) {
        if (this.slots[i].textContent === this.originalSlotText[i]) {
          activeSlotIndex = i;
          this.setState({ activeSlotIndex: activeSlotIndex });
          break;
        }
      }
      // if the active slot is on the last slot
      if (activeSlotIndex === this.slots.length - 1) {
        if (this.slots[i].textContent === this.originalSlotText[i]) {
          activeSlotIndex = i;
          this.setState({ activeSlotIndex: activeSlotIndex });
          break;
        }
      }
    }
    this.slots[this.state.activeSlotIndex].setAttribute(
      "data-slot-active",
      true
    );
  };

  FillInTheBlanks.prototype.renderInputs = function (answerKey) {
    this.inputs.forEach(function (input, i) {
      this.state.validated
        ? (input.disabled = "true")
        : input.removeAttribute("disabled");
      input.removeAttribute("data-touched", true);
      if (this.state.responses.indexOf(i) > -1) {
        input.setAttribute("data-touched", true);
      }
    }, this);
    this.renderSlots(answerKey);
  };

  FillInTheBlanks.prototype.renderSlots = function (answerKey) {
    if (!this.state.validated) {
      this.slots.forEach(function (slot, i) {
        slot.removeAttribute("data-slot-correct", true);
        slot.removeAttribute("data-slot-correct", false);
        if (this.state.slotTexts.length > 0) {
          if (this.state.slotTexts[i] !== this.originalSlotText[i]) {
            slot.textContent = this.inputs[this.state.slotTexts[i]].textContent;
          } else {
            slot.textContent = this.state.slotTexts[i];
          }
        } else {
          slot.textContent = this.originalSlotText[i];
        }
      }, this);
    }
    if (this.state.validated) {
      // find duplicates in the input texts
      const inputTexts = [];
      this.inputs.forEach(function (input, i) {
        inputTexts.push(input.textContent);
      }, this);
      const tofindDuplicates = (inputTexts) =>
        inputTexts.filter((item, index) => inputTexts.indexOf(item) !== index);
      const duplicateText = tofindDuplicates(inputTexts);
      // get indices of the same texts
      var duplicateTextIndices = [];
      if (duplicateText) {
        this.inputs.forEach(function (input, i) {
          if (input.textContent === duplicateText[0]) {
            duplicateTextIndices.push(i);
          }
        }, this);
      }
      var firstVal = duplicateTextIndices[0];
      var secondVal = duplicateTextIndices[1];
      // render slots
      this.slots.forEach(function (slot, i) {
        if (this.state.slotTexts.length > 0) {
          if (this.state.slotTexts[i] === answerKey[i]) {
            slot.textContent = this.inputs[answerKey[i]].textContent;
            slot.setAttribute("data-slot-correct", true);
          } else {
            slot.textContent = this.inputs[answerKey[i]].textContent;
            slot.setAttribute("data-slot-correct", false);
          }
          // make the same texts interchangeable
          if (
            this.state.slotTexts[i] === firstVal ||
            this.state.slotTexts[i] === secondVal
          ) {
            if (answerKey[i] === firstVal || answerKey[i] === secondVal) {
              slot.textContent = this.inputs[answerKey[i]].textContent;
              slot.setAttribute("data-slot-correct", true);
            } else {
              slot.textContent = this.inputs[answerKey[i]].textContent;
              slot.setAttribute("data-slot-correct", false);
            }
          }
        }
        // when there's no response
        else {
          slot.textContent = this.inputs[answerKey[i]].textContent;
          slot.setAttribute("data-slot-correct", false);
        }
      }, this);
    }
  };

  /**
   *
   * WriteIn subclass
   *
   */

  function WriteIn(node, context) {
    Exercise.call(this, node, context);
  }

  WriteIn.prototype = Object.create(Exercise.prototype);
  WriteIn.prototype.constructor = WriteIn;

  WriteIn.prototype.addListener = function (el, i) {
    // books disables text inputs so we'll reneable
    function enableTextInput() {
      if (el.disabled) {
        el.removeAttribute("disabled");
      }
    }
    window.requestAnimationFrame(enableTextInput);
    function setCursorPoint() {
      var range = document.createRange();
      var sel = window.getSelection();
      if (el.childNodes.length > 0) {
        for (inc = 0; inc <= el.textContent.length; inc++) {
          range.setStart(el.childNodes[0], inc);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
    el.addEventListener(
      "keyup",
      function (e) {
        this.setState({ responses: e.target.textContent });
        e.preventDefault();
        setCursorPoint();
      }.bind(this)
    );
  };

  WriteIn.prototype.renderInputs = function (answerKey) {
    //
    var validationMessage = this.node.querySelector("[data-message]");
    //
    this.inputs.forEach(function (input, i) {
      if (!this.state.validated) {
        if (this.state.responses.length > 0) {
          input.textContent = this.state.responses;
        } else {
          input.textContent = "";
        }
        //
        if (validationMessage) {
          validationMessage.textContent = "";
        }
        //
      }
      //
      if (this.state.validated) {
        if (this.state.responses.length > 0) {
          input.textContent = this.state.responses;
        }
        validationMessage.textContent = `Suggested Answer: ${this.answerKey}`;
      }
      //
    }, this);
  };
  WriteIn.prototype.renderIn = function (answerKey) {
    //
    // var validationMessage = this.node.querySelector("[data-message]");
    //
    this.inputs.forEach(function (input, i) {
      if (!this.state.validated) {
        if (this.state.responses.length > 0) {
          input.textContent = this.state.responses;
        } else {
          input.textContent = "";
        }
        //
        // if (validationMessage) {
        //   validationMessage.textContent = "";
        // }
        //
      }
      //
      if (this.state.validated) {
        if (this.state.responses.length > 0) {
          input.textContent = this.state.responses;
        }
        // validationMessage.textContent = `Suggested Answer: ${this.answerKey}`;
      }
      //
    }, this);
  };
  WriteIn.prototype.renderCheckButton = function () {
    if (this.state.responses.length > 0) {
      this.checkButton.removeAttribute("disabled");
    } else {
      this.checkButton.disabled = true;
    }
    if (this.state.validated) {
      this.checkButton.setAttribute("data-validated", true);
      this.checkButton.textContent = "Reset Answer";
    } else {
      this.checkButton.setAttribute("data-validated", false);
      this.checkButton.textContent = "Check Answer";
    }
  };
  WriteIn.prototype.renderCheckBtn = function () {
    if (this.state.responses.length > 0) {
      this.checkBtn.removeAttribute("disabled");
    } else {
      this.checkBtn.disabled = true;
    }
    // if (this.state.validated) {
    //   this.checkButton.setAttribute("data-validated", true);
    //   this.checkButton.textContent = "Reset";
    // } else {
    //   this.checkButton.setAttribute("data-validated", false);
    //   this.checkButton.textContent = "Check Answer";
    // }
  };

  /**
   *
   * SelectManyTrueOrFalse subclass
   *
   */

  function SelectManyTrueOrFalse(node, context) {
    Exercise.call(this, node, context);
  }

  SelectManyTrueOrFalse.prototype = Object.create(Exercise.prototype);
  SelectManyTrueOrFalse.prototype.constructor = SelectManyTrueOrFalse;

  SelectManyTrueOrFalse.prototype.addListener = function (el, i) {
    el.addEventListener(
      "click",
      function () {
        if (el.dataset.touched) {
          this.removeResponse(i);
        } else {
          if (i % 2 === 0) {
            var oddIndex = i + 1;
            if (this.state.responses.indexOf(oddIndex) > -1)
              this.removeResponse(oddIndex);
          } else if (i % 2 === 1) {
            var evenIndex = i - 1;
            if (this.state.responses.indexOf(evenIndex) > -1)
              this.removeResponse(evenIndex);
          }
          this.addResponse(i);
        }
      }.bind(this)
    );
  };

  SelectManyTrueOrFalse.prototype.renderInputs = function (answerKey) {
    this.inputs.forEach(function (input, i) {
      this.state.validated
        ? (input.disabled = "true")
        : input.removeAttribute("disabled");
      input.removeAttribute("data-touched", true);
      input.removeAttribute("data-correct", true);
      input.removeAttribute("data-correct", false);
      // initial state
      if (!this.state.validated) {
        if (this.state.responses.indexOf(i) > -1) {
          input.setAttribute("data-touched", true);
        }
      }
      // validated state
      if (this.state.validated) {
        // validate user's reponses
        if (this.state.responses.indexOf(i) > -1) {
          if (answerKey.indexOf(i) > -1) {
            input.setAttribute("data-correct", true);
          } else {
            input.setAttribute("data-correct", false);
          }
        }
        // when showing answer if the true of false set has a response only validate the response for that set
        if (answerKey.indexOf(i) > -1) {
          if (i % 2 === 0) {
            var nextIndex = this.state.responses.indexOf(i + 1);
            if (nextIndex > -1) {
              input.removeAttribute("data-correct", false);
            } else {
              input.setAttribute("data-correct", true);
            }
          } else if (i % 2 === 1) {
            var previousIndex = this.state.responses.indexOf(i - 1);
            if (previousIndex > -1) {
              input.removeAttribute("data-correct", false);
            } else {
              input.setAttribute("data-correct", true);
            }
          }
        }
      }
    }, this);
  };

  /**
   *
   * Quiz base class
   *
   */

  function Quiz(group) {
    this.modules = {};
    this.nodes = group.querySelectorAll("[data-type]");
    this.storageKey = group.dataset.quiz;
    this.validatedAllButtonStorageKey = `${this.storageKey}-storage`;
    this.checkAllButton = group.querySelector("[data-validate-all]");
    this.store = null; // so it doesn't start storage on initial load
    this.validatedAll = false;

    this.nodes.forEach(function (node, i) {
      var key = node.dataset.key;
      var module;
      switch (node.dataset.type) {
        case "select-one":
          module = new SelectOne(node, this);
          this.modules[key] = module;
          break;
        case "select-many":
          module = new SelectMany(node, this);
          this.modules[key] = module;
          break;
        case "fill-in-the-blanks":
          module = new FillInTheBlanks(node, this);
          this.modules[key] = module;
          break;
        case "write-in":
          module = new WriteIn(node, this);
          this.modules[key] = module;
          break;
        case "true-or-false":
          module = new SelectManyTrueOrFalse(node, this);
          this.modules[key] = module;
          break;
        default:
          console.log("no type");
      }
    }, this);
    this.handleCheckAllButton();
  }

  Quiz.prototype.handleCheckAllButton = function () {
    if (this.checkAllButton) {
      this.checkAllButton.disabled = "true";
      this.checkAllButton.addEventListener(
        "click",
        function () {
          if (this.validatedAll) {
            Object.keys(this.modules).forEach(function (key) {
              this.modules[key].reset();
              this.validatedAll = false;
              this.checkAllButton.textContent = "Check Answers";
              this.checkAllButton.disabled = "true";
            }, this);
          } else {
            Object.keys(this.modules).forEach(function (key) {
              this.modules[key].validate();
            }, this);
            this.validatedAll = true;
            this.checkAllButton.removeAttribute("disabled");
            this.checkAllButton.textContent = "Reset All";
          }
          // storage for the validatedAll button
          var validatedAllButton = {};
          var validatedAll = "validatedAll";
          validatedAllButton[validatedAll] = this.validatedAll;
          window.localStorage.setItem(
            this.validatedAllButtonStorageKey,
            JSON.stringify(validatedAllButton)
          );
        }.bind(this)
      );
    }
  };

  Quiz.prototype.setStorage = function () {
    var allStates = {};
    var hasResponse = false;
    Object.keys(this.modules).forEach(function (key) {
      allStates[key] = this.modules[key].state;

      if (this.modules[key].state.responses.length > 0) {
        hasResponse = true;
      }
    }, this);
    window.localStorage.setItem(this.storageKey, JSON.stringify(allStates));
    if (this.checkAllButton) {
      if (hasResponse) {
        this.checkAllButton.removeAttribute("disabled");
      } else {
        this.checkAllButton.disabled = "true";
      }
    }
  };

  Quiz.prototype.loadStorage = function () {
    // read storage and load the states
    var localData = JSON.parse(window.localStorage.getItem(this.storageKey));
    var localButtonData = JSON.parse(
      window.localStorage.getItem(this.validatedAllButtonStorageKey)
    );
    if (
      localData &&
      Object.keys(this.modules).length === Object.keys(localData).length
    ) {
      Object.keys(this.modules).forEach(function (key) {
        var newState = localData[key];
        this.modules[key].setState(newState);
      }, this);
    }
    if (this.checkAllButton) {
      if (localButtonData && localButtonData["validatedAll"]) {
        this.checkAllButton.textContent = "Reset All";
        this.validatedAll = true;
      } else {
        this.checkAllButton.textContent = "Check Answers";
        this.validatedAll = false;
      }
    }
  };

  Quiz.prototype.useStorage = function () {
    this.store = true;
  };

  return { Quiz: Quiz };
})();

/**
 *
 * Usage
 *
 */

var selector = "[data-quiz]";
var groups = document.querySelectorAll(selector);

this.groups.forEach(function (group) {
  var quiz = new QuizUI.Quiz(group);
  var store = quiz.useStorage();
  var storage = quiz.loadStorage();
}, this);
