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
      <span id="outputContent"></span><span id="outputNewLine"><br /></span>
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

    /**
     * @private
     * @name TextIo#outputNewLine
     * @type {jQuery}
     */
    this.outputNewLine = $(this.outputDiv).find("#outputNewLine");

    /**
     * @name TextIo#outputScroll
     * @type {jQuery}
     */
    this.outputScroll = $(this.outputDiv).find(".inner");

    /**
     * @name TextIo#outputContent
     * @type {jQuery}
     */
    this.outputContent = $(this.outputDiv).find("#outputContent");
  }

  setInputText(html) {
    this.inputText.html(html);

    this.outputContent.append(`<br />&raquo;&nbsp;${html}`);
    this.outputNewLine.show();
    this.outputScroll.scrollTop(function() { return this.scrollHeight; });
  }

  /**
   * html will be automatically appended with a <br />
   *
   * @param {String} html
   */
  addOutputLine(html) {
    this.inputText.html("");
    this.outputNewLine.hide();
    this.outputContent.append(`<br />${html}`);
    this.outputScroll.scrollTop(function() { return this.scrollHeight; });
  }
}

export default injector.annotateConstructor(TextIo, injector.SINGLETON_SCOPE | injector.EAGER_FLAG);
