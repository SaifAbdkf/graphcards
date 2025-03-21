export default function DeckMenu() {
  return (
    <Menu menuButton={<EllipsisVertical />}>
      <MenuItem onClick={() => handleDeckEditIConClick(deckInfo._id)}>
        <div className={`${styles.itemDiv}`}>
          <Pencil className={`${styles.deckEditIcon}`} size={14} />
          <div>Edit</div>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleDeleteDeck(deckInfo._id)}>
        <div className={`${styles.itemDiv}`}>
          <Trash className={`${styles.deckTrashIcon}`} size={14} />
          <div>Delete</div>
        </div>
      </MenuItem>
    </Menu>
  );
}
