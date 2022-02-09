import React from "react";
import ReactDom from "react-dom";
import TextArea from "./textarea/index";

import "./index.less";

function TopicTextarea({ placeholder = "" }) {
  return (
    <div className="topic-textarea-box">
      <TextArea
        maxLen={1000}
        // onInputTopic={(e) => console.log(e)}
        topicList={["11", "22"]}
        // onClickTopicItem={(e) => console.log(e)}
        onChange={(e) => console.log(e)}
      />
    </div>
  );
}

ReactDom.render(<TopicTextarea />, document.getElementById("app"));
