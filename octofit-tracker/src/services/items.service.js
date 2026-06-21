const items = [
  { id: 1, name: 'Water bottle' },
  { id: 2, name: 'Yoga mat' },
];

let nextId = 3;

export function listItems() {
  return items;
}

export function getItemById(id) {
  return items.find((item) => item.id === id);
}

export function createItem(payload) {
  const newItem = {
    id: nextId++,
    name: payload.name,
  };

  items.push(newItem);
  return newItem;
}
