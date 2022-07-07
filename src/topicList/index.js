import React from 'react';

import './index.less';

export default function TopicList({
  width = 0,
  height = 0,
  topicListData = [],
  setShowTopic,
  onClickTopicItem = () => {},
  lineHeight = 15,
}) {
  return (
    <div
      style={{ left: width, top: height + lineHeight }}
      className="topic-list"
    >
      {topicListData?.map((val) => {
        return (
          <div
            className="topic-item"
            onClick={() => {
              onClickTopicItem(val);
              setShowTopic(false);
            }}
          >
            #{val}
          </div>
        );
      })}
    </div>
  );
}
