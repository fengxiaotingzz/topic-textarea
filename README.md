本组件为可随意插入话题的输入框，话题使用#包裹，如：#话题#

暂时不可直接更改输入框的 padding 等影响输入框整体宽度的属性

-- maxLen 为输入框最大可以输入的字符数
-- onInputTopic 为输入的话题
-- topicList

```js
import TextArea from 'topic-textarea';
<Textarea
  maxLen={1000}
  onInputTopic={(e) => console.log(11, e)}
  topicList={['11', '22']}
  onClickTopicItem={(e) => console.log(222, e)}
  renderTopicItem={({ value, index }) => <div>xxxx{value}</div>}
  onChange={(e) => console.log(e)}
/>;
```
