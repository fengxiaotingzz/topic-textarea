import React, { useState, useRef, useEffect } from "react";
import TopicList from "../topicList";

import "./index.less";

export default function TopicTextarea({
  placeholder = "",
  maxLen,
  onChange = () => {},
}) {
  const [data, setData] = useState("");
  const [hiddenData, setHiddenData] = useState("");
  const [showTopic, setShowTopic] = useState(false);
  const [topicPos, setTopicPos] = useState({ width: 0, height: 0 });
  const inputRef = useRef();
  const hiddenRef = useRef();
  const textWidthRef = useRef(0);
  const lastLineNumber = useRef(0);

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
      range?.moveStart("character", -target.value.length);
      position = range?.text?.length;
    }

    return position;
  };

  // 获取话题显示的位置
  const getTopicListPos = () => {
    const inputWidth = inputRef.current?.offsetWidth;
    let hiddenWrap = hiddenRef.current?.getBoundingClientRect();
    let hiddenWidth = hiddenWrap?.width;
    let hiddenHeight = hiddenWrap?.height;
    let lineNumber = parseInt(hiddenWidth / inputWidth) + 1;
    const lineFeedNum = data?.match(/\n/gi)?.length || 0;

    if (Math.floor(hiddenWidth / inputWidth) === 0) {
      textWidthRef.current = parseInt(hiddenWidth / hiddenData?.length);
    }
    hiddenWidth = hiddenWidth + textWidthRef.current * lineNumber;

    // hiddenWidth二次赋值之后，值最准确，计算height时，应以该值为准
    lineNumber = parseInt(hiddenWidth / inputWidth) + 1;

    let height = lineNumber * hiddenHeight;
    const width = hiddenWidth % inputWidth;
    const lastLineValue = lastLineNumber.current;
    const resultLineNumber = lastLineValue + 1;
    height = (lineFeedNum + resultLineNumber) * hiddenHeight;

    console.log(lineFeedNum, resultLineNumber, height);

    lastLineNumber.current = lineNumber;

    return {
      width,
      height,
    };
  };

  const onChangeTextArea = (e) => {
    const value = e?.target?.value;
    const len = value?.length;

    if (len <= maxLen) {
      setData(value);
      onChange(value);
      let resultValue = "";

      const arr = value?.split("");
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

  useEffect(() => {
    const markNumber = getMarkNumber(hiddenData);
    if (markNumber % 2 !== 0) {
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
        value={data}
        ref={inputRef}
      />
      <pre ref={hiddenRef} className="hidden-text">
        {hiddenData}
      </pre>
      {maxLen && (
        <div>
          {data?.length}/{maxLen}
        </div>
      )}
      {showTopic && <TopicList {...topicPos} />}
    </div>
  );
}
