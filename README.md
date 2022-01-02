# useState로 hooks 만들어 보기

## useInput

### 기존 Input 핸들링

```js
function App() {
  const [value, setValue] = useState("");
  const onChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <div className="App">
      <h1>HELLO</h1>
      <input type="text" value={value} onChange={onChange} />
    </div>
  );
}
```

### 커스텀 useInput

```js
const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (event) => {
    setValue(event.target.value);
  };

  return [value, onChange];
};

function App() {
  const [value, changeValue] = useInput("");

  return (
    <div className="App">
      <h1>HELLO</h1>
      <input type="text" value={value} onChange={changeValue} />
    </div>
  );
}
```

## useTabs

```js
const example = [
  {
    tabName: "Section 1",
    content: "This is Section 1 contnet...",
  },
  {
    tabName: "Section 2",
    content: "This is Section 2 contnet...",
  },
];

const useTabs = (initialIndex, allTabs) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  return [allTabs[currentIndex], setCurrentIndex];
};

function App() {
  const [currentItem, changeItem] = useTabs(0, example);

  return (
    <div className="App">
      <h1>HELLO</h1>
      {example.map((item, idx) => (
        <button onClick={() => changeItem(idx)}>{item.tabName}</button>
      ))}
      <div>{currentItem.content}</div>
    </div>
  );
}
```

# useEffect로 hooks 만들어 보기

## useTitle

> html의 title을 변경해보자. react라고 document.querySelector()를 사용하지 않을 필요는 없었다

```js
const useTitle = (initialTitle) => {
  const [title, setTitle] = useState(initialTitle);
  const updateTitle = () => {
    const htmlTitle = document.querySelector("title");
    htmlTitle.innerHTML = title;
  };

  useEffect(updateTitle, [title]);

  return setTitle;
};

function App() {
  const setTitle = useTitle("loading...");
  // setTimeout(() => {
  //   setTitle("success");
  // }, 2000); // 변경확인을 위한 예시
  return (
    <div className="App">
      <h1>HELLO TITLE</h1>
    </div>
  );
}
```

## useRef 사용해서 useClick 만들기

> useRef는 document.getElementById 와같은 기능으로 특정 element를 선택할수있다

### useRef 사용법

```js
function App() {
  const input = useRef();

  useEffect(() => {
    console.log(input.current);
    input.current.focus();
  }, []);

  return (
    <div className="App">
      <h1>HELLO Click</h1>
      <input ref={input} type="text" />
    </div>
  );
}
```

### useClick 만들기

> 핵심은, eventListener 을 컴포넌트가 unmount 될때 같이 제거해 주는 것이다

```js
const useClick = (onClickFn) => {
  const element = useRef();

  useEffect(() => {
    element.current.addEventListener("click", () => {
      onClickFn();
    });

    return () => {
      element.current.removeEventListener("click", () => {
        onClickFn();
      });
    };
  }, []);

  return element;
};

function App() {
  const clickRef = useClick(() => console.log("hi"));

  return (
    <div className="App">
      <h1 ref={clickRef}>HELLO Click</h1>
    </div>
  );
}
```

## useConfirm

```js
const useConfirm = (msg = "", callback, callback2) => {
  const confirmAction = () => {
    if (window.confirm(msg)) {
      callback();
    } else {
      callback2();
    }
  };

  return confirmAction;
};

function App() {
  const deleteFn = () => {
    console.log("삭제되었습니다");
  };
  const cancelFn = () => {
    console.log("취소되었습니다");
  };
  const confirmDelete = useConfirm(
    "정말 삭제하시겠습니까?",
    deleteFn,
    cancelFn
  );
  return (
    <div className="App">
      <button onClick={confirmDelete}>눌러보기</button>
    </div>
  );
}
```

## usePreventLeave

> 페이지를 끄거나, 새로고침할때 확인 메세지 띄우기

- `event.preventDefault();` 는 없어도 동작함
- `event.returnValue = "";` 없으면 동작 안함

```js
const usePreventLeave = () => {
  const listener = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };

  const enablePrevent = () => {
    window.addEventListener("beforeunload", listener);
  };
  const disablePrevent = () => {
    window.removeEventListener("beforeunload", listener);
  };
  return [enablePrevent, disablePrevent];
};

function App() {
  const [enablePrevent, disablePrevent] = usePreventLeave();
  return (
    <div className="App">
      <button onClick={enablePrevent}>나가기전 물어보기</button>
      <button onClick={disablePrevent}>신경끄기</button>
    </div>
  );
}
```

## useBeforeLeave

> 사용자가 마우스를 document에서 leave 할때

```js
const useBeforeLeave = (callback) => {
  const handle = (e) => {
    const { clientY } = e;
    if (clientY <= 0) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle);
  }, []);
};

function App() {
  useBeforeLeave(() => console.log("dont leave.."));
  return (
    <div className="App">
      <h1>Mouse Leave event</h1>
    </div>
  );
}
```
