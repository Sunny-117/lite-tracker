function Greeting({ name }) {
    return (
        <>
            <h1>Hello: {name}</h1>
        </>
    );
}
function Child() {
    let list = {};
    return (
        <>
            子组件
            {list.map((item, key) => {
                <span key={key}>{item}</span>;
            })}
        </>
    );
}

function Main() {
    return (
        <>
            <Child />
            <Greeting name="World" />
            <Greeting name="Hello" />
        </>
    );
}
export default Main;
