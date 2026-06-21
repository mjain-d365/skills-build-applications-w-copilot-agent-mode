import {
  listItems,
  getItemById,
  createItem,
} from '../services/items.service.js';

export function getItemsController(_req, res) {
  res.status(200).json(listItems());
}

export function getItemByIdController(req, res, next) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid item id' });
  }

  const item = getItemById(id);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  return res.status(200).json(item);
}

export function createItemController(req, res, next) {
  try {
    const { name } = req.body ?? {};

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'name is required and must be a string' });
    }

    const created = createItem({ name });
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
}
