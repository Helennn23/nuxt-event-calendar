export default function () {
  const aboutVar = useState('clientCart', () => 'about var')

  function changeAboutVar (str: string) {
    aboutVar.value = str
  }

  return {
    aboutVar: computed(() => aboutVar.value),
    changeAboutVar
  }
}
