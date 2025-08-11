import WayTextBox from '@/components/WayPlus/WayTextBox';
import { useState } from 'react';

function props(
  name: string,
  type: string,
  issearch: boolean,
  onChange: (value: any) => void,
  onPressEnter: (value: any) => void,
) {
  return {
    attr: {
      type: type,
    },
    name: name,
    search: issearch,
    width: '100%',
    onChange: (value: any) => {
      if (onChange) onChange(value);
    },
    onPressEnter: (value: any) => {
      if (onPressEnter) onPressEnter(value);
    },
  };
}
export default () => {
  const [stringvalue, setStringValue] = useState('');
  const [numbervalue, setNumberValue] = useState(0);
  const [boolvalue, setBoolValue] = useState(false);
  function select() {}
  function date() {}
  function boolean() {
    return (
      <div>
        <div>是否输入</div>
        <WayTextBox {...props('boolean', 'boolean', false, setBoolValue)} />
        <div>{boolvalue}</div>
      </div>
    );
  }
  function number() {
    return (
      <div>
        <div>数字输入</div>
        <WayTextBox {...props('STRING1', 'int', false, setNumberValue)} />
        <div>{numbervalue}</div>
      </div>
    );
  }
  function string() {
    return (
      <div>
        <div>字符输入</div>
        <WayTextBox {...props('STRING1', 'string', false, setStringValue)} />
        <div>{stringvalue}</div>
      </div>
    );
  }
  function render() {
    return (
      <>
        {string()}
        {number()}
        {boolean()}
        {date()}
        {select()}
      </>
    );
  }
  return render();
};
