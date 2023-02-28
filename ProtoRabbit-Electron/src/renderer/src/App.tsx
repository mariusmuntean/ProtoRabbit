function App(): JSX.Element {
  return (
    <button
      onClick={async () => {
        const r = await window.MYAPI.do()
        console.log(r)

        await window.MYAPI.connect()
        window.MYAPI.send('HEY')
      }}
    >
      GO
    </button>
  )
}

export default App
