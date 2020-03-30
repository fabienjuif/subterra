// TODO: use @fabienjuif/use-locales instead
export default (type) => {
  switch (type) {
    case 'experienced':
      return 'Add 1 to the rolled dice value'
    case 'heal':
      return 'Restore 1HP to a player'
    case 'protect':
      return 'Protect others players in the same tile'
    default:
      return ''
  }
}
