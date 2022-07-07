import React from 'react';

import './index.less';

export default function TopicList({
  width = 0,
  height = 0,
  topicListData = [],
  setShowTopic,
  onClickTopicItem = () => {},
  lineHeight = 15,
  renderTopicItem,
}) {
  return (
    <div
      style={{ left: width, top: height + lineHeight }}
      className="topic-list"
    >
      {topicListData?.map((val, i) => {
        return (
          <div
            className="topic-item"
            onClick={() => {
              onClickTopicItem(val);
              setShowTopic(false);
            }}
          >
            {renderTopicItem
              ? renderTopicItem({ value: val, index: i })
              : `#${val}`}
          </div>
        );
      })}
    </div>
  );
}
