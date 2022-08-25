import React, { useState, useRef, useEffect } from 'react';
import TopicList from '../topicList';

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
  const [hiddenWidthData, setHiddenWidthData] = useState('');
  const [hiddenHeightData, setHiddenHeightData] = useState('');
  const [showTopic, setShowTopic] = useState(false);
  const [topicPos, setTopicPos] = useState({ width: 0, height: 0 });
  const inputRef = useRef();
  const hiddenWidthRef = useRef();
  const hiddenHeightRef = useRef();
  const textWidthRef = useRef(0);
  const isCompositionRef = useRef(false);
  const indexRef = useRef();
  const lineNumberRef = useRef(0);

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
    const inputHeight = inputRef.current?.offsetHeight;
    let hiddenWrap = hiddenWidthRef.current?.getBoundingClientRect();
    let hiddenWidth = hiddenWrap?.width;
    let lineNumber = parseInt(hiddenWidth / inputWidth) + 1;

    if (Math.floor(hiddenWidth / inputWidth) === 0) {
      textWidthRef.current = parseInt(hiddenWidth / hiddenWidthData?.length);
    }
    hiddenWidth = hiddenWidth + textWidthRef.current * lineNumber;

    const width = hiddenWidth % inputWidth;
    let height = hiddenHeightRef.current?.clientHeight;

    if (height > inputHeight) {
      height = inputHeight;
    }

    lineNumberRef.current = lineNumber;

    return {
      width: width,
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
    const index = indexRef.current;
    const len = data?.length;
    const lastMarkIndex = data?.substring(0, index).lastIndexOf('#');
    const resultValue =
      data?.substring(0, lastMarkIndex + 1) +
      e +
      '#' +
      data?.substring(index, len);

    setData(resultValue);
    onChange(resultValue);
    setHiddenWidthData('');
    setHiddenHeightData('');
  };

  // 点击输入框
  const onClickInput = (e) => {
    const index = getCursorIndex();
    indexRef.current = index;

    if (index !== e.target.value.length && showTopic) setShowTopic(false);
  };

  useEffect(() => {
    const markNumber = getMarkNumber(data);

    if (markNumber % 2 !== 0) {
      const index = getCursorIndex();
      const lastLineIndex = data.substring(0, index).lastIndexOf('\n');
      const resultValue = data?.substring(lastLineIndex + 1, index);
      indexRef.current = index;

      setHiddenHeightData(data.substring(0, index));
      setHiddenWidthData(resultValue);
    } else {
      setShowTopic(false);

      const arr = data.match(/(?<=#).*?(?=#)/gi);
      const topics = arr?.filter((val, i) => i % 2 === 0);

      onClickTopicItem(topics);
    }
  }, [data]);

  useEffect(() => {
    const markNumber = getMarkNumber(data);

    if (markNumber % 2 !== 0) {
      getCurrentTopic();
      setTopicPos(getTopicListPos());
      setShowTopic(true);
    } else {
      if (showTopic) {
        setShowTopic(false);
      }
    }
  }, [hiddenWidthData]);

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
      <div ref={hiddenWidthRef} className="hidden-text-width">
        {hiddenWidthData}
      </div>
      <div
        ref={hiddenHeightRef}
        className="hidden-text-height"
        dangerouslySetInnerHTML={{
          __html: hiddenHeightData?.replace(/\n/gi, (str) => {
            return '<br />';
          }),
        }}
      ></div>
      {maxLen && (
        <div className="textarea-number">
          {data?.length}/{maxLen}
        </div>
      )}
      {showTopic && (
        <TopicList
          {...topicPos}
          topicListData={topicList}
          onClickTopicItem={onClickTopicItemFunc}
          setShowTopic={setShowTopic}
          renderTopicItem={renderTopicItem}
        />
      )}
    </div>
  );
}
