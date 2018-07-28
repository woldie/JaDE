import $ from "jquery";

import { injector } from "jsuice";

class TextIo {
  constructor() {
    this.ioContainerDiv = $("<div class='ioContainer'></div>");

    /**
     * @name TextIo#outputDiv
     * @type {jQuery}
     */
    this.outputDiv = $(`<div class='outputBox'><div class='inner'>
      Output goes here<br />... and here.
    </div></div>`);

    /**
     * @name TextIo#inputDiv
     * @type {jQuery}
     */
    this.inputDiv = $(`<div class='inputBox'><div class='inner'>
      &raquo;&nbsp;<span id='inputText'></span><span class='blinking-cursor'>|</span>
    </div></div>`);

    $(document.body).append(this.ioContainerDiv);
    $(this.ioContainerDiv).append(this.outputDiv);
    $(this.ioContainerDiv).append(this.inputDiv);

    /**
     * @name TextIo#inputText
     * @type {jQuery}
     */
    this.inputText = $(this.inputDiv).find("#inputText");
  }

  setInputText(html) {
    this.inputText.html(html);
  }
}

export default injector.annotateConstructor(TextIo, injector.SINGLETON_SCOPE | injector.EAGER_FLAG);
