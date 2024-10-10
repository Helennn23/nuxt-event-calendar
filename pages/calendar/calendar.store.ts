export default function () {
  const events = useState<any>('events', () => ({}))

  return {
    events
  }
}
