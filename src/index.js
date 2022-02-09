import React from "react";
import ReactDom from "react-dom";
import TextArea from "./textarea/index";

import "./index.less";

function TopicTextarea({ placeholder = "" }) {
  return (
    <div className="topic-textarea-box">
      <TextArea maxLen={1000} />
    </div>
  );
}

ReactDom.render(<TopicTextarea />, document.getElementById("app"));
