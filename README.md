本组件为可随意插入话题的输入框，话题使用#包裹，如：#话题#

-- maxLen 为输入框最大可以输入的字符数
-- onInputTopic 为输入的话题
-- topicList

```js
import TextArea from 'topic-textarea';
<TextArea
  maxLen={1000}
  onInputTopic={(e) => console.log(e)}
  topicList={['11', '22']}
  onClickTopicItem={(e) => console.log(e)}
  onChange={(e) => console.log(e)}
/>;
```
