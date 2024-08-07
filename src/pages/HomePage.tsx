import { useState } from 'react';
import { Button, Input, Textarea } from '@headlessui/react';
import { toast } from 'react-toastify';
import clipboardCopy from 'clipboard-copy';
// import OpenAI from 'openai';
//
// const openai = new OpenAI({
//   apiKey: import.meta.env.OPEN_AI_KEY, // This is the default and can be omitted
// });
//
// const chatCompletion = await openai.chat.completions.create({
//   messages: [{ role: 'user', content: 'Say this is a test' }],
//   model: 'gpt-3.5-turbo',
// });

const HomePage = () => {
  const [prefix, setPrefix] = useState('color');
  const [colorsInput, setColorsInput] = useState('');
  const [cssVariablesOutput, setCssVariablesOutput] = useState('');
  const [tsConfigOutput, setTsConfigOutput] = useState('');

  const convertHandler = () => {
    try {
      console.log(colorsInput);
      const colorsObject = JSON.parse(colorsInput);
      const cssVariablesResult = convertObjectToCssVariables(colorsObject, prefix);
      const twConfigResult = convertColorsToTwConfig(colorsObject, prefix);

      setCssVariablesOutput(cssVariablesResult);
      setTsConfigOutput(JSON.stringify(twConfigResult, null, 2));
    } catch (error) {
      console.error('Error parsing JSON:', error);
      toast.error('JSON 형식에 맞추어 제대로 입력해주세요.');
    }
  };

  const copyToClipboard = (text: string) => {
    clipboardCopy(text);
    toast.success('복사 완료');
  };

  return (
    <main className="flex flex-col gap-3">
      <h1 className="text-title1-bold text-center py-1">Css Object to Css var & tailwind config</h1>
      <section className="px-2 py-1">
        <label htmlFor="color-object-input" className="text-body1-bold text-gray-600">
          1. 색상 Object 입력하세요.
        </label>
        <Input
          type="text"
          value={prefix}
          className="block rounded-md border border-gray-600 px-2"
          placeholder="color"
          onChange={e => setPrefix(e.target.value)}
        />
        <Textarea
          id="color-object-input"
          value={colorsInput}
          placeholder='예시 {"red": {"100": "#010101"}, "blue": "#111111"}'
          rows={5}
          className="w-full text-body1-regular text-gray-800 bg-gray-100 border rounded-md p-2 mt-2"
          onChange={e => setColorsInput(e.target.value)}
        />
        <Button
          disabled={!colorsInput}
          className="rounded bg-sky-600 py-2 px-4 text-body1-bold text-white hover:bg-sky-500 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
          onClick={convertHandler}
        >
          변경하기
        </Button>
      </section>

      <section className="px-2 py-1">
        <p className="text-body1-bold  text-gray-600">2. CSS Variable</p>
        <Textarea
          readOnly
          value={cssVariablesOutput}
          rows={5}
          className="text-body1-regular text-gray-800 bg-gray-100 border rounded-md p-2 mt-2 w-full"
        />
        <Button
          disabled={!cssVariablesOutput}
          className="rounded bg-sky-600 py-2 px-4 text-body1-bold text-white hover:bg-sky-500 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
          onClick={() => copyToClipboard(cssVariablesOutput)}
        >
          복사하기
        </Button>
      </section>

      <section className="px-2 py-1">
        <p className="text-body1-bold  text-gray-600">3. Tailwind Config with Css Variables</p>
        <Textarea
          readOnly
          value={tsConfigOutput}
          rows={5}
          className="text-body1-regular text-gray-800 bg-gray-100 border rounded-md p-2 mt-2 w-full"
        />
        <Button
          disabled={!tsConfigOutput}
          className="rounded bg-sky-600 py-2 px-4 text-body1-bold text-white hover:bg-sky-500 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
          onClick={() => copyToClipboard(tsConfigOutput)}
        >
          복사하기
        </Button>
      </section>
    </main>
  );
};

const convertObjectToCssVariables = (colors: Record<string, any>, prefix = 'color') => {
  const cssVariables: string[] = [];

  function traverseColors(obj: Record<string, any>, prefix: string) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        traverseColors(obj[key], `${prefix}-${key}`);
      } else {
        cssVariables.push(`--${prefix}-${key}: ${obj[key]};`);
      }
    }
  }

  traverseColors(colors, prefix);
  return cssVariables.join('\n');
};

const convertColorsToTwConfig = (colors: Record<string, any>, prefix = 'color') => {
  const tsConfigColors = {};

  function traverseColors(obj: Record<string, any>, prefix: string) {
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        result[key] = traverseColors(obj[key], `${prefix}-${key}`);
      } else {
        result[key] = `vars(--${prefix}-${key})`;
      }
    }
    return result;
  }

  Object.assign(tsConfigColors, traverseColors(colors, prefix));
  return tsConfigColors;
};

export default HomePage;
