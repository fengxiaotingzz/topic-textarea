import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

export default function TopicList({
  width = 0,
  height = 0,
  topicListData = [],
  setShowTopic,
  onClickTopicItem = () => {},
  lineHeight = 0,
  renderTopicItem,
  srcollOptons = {},
}) {
  return (
    <div
      style={{ left: width, top: height + lineHeight }}
      className="topic-list"
    >
      <InfiniteScroll {...srcollOptons}>
        {topicListData?.map((val, i) => {
          return (
            <div
              className="topic-item"
              onClick={() => {
                onClickTopicItem(val);
                setShowTopic(false);
              }}
              key={i}
            >
              {renderTopicItem
                ? renderTopicItem({ value: val, index: i })
                : `#${val}`}
            </div>
          );
        })}
      </InfiniteScroll>
    </div>
  );
}
