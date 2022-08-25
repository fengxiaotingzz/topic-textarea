import React from 'react';
import ReactDom from 'react-dom';
import { Textarea } from '../src/index';

import './index.less';

function TopicTextarea({ placeholder = '' }) {
  return (
    <div className="topic-textarea-box">
      <Textarea
        maxLen={1000}
        onInputTopic={(e) => console.log(11, e)}
        topicList={['11', '22']}
        onClickTopicItem={(e) => console.log(222, e)}
        renderTopicItem={({ value, index }) => <div>xxxx{value}</div>}
      />
    </div>
  );
}

ReactDom.render(<TopicTextarea />, document.getElementById('app'));
