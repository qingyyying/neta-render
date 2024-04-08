import { useEffect, useRef } from 'react'
import './App.css'
import { Application, Container, Graphics, RendererType, STable } from './core'


const columns = [{label: "姓名",key: "name",},{label: "年龄",key: "age",},
{label: "学校",key: "school"},{label: "分数",key: "source"},{label: "操作",key: "options"}];
const mockData = [
  {
    name: "张三",
    id: 0,
    age: 0,
    school: "公众号：Web技术学苑",
    source: 800,
  },
];
const tableData = new Array(30).fill(mockData[0]).map((v, index) => {
  return {
    ...v,
    id: index,
    name: `${v.name}-${index + 1}`,
    age: v.age + index + 1,
    source: v.source + index + 1,
  };
});


function App() {
  const appRef = useRef<Application>()
  useEffect(() => {
    console.log('22');
    appRef.current = new Application({
      rendererType: RendererType.Canvas,
      el: document.getElementById("canvans")!,
      backgroundColor: '#aaaaaa'
    })
  }, [])

  useEffect(() => {
    // 测试代码
    const blackGraphic = new Graphics()
    blackGraphic.beginFill('black')
    blackGraphic.drawRect(0, 0, 300, 300)
    
    const redGraphic = new Graphics()
    redGraphic.beginFill('red')
    redGraphic.drawRect(0, 0, 200, 200)
    
    const container1 = new Container()
    container1.addChild(blackGraphic)
    container1.addChild(redGraphic)
    
    console.log('container1: ', container1);

    const container2 = new Container()
    container2.addChild(container1)
    
    const greenGraphic = new Graphics()
    greenGraphic.beginFill('green')
    greenGraphic.drawRect(150, 0, 180, 180)
    
    container2.addChild(greenGraphic)
    
    const yellowGraphic = new Graphics()
    yellowGraphic.beginFill('yellow')
    yellowGraphic.drawRect(0, 0, 250, 150)
    

    appRef.current?.stage.addChild(container2)
    appRef.current?.stage.addChild(yellowGraphic)

  }, [])

  return (
    <>
      <canvas id="canvans" width="800" height="800"></canvas>
    </>
  )
}

export default App
