// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageSync(
  key,
  defaultValue = {name: ''},
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage).name
    }
    return typeof defaultValue === "function"? defaultValue() : defaultValue;
  })

  const prevRef = React.useRef(key)

  React.useEffect(() => {
    if(prevRef.current !== key){
      window.localStorage.removeItem(prevRef.current)
    }
    prevRef.current = key
    window.localStorage.setItem(key, serialize({name: state}))
  }, [key, state, serialize])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageSync('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
