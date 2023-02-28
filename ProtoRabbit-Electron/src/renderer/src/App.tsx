

function App(): JSX.Element {
  return (
    <button
      onClick={async () => {
        const r = await window.MYAPI.do()
        console.log(r)
      }}
    >
      GO
    </button>
  )
}

export default App
