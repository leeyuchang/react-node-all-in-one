import React from 'react'
import './App.css'
import Buttons from './components/Buttons'
import TaskList from './components/TaskList'


// const fetch = async () => {
//   axios
//     .get('/test')
//     .then((data) => {
//       console.log(data)
//       console.log('1passed1')
//     })
//     .catch(({response:{data:{msg}}}) => {
//       console.error(msg)
//       console.log('2passed')
//     })
// }

export default function App() {
  return (
    <div style={{margin: 20}}>
    <Buttons />
    <TaskList />
  </div>
  )
}
