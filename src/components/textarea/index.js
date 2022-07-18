import React, { useState, useRef, useEffect } from 'react';
import TopicList from '../topicList';

import './index.less';

export default function TopicTextarea({
  placeholder = '',
  maxLen = 100,
  topicList = [],
  renderTopicItem,
  onChange = () => {},
  onInputTopic = () => {},
  onClickTopicItem = () => {},
  ...other
}) {
  const [data, setData] = useState('');
  const [hiddenData, setHiddenData] = useState('');
  const [showTopic, setShowTopic] = useState(false);
  const [topicPos, setTopicPos] = useState({ width: 0, height: 0 });
  const inputRef = useRef();
  const hiddenWidthRef = useRef();
  const hiddenHeightRef = useRef();
  const textWidthRef = useRef(0);
  const isCompositionRef = useRef(false);

  // 判断当前输入中#号的个数
  const getMarkNumber = (value) => value?.match(/#/gi)?.length || 0;

  // 获取光标所在的index
  const getCursorIndex = () => {
    const target = inputRef.current;
    let position = -1;
    // 非IE浏览器
    if (target?.selectionStart > -1) {
      position = target.selectionStart;
    } else {
      // IE
      const range = document?.selection?.createRange();
      range?.moveStart('character', -target.value.length);
      position = range?.text?.length;
    }

    return position;
  };

  // 获取话题显示的位置
  const getTopicListPos = () => {
    const inputWidth = inputRef.current?.offsetWidth;
    let hiddenWrap = hiddenWidthRef.current?.getBoundingClientRect();
    let hiddenWidth = hiddenWrap?.width;
    let lineNumber = parseInt(hiddenWidth / inputWidth) + 1;

    if (Math.floor(hiddenWidth / inputWidth) === 0) {
      textWidthRef.current = parseInt(hiddenWidth / hiddenData?.length);
    }
    hiddenWidth = hiddenWidth + textWidthRef.current * lineNumber;

    const width = hiddenWidth % inputWidth;
    const height = hiddenHeightRef.current?.offsetHeight;

    return {
      width,
      height,
    };
  };

  const onChangeTextArea = (e) => {
    let value = e?.target?.value;
    const len = value?.length;

    if (len <= maxLen) {
      setData(value);
      onChange(value);

      if (isCompositionRef.current) return false;

      let resultValue = '';

      const arr = value?.split('');
      let lineFeedIndex = -1;
      arr?.reverse().forEach((val, i) => {
        if (value.charCodeAt(i) === 10) {
          lineFeedIndex = i;
        }
      });

      if (lineFeedIndex > -1) {
        resultValue = value.slice(lineFeedIndex, len);
      } else {
        const index = getCursorIndex();
        resultValue = value.slice(0, index + 1);
      }

      setHiddenData(resultValue);
    }
  };

  // 获取当前话题
  const getCurrentTopic = () => {
    const index = data?.lastIndexOf('#');
    const topic = data?.slice(index + 1, data?.length);

    onInputTopic(topic);
  };

  // 点击话题列表中的话题时
  const onClickTopicItemFunc = (e) => {
    const index = data?.lastIndexOf('#');
    const len = data?.length;
    const resultValue =
      data?.substring(0, index) +
      '#' +
      e +
      '#' +
      data?.substring(index + 1, len);
    setData(resultValue);
    onChange(resultValue);
    onClickTopicItem(e);
  };

  // 点击输入框
  const onClickInput = (e) => {
    const index = getCursorIndex();
    if (index !== e?.target?.value?.length && showTopic) setShowTopic(false);
  };

  useEffect(() => {
    const markNumber = getMarkNumber(hiddenData);
    if (markNumber % 2 !== 0) {
      getCurrentTopic();
      setTopicPos(getTopicListPos());
      setShowTopic(true);
    } else {
      showTopic && setShowTopic(false);
    }
  }, [hiddenData]);

  return (
    <div className="topic-textarea-comp">
      <textarea
        type="textarea"
        placeholder={placeholder}
        className="topic-textarea"
        onChange={onChangeTextArea}
        onCompositionStart={(e) => (isCompositionRef.current = true)}
        onCompositionEnd={(e) => {
          isCompositionRef.current = false;
          onChangeTextArea(e);
        }}
        onClick={onClickInput}
        value={data}
        ref={inputRef}
        {...other}
      />
      <pre ref={hiddenWidthRef} className="hidden-text-width">
        {hiddenData}
      </pre>
      <pre
        ref={hiddenHeightRef}
        className="hidden-text-height"
        dangerouslySetInnerHTML={{
          __html: data?.replace(/\n/gi, (str) => {
            return '<br />';
          }),
        }}
      ></pre>
      {maxLen && (
        <div>
          {data?.length}/{maxLen}
        </div>
      )}
      <TopicList
        {...topicPos}
        topicListData={topicList}
        onClickTopicItem={onClickTopicItemFunc}
        setShowTopic={setShowTopic}
        renderTopicItem={renderTopicItem}
      />
    </div>
  );
}
