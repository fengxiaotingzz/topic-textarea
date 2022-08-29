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
  srcollOptons = {},
  ...other
}) {
  const [data, setData] = useState('');
  const [hiddenWidthData, setHiddenWidthData] = useState('');
  const [hiddenHeightData, setHiddenHeightData] = useState('');
  const [showTopic, setShowTopic] = useState(false);
  const [topicPos, setTopicPos] = useState({});
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
  const getCursorIndex = () => window.getSelection().anchorOffset || 0;

  // 获取话题显示的位置
  const getTopicListPos = () => {
    const inputWidth = inputRef.current?.offsetWidth;
    const inputHeight = inputRef.current?.offsetHeight;
    let hiddenWidth = hiddenWidthRef.current.offsetWidth;
    let lineNumber = parseInt(hiddenWidth / inputWidth) + 1;

    let width = hiddenWidth;
    if (hiddenWidth > inputWidth) {
      width = hiddenWidth % inputWidth;
    }

    let height = hiddenHeightRef.current?.clientHeight;
    if (height > inputHeight) {
      height = inputHeight;
    }

    lineNumberRef.current = lineNumber;

    return {
      width,
      height,
    };
  };

  const onChangeTextArea = (e) => {
    let value = e?.target?.innerText;
    const len = value?.length;

    if (len <= maxLen) {
      setData(value);
      onChange(value);

      const index = getCursorIndex();

      console.log(
        1,
        index,
        window.getSelection().anchorOffset,
        window.getSelection().focusOffset,
      );

      const markNumber = getMarkNumber(value);
      let lastLineIndex = value.substring(0, index + 1).lastIndexOf('\n');

      if (markNumber % 2 !== 0) {
        lastLineIndex = lastLineIndex > -1 ? lastLineIndex : 0;
        indexRef.current = index;
        setHiddenWidthData(value.substring(lastLineIndex, index + 1));
        setTopicPos(getTopicListPos());
      } else {
        setHiddenWidthData('');
        setTopicPos({});
      }
    }
  };

  useEffect(() => {
    if (topicPos?.width && topicPos?.height) {
      setShowTopic(true);
    }
  }, [topicPos]);

  // 获取当前话题
  // const getCurrentTopic = () => {
  //   const index = data?.lastIndexOf('#');
  //   const topic = data?.slice(index + 1, data?.length);

  //   onInputTopic(topic);
  // };

  // 点击话题列表中的话题时
  const onClickTopicItemFunc = (e) => {
    const index = indexRef.current;
    const node = inputRef.current;
    const value = node.innerText;
    const len = value?.length;

    const lastMarkIndex = value?.substring(0, index).lastIndexOf('#');
    const resultValue =
      value?.substring(0, lastMarkIndex + 1) +
      e +
      '#' +
      value?.substring(index, len);
    setData(resultValue);
    onChange(resultValue);
    setHiddenWidthData('');
    setHiddenHeightData('');
    node.innerText = resultValue;
  };

  // 点击输入框
  // const onClickInput = (e) => {
  //   const index = getCursorIndex();
  //   indexRef.current = index;

  //   if (index !== e?.target?.value?.length && showTopic) setShowTopic(false);
  // };

  // useEffect(() => {
  //   const markNumber = getMarkNumber(data);

  //   if (markNumber % 2 !== 0) {
  //     const index = getCursorIndex();
  //     const lastLineIndex = data.substring(0, index).lastIndexOf('\n');
  //     const resultValue = data?.substring(lastLineIndex + 1, index);
  //     indexRef.current = index;

  //     setHiddenHeightData(data.substring(0, index));
  //     setHiddenWidthData(resultValue);
  //   } else {
  //     setShowTopic(false);

  //     const arr = data.match(/(?<=#).*?(?=#)/gi);
  //     const topics = arr?.filter((val, i) => i % 2 === 0);

  //     onClickTopicItem(topics);
  //   }
  // }, [data]);

  // useEffect(() => {
  //   const markNumber = getMarkNumber(data);

  //   if (markNumber % 2 !== 0) {
  //     getCurrentTopic();
  //     setTopicPos(getTopicListPos());
  //     setShowTopic(true);
  //   } else {
  //     if (showTopic) {
  //       setShowTopic(false);
  //     }
  //   }
  // }, [hiddenWidthData]);

  return (
    <div className="topic-textarea-comp">
      <div
        contentEditable="true"
        type="textarea"
        placeholder={placeholder}
        className="topic-textarea"
        // onChange={onChangeTextArea}
        onKeyUp={onChangeTextArea}
        // onClick={onClickInput}
        ref={inputRef}
        {...other}
      ></div>
      {/* <textarea
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
      /> */}
      <div ref={hiddenWidthRef} className="hidden-text-width">
        {hiddenWidthData}
      </div>
      <div
        ref={hiddenHeightRef}
        className="hidden-text-height"
        dangerouslySetInnerHTML={{
          __html: data?.replace(/\n/gi, ''),
        }}
      ></div>
      {maxLen && (
        <div className="textarea-number">
          {data?.length}/{maxLen}
        </div>
      )}
      {showTopic && topicList.length && (
        <TopicList
          {...topicPos}
          topicListData={topicList}
          onClickTopicItem={onClickTopicItemFunc}
          setShowTopic={setShowTopic}
          renderTopicItem={renderTopicItem}
          srcollOptons={srcollOptons}
        />
      )}
    </div>
  );
}
